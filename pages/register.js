import Web3Container from '../lib/infra/Web3Containter'
import Footer from '../lib/components/Footer'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import Navbar from '../lib/components/Navbar'
import { useState, useEffect, useRef }  from 'react'
import { Loader } from '@googlemaps/js-api-loader';
import FormRegister from '../lib/components/FormRegister'
import { useRouter } from 'next/router'
import { Icon } from 'web3uikit';
import Spinner from 'react-bootstrap/Spinner'

const Register = ({ accounts, slice, fightFactory, networkId }) => {
  const googlemap = useRef(null);
  const [lon, setLon] = useState()
  const [lat, setLat] = useState()
  const [nick, setNick] = useState(undefined)
  const [defaultCenter, setDefaultCenter] = useState({ lat: -34.397, lng: 150.644 })
  const [zoom, setZoom] = useState(2)
  const [whiteList, setOnWhitelist] = useState(undefined)
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

const [showSpinner, setShowSpinner] = useState(false)
    const handleRegister = async () => {
      setShowSpinner(true)
      console.log('lat, lon', lat, lon)
      const address = accounts[0]
      try {
        const response = await axios.post(
          '/api/whitelisting', 
          {
            address
          }
        );
        const receipt = await slice
          .methods
          .addToWhitelist_a7I(
            response.data.signature,
            `'`+lat+`'`,
            `'`+lon+`'`,
            nick
          )
          .send({from: accounts[0]})
          .on('receipt', receipt => {
            console.log(receipt.events.newMinter.returnValues.minter)
          })
          handleShow()
        
      } catch(e) {console.log(e)}
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
    
    const [showSpinner2, setShowSpinner2] = useState(false)
    const handleMint = async () => {
      setShowSpinner2(true)
      await slice.methods.vSliceMinting_ExW().send({ from: accounts[0] })
      .on('receipt', receipt => {
        console.log(receipt)
        setFreshMintData(!freshMintData)
        handleClose();
        router.push('/slice')
      })
      };

    const [screenLoad, setScreenLoad] =useState(false)
    const handleCloseRegister = () => setScreenLoad(false)
   useEffect(() => {
   setScreenLoad(true)
   }, [])
    
      return (
<>
    
      {(loading && loadingMintData) && <Navbar networkId={networkId} staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} accounts={accounts} slice={slice} fightFactory={fightFactory}></Navbar>}
      {whiteList!=0 ? null : <FormRegister showSpinner={showSpinner} lat={lat} lon={lon} onSetNick={handleSetNick} onRegister={handleRegister}/> }
      <div id="map" ref={googlemap}/> 

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><Icon fill="green" size={32} svg="checkmark"/>Congratulations</Modal.Title>
        </Modal.Header>
        <Modal.Body><Icon fill="green" size={32} svg="check"/>Lets mint your SLICE now</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!showSpinner2 ?<Button variant="secondary" onClick={handleMint}>Mint now</Button> : <Button variant="secondary" disabled>
                                                                                <Spinner
                                                                                  as="span"
                                                                                  animation="grow"
                                                                                  size="sm"
                                                                                  role="status"
                                                                                  aria-hidden="true"
                                                                                />
                                                                                Minting...
                                                                              </Button>}

        </Modal.Footer>
      </Modal>

      <Modal show={screenLoad} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title>How to register</Modal.Title>
        </Modal.Header>
        <Modal.Body><ul>
                      <li>
                      <Icon fill="green" size={24} svg="check"/>Zoom in the map by holding CTRL
                      </li> 
                      <li>
                      <Icon fill="green" size={24} svg="check"/>Use RIGHT CLICK to place Marker. You can repeat it if you missed
                      </li>
                      <li>
                      <Icon fill="green" size={24} svg="check"/>Place your Marker somewhere where people know you by Nickname
                      </li>
                      <li>
                      <Icon fill="green" size={24} svg="check"/>Otherwise people will Report you and you will be Blacklisted
                      </li>
                      <li>
                      <Icon fill="green" size={24} svg="check"/>Do not create multiple accounts. You might be embarassed in the future. All is on-chain forever
                      </li>
                    </ul>
            </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRegister}>
            Good, I understand
          </Button>
        </Modal.Footer>
      </Modal>

</>
    );
}

const infra = () => (
  <Web3Container
  renderLoading={() => <div><Alert variant='warning'>Loading Dapp Page...Check your Metamask please</Alert></div>}
  render={({ accounts, slice, fightFactory, web3, networkId }) => (
    <Register accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>
  )}
/>
)
export default infra
