import Web3Container from '../../../lib/infra/Web3Containter'
import Navbar from '../../../lib/components/Navbar'
import Alert from 'react-bootstrap/Alert'
import { Loader } from '@googlemaps/js-api-loader';
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from "swr";


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
      listN.push({contract: stakedByFights[i].staker, Lat: data[3], Lon: data[4], Nick: data[5], Reported: data[1], GoodPoints: data[0]})
     })
  }
  return listN
}

const { data: stakedByFights, errorStaked } = useSWR([slice, accounts,address, 'allStakedFights'], allFights)
const { data: mintersData } = useSWR(stakedByFights ? [slice, accounts, stakedByFights, 'stakedByFights'] : null, details)
console.log({stakedByFights})
console.log({mintersData})

const [bad, setBadActor] = useState(false)
const [good, setGoodActor] = useState(false)

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
        mintersData.map(minter => { 
        const LT= minter.Lat
        const a= LT.replace(/[']/g, '')
        const LO= minter.Lon
        const b= LO.replace(/[']/g, '')
        const Nick = minter.Nick
        const reported = minter.Reported
        const goodPoints = minter.GoodPoints
        const location = new google.maps.LatLng(a, b);
        const addr= minter.contract
        addMarker(location, Nick, reported, goodPoints, addr);
      })
    } else {console.log('wtf')}
    }

    function addMarker(location, Nick, reported, gPoints, contract) {
      const marker = new google.maps.Marker({
          position: location,
          map: map
      });
      var infowindow = new google.maps.InfoWindow({
        content: " "
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<p><b>Nickname:</b> '+Nick+'</p>' +
                '<p><b>Reported:</b> '+reported+' times. <button id="button-f" onclick="Report('+contract+')">Report</button></p>' +
                '<p><b>Good points:</b> '+gPoints+'. <button id="button-ok" onclick="goodPoints('+contract+')">Add a good point</button></p>'
                    );

        infowindow.open(map, this); 
        google.maps.event.addListener(infowindow, "domready", function () {

          document.getElementById("button-f").onclick=Report
          document.getElementById("button-ok").onclick=goodPoints
        });
        const Report = async() => {
          await slice.methods.reportBadActor(contract).send({ from: accounts[0]})
          .then(setBadActor(!bad))}
        
          const goodPoints = async() => {
            await slice.methods.reportGoodActor(contract).send({ from: accounts[0], value: priceOfGood})
            .then(setGoodActor(!good))}
      });
    }

  }, [mintersData, good, bad]);  
});

const fetchPriceOfGood = (slice, accounts) => (...args) => {
  console.log('slice', slice, accounts)
  const [arg1, arg2,arg3] = args
    const address = arg1
    const method = arg2
    const arg=arg3
    const priceOfGood = slice.methods.getGoodP().call({ from: accounts[0] }).then((data) => {return data})
    console.log('price', priceOfGood)
    return priceOfGood
}
const { data: priceOfGood, error } = useSWR('priceOfGood', {fetcher: fetchPriceOfGood(slice, accounts)})

const [freshMintData, setFreshMintData] = useState(true)
const [loadingMintData, setLoadingMintData] = useState(false)
const [staked, setStaked] = useState(undefined)
const [vSliceBalance, setVSliceBalance] = useState(undefined)
useEffect(() => {
  const init = async () => {
    try { 
        const vSliceBalance = await slice.methods.vSliceViewBalance(accounts[0]).call({ from: accounts[0] })
        .then(data => {
          setVSliceBalance(data)
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
  })
  };

  return (
    <>    
      {error && <div>Error.....</div>}
      {!priceOfGood && <div>Loading price....</div>}
      {loadingMintData && <Navbar showSpinnerMinter={showSpinnerMinter} networkId={networkId} staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} accounts={accounts} slice={slice} fightFactory={fightFactory}/>}
      <div id="map" ref={googlemap} />
    </>
  )
}

const index = () => (
  <Web3Container
    renderLoading={() => <div><Alert variant='warning'>Loading Dapp Page...</Alert></div>}
    render={({ accounts, slice, fightFactory, web3, networkId }) => (
      <Map accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default index

