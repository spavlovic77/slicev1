import Web3Container from '../../../lib/infra/Web3Containter'
import Navbar from '../../../lib/components/Navbar'
import Alert from 'react-bootstrap/Alert'
import { Loader } from '@googlemaps/js-api-loader';
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import useSWR from "swr";
import Spinner from 'react-bootstrap/Spinner'
import { Loading, Icon } from 'web3uikit';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const Map = ({ accounts, slice, fightFactory, networkId }) => {
  const router = useRouter()
  const {address} = router.query
  const googlemap = useRef(null);


  const allFights = async(slice, accounts, address) =>{
    const stakedFight = await slice.methods.getStakedByFight(address).call({ from: accounts[0] })
    return stakedFight
}

const details =  async(slice, accounts, stakedByFights) =>  {
  const listN =[]
  for (let i=0; i<stakedByFights.length; i++) {
    const mintersData =  await slice.methods.getMinter(stakedByFights[i].staker).call({ from: accounts[0] }).then(data => {
      listN.push({contract: stakedByFights[i].staker, Lat: data[3], Lon: data[4], Nick: data[5], Reported: data[1], GoodPoints: data[0], Whitelisted: data[6]})
     })
  }
  return listN
}

const { data: stakedByFights, errorStaked } = useSWR([slice, accounts,address, 'allStakedFights'], allFights)
const { data: mintersData } = useSWR(stakedByFights ? [slice, accounts, stakedByFights, 'stakedByFights'] : null, details)
console.log({stakedByFights}, {mintersData})
const [bad, setBadActor] = useState(false)
const [good, setGoodActor] = useState(false)
const [spinnerGood, setSpinnerGood] = useState(false)
const [spinnerBad, setSpinnerBad] = useState(false)

useEffect(() => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    version: 'weekly',
  });
  let map; 
  loader.load().then(() => {
    const google = window.google;
    map = new google.maps.Map(googlemap.current, {
      center: {lat: 48.1486, lng: 17.1077},
      zoom: 2,
    });
    Marker(); 
    function Marker() {
      if (mintersData) {
        mintersData
        .map((minter, index) => { 
        const LT= minter.Lat
        const a= LT.replace(/[']/g, '')
        const LO= minter.Lon
        const b= LO.replace(/[']/g, '')
        const Nick = minter.Nick
        const reported = minter.Reported
        const goodPoints = minter.GoodPoints
        const location = new google.maps.LatLng(a, b);
        const addr= minter.contract
        const white= minter.Whitelisted
        const ind=index
        addMarker(ind, location, Nick, reported, goodPoints, addr, white);
      })
    } else {console.log('no data')}
    }

    function addMarker(ind, location, Nick, reported, gPoints, contract, white) {
      
      const Report = async() => {
        setSpinnerBad(true)
        handleShowBad()
        await slice.methods.reportBadActor(contract).send({ from: accounts[0]})
        .on('receipt', receipt => {
          console.log('bad points reported');
          setSpinnerBad(false)
        })
        .then(setBadActor(!bad))}
      
        
        const goodPoints = async() => {
          setSpinnerGood(true)
          handleShowGood()
          await slice.methods.reportGoodActor(contract).send({ from: accounts[0], value: priceOfGood})
          .on('receipt', receipt => {
            console.log('good points reported');
            setSpinnerGood(false)
          })
          .then(setGoodActor(!good))}

      const addrShortStart= contract.substring(0,6)
      const addrShortEnd= contract.substring(38,42)
      let label;
      if (white==true) {label='Good'} else {label='Blacklisted'}
      
      const marker = new google.maps.Marker({
          position: location,
          map: map
      });
     
      var infowindow = new google.maps.InfoWindow({
        content: " "
      });
      google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker); 
      google.maps.event.addListener(infowindow, "domready", function () {
        infowindow.setContent('<p><b>Nickname:</b> '+Nick+'</p>' +
        '<p><b>Address: </b>'+addrShortStart+'...'+addrShortEnd+''+
        '<p><b>Health:</b> '+label+'</p>'+
                '<p id="button-report"><b>Reported:</b> '+reported+'/'+sliceParameters[2]+' <button id="button-f'+ind+'" onclick="Report('+contract+')">Report</button></p>' +
                '<p id="button-unreport"><b>Good points:</b> '+gPoints+'/'+sliceParameters[3]+' <button id="button-ok'+ind+'" onclick="goodPoints('+contract+')">Unreport</button></p>'
                    );
                    document.getElementById('button-f'+`${ind}`).onclick=Report
                    document.getElementById('button-ok'+`${ind}`).onclick=goodPoints       
      });
      });

    }
  }, [mintersData, good, bad]);  
});

const fetchPriceOfGood = (slice, accounts) => (...args) => {
  const [arg1, arg2,arg3] = args
    const address = arg1
    const method = arg2
    const arg=arg3
    const priceOfGood = slice.methods.getGoodP().call({ from: accounts[0] }).then((data) => {return data})
    console.log('price', priceOfGood)
    return priceOfGood
}
const { data: priceOfGood, error } = useSWR('priceOfGood', {fetcher: fetchPriceOfGood(slice, accounts)})

const sliceParams = (slice, accounts) => (...args) => {
  const [arg1, arg2,arg3] = args
    const address = arg1
    const method = arg2
    const arg=arg3
    const sliceParameters = slice.methods.sliceParams().call({ from: accounts[0] }).then((data) => {return data})
    return sliceParameters
}
const { data: sliceParameters, errorParams } = useSWR('sliceParameters', {fetcher: sliceParams(slice, accounts)})

const [freshMintData, setFreshMintData] = useState(true)
const [loadingMintData, setLoadingMintData] = useState(false)
const [staked, setStaked] = useState(undefined)
const [vSliceBalance, setVSliceBalance] = useState(undefined)
const [whitel, setIsWL] = useState()
const [isReg, setIsRegistered] = useState()
const [minter, setMinter] = useState()
const [mintingSpeed, setMintingSpeed] = useState()
const [start, setStart] = useState()

useEffect(() => {
  const init = async () => {
    try { 
        const vSliceBalance = await slice.methods.vSliceViewBalance(accounts[0]).call({ from: accounts[0] })
        .then(data => {
          setVSliceBalance(data)
        }) 
        const wlist = await slice.methods.wl(accounts[0]).call({ from: accounts[0] })
        .then(data => {
          setIsWL(data)
        })
        const reg = await slice.methods.isRegistered(accounts[0]).call({ from: accounts[0] })
        .then(data => {
          setIsRegistered(data)
        })
        const Minter = await slice.methods.getMinter(accounts[0]).call({ from: accounts[0] })
        .then(data => {
          setMinter(data)
        })
        const MintSpeed = await slice.methods.getMintingSpeed().call({ from: accounts[0] })
        .then(data => {
          setMintingSpeed(data)
        })
        const start = await slice.methods.getStart().call({ from: accounts[0] })
        .then(data => {
          setStart(data)
        })              
        const stakedSliceBalance = await slice.methods.getStakedBalance().call({ from: accounts[0] })
        .then(data => {
          setStaked(data)
          setLoadingMintData(true)
        })
    } catch(e) {
      alert(e);
    }};
  init();
}, [freshMintData]);

const [showSpinnerMinter, setShowSpinnerMinter] = useState(false)
const handleMint = async () => {
  setShowSpinnerMinter(true)
  await slice.methods.vSliceMinting_ExW().send({ from: accounts[0] })
  .on('receipt', receipt => {
    setShowSpinnerMinter(false)
    setFreshMintData(!freshMintData)
  })
  };
  // modal for Unreporting
  const [showGood, setShowGood] = useState(false);
  const handleCloseGood = () => {
    setShowGood(false);
    window.location.reload()}
  const handleShowGood = () => setShowGood(true);
  // modal for Reporting
  const [showBad, setShowBad] = useState(false);
  const handleCloseBad = () => {
    setShowBad(false);
    window.location.reload()}
  const handleShowBad = () => setShowBad(true);

  return (
    <>    
    {(!priceOfGood && !loadingMintData) && <div
          style={{
            backgroundColor: '#ECECFE',
            borderRadius: '8px',
            padding: '20px'
          }}
        >
          <Loading
            size={40}
            spinnerColor="#2E7DAF"
            text="Loading data from blockchains... "
          />
        </div>}
      {(priceOfGood && loadingMintData) && <Navbar whitel={whitel} isReg={isReg} minter={minter} mintingSpeed={mintingSpeed} start={start} showSpinnerMinter={showSpinnerMinter} networkId={networkId} staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} accounts={accounts} slice={slice} fightFactory={fightFactory}/>}
      
      <div id="map" ref={googlemap} />

      <Modal show={showGood} onHide={handleCloseGood}>
        <Modal.Header closeButton>
          <Modal.Title>
          <Icon
                fill="green"
                size={24}
                svg="lifeRing"
              />
                Unreporting user </Modal.Title>
        </Modal.Header>
        {spinnerGood && <Modal.Body>
          <Loading
              size={40}
              spinnerColor="green"
              text="Increasing user's health ... "
            />
          </Modal.Body>}
          {!spinnerGood && <Modal.Body>
            <Icon
                  fill="green"
                  size={24}
                  svg="checkmark"
                />
          Saved. You succesfully increased users health status
          </Modal.Body>}
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseGood}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBad} onHide={handleCloseBad}>
        <Modal.Header closeButton>
        <Modal.Title>
        <Icon
              fill="red"
              size={24}
              svg="bin"
            /> Reporting user </Modal.Title>
        </Modal.Header>
        {spinnerBad && <Modal.Body>
          <Loading
              size={40}
              spinnerColor="red"
              text="Decreasing user's health ... "
            />
          </Modal.Body>}
          {!spinnerBad && <Modal.Body>
            <Icon
                fill="green"
                size={24}
                svg="checkmark"
              />
          Saved. You succesfully decreased users health status
          </Modal.Body>}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseBad}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



    </>
  )
}

const index = () => (
  <Web3Container
    renderLoading={() => <div
      style={{
        backgroundColor: '#ECECFE',
        borderRadius: '8px',
        padding: '20px'
      }}
    >
      <Loading
        size={40}
        spinnerColor="#2E7DAF"
        text="Connecting to Blockchains... "
      />
    </div>}
    render={({ accounts, slice, fightFactory, web3, networkId }) => (
      <Map accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default index
