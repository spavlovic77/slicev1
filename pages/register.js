import Web3Container from '../lib/infra/Web3Containter'
import Footer from '../lib/components/Footer'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import Navbar from '../lib/components/Navbar'
import { useState, useEffect, useRef }  from 'react'
import { Loader } from '@googlemaps/js-api-loader';
import FormRegister from '../lib/components/FormRegister'
import { useRouter } from 'next/router'

const Register = ({ accounts, slice, fightFactory, networkId }) => {
  const googlemap = useRef(null);
  const [lon, setLon] = useState(undefined)
  const [lat, setLat] = useState(undefined)
  const [nick, setNick] = useState(undefined)
  const [defaultCenter, setDefaultCenter] = useState({ lat: -34.397, lng: 150.644 })
  const [zoom, setZoom] = useState(2)
  const [whiteList, setOnWhitelist] = useState(undefined)
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    // const [claimMessage, setClaimMessage] = useState({
    //   payload: undefined,
    //   type: undefined
    // });

    const handleRegister = async () => {
      console.log('lat, lon', lat, lon)
      //event.preventDefault();
      const address = accounts[0]
      // setClaimMessage({
      //   type: 'primary',
      //   payload: 'Processing your registration....'
      // });
      try {
        const response = await axios.post(
          '/api/whitelisting', 
          {
            address
          }
        );
        // setClaimMessage({
        //   type: 'primary',
        //   payload: `
        //     Submitting your account to the blockchain.....
        //     Address: ${response.data.address}
        //   `
        // });
        // console.log('sig', response.data.signature)
        // console.log('sig, lat, lon, nick', response.data.signature, lat, lon, nick)
        const receipt = await slice
          .methods
          .addToWhitelist_a7I(
            response.data.signature,
            `'`+lat+`'`,
            `'`+lon+`'`,
            nick
          )
          .send({from: accounts[0]});
          console.log(receipt)
          router.reload();
        // setClaimMessage({
        //   type: 'primary',
        //   payload: `Registraton success!
        //             Address: ${response.data.address}
        //   `
        // });
      } catch(e) {console.log(e)}
  //     {
  //       if(e.message === 'Request failed with status code 401') {
  //         setClaimMessage({
  //           type: 'danger',
  //           payload: `Registration failed
  // Reason: Address not registered`
  //         });
  //         return;
  //       }
  //       setClaimMessage({
  //         type: 'danger',
  //         payload: `Airdrop failed
  // Reason" Airdrop already sent to ${address}`
  //       });
  //     }
    };

    useEffect(() => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        version: 'weekly',
      });
      let map; 
      loader.load().then(() => {
        const google = window.google;
        map = new google.maps.Map(googlemap.current, {
          center: defaultCenter,
          zoom: zoom,
        });
        Marker();
        function Marker() {
          if (lat==undefined && lon==undefined) {return;} else {
          const CentralPark = new google.maps.LatLng(`${lat}`, `${lon}`);
          addMarker(CentralPark);}
        }
        function addMarker(location) {
          const marker = new google.maps.Marker({
              position: location,
              map: map
          });
        }
        map.addListener("rightclick", (event) => {
          var lat = event.latLng.lat();
          var lng = event.latLng.lng();
          var z = map.getZoom();
          setZoom(z)
          setDefaultCenter({ lat: +`${lat}`, lng: +`${lng}`})
          setLat(lat)
          setLon(lng)
        });
      });
      
    }, [lat, lon]);

    useEffect(() => {
        const init = async () => {
        const si = await slice.methods.isRegistered(accounts[0]).call({ from: accounts[0] })
        .then(data => {
            setOnWhitelist(data)
        })
        setLoading(true)
        };
        init();
      }, []);
    const handleSetNick =(n) => setNick(n)

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
    
    
    const handleMint = async () => {
      await slice.methods.vSliceMinting_ExW().send({ from: accounts[0] })
      .on('receipt', receipt => {
        setFreshMintData(!freshMintData)
      })
      };

    
      return (
<>
    
      {(loading && loadingMintData) && <Navbar networkId={networkId} staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} accounts={accounts} slice={slice} fightFactory={fightFactory}></Navbar>}
      {whiteList!=0 ? null : <FormRegister lat={lat} lon={lon} onSetNick={handleSetNick} onRegister={handleRegister}/> }
      <div id="map" ref={googlemap}/> 
</>
    );
}

const infra = () => (
  <Web3Container
  renderLoading={() => <div><Alert variant='warning'>Loading Dapp Page...</Alert></div>}
  render={({ accounts, slice, fightFactory, web3, networkId }) => (
    <Register accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>
  )}
/>
)
export default infra
