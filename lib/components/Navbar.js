import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import 'bootstrap/dist/css/bootstrap.css'
import { useState, useEffect }  from 'react'
import Link from 'next/link'
import SliceBalance from '../../lib/components/SliceBalance'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Web3 from 'web3'
import Badge from 'react-bootstrap/Badge'
import useSWR from "swr";
import { BigNumber } from "bignumber.js";
import { useRouter } from 'next/router'
import { route } from 'next/dist/server/router'
import { Select, Icon, Tag } from 'web3uikit';
import Button from 'react-bootstrap/Button'
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "../../lib/components/Logos";
import Spinner from 'react-bootstrap/Spinner'


const Navb = ({ showSpinnerMinter, networkId, slice, accounts, fightFactory, onMint, staked, vSliceBalance}) => {
  const dev2 = process.env.NEXT_PUBLIC_DEV2
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [whiteList, setOnWhitelist] = useState(undefined)

  const [defaultOption, setDefaultOption] = useState()
useEffect(() => {
  if (networkId==5777) {setDefaultOption ('0')}
  else if (networkId==97) {setDefaultOption('1')}
  else if (networkId==80001){setDefaultOption('2')}
  else if (networkId==43113){setDefaultOption('3')}
}, [])


      // Fetching Start of Fight
      const fetchStart = (slice, accounts) => {
        const start = slice.methods.getStart().call({ from: accounts[0] }).then((data) => {return data})
        return start
        }
      const { data: start, errorStart } = useSWR([slice, accounts, 'start'], fetchStart)

      // Fetching a minter Whitelist 2
      const fetchMinterWl = (slice, accounts) => (...args) => {
        const [arg1] = args
        const address = arg1   
        const minterWl =  slice.methods.wl(address).call({ from: accounts[0] }).then(data => {return data})
        return minterWl
    }
      const { data: wl, errorMinterWl } = useSWR([accounts[0], 'wl'], {fetcher: fetchMinterWl(slice, accounts)})

      //  Fetching if is Registered
      const fetchIsRegistered = (slice, accounts) => (...args) => {
        const [arg1] = args
        const address = arg1   
        const isRegistered =  slice.methods.isRegistered(address).call({ from: accounts[0] }).then(data => {return data})
        return isRegistered
    }
    const { data: isRegistered, errorIsRegistered } = useSWR([accounts[0], 'isRegistered'], {fetcher: fetchIsRegistered(slice, accounts)})

      
      //  Fetching a minter last minted date 
      const fetchMinterMintedDate = (slice, accounts) => (...args) => {
        const [arg1] = args
        const address = arg1   
        const mintedDate =  slice.methods.getMinter(address).call({ from: accounts[0] }).then(data => {return data[2]})
        return mintedDate
    }
      const { data: mintedDate, errorMinterDate } = useSWR(isRegistered!=0 ? [accounts[0], 'mintedDate']: null, {fetcher: fetchMinterMintedDate(slice, accounts)})
      


      // Fetching minting speed
      const fetchSliceParams= (slice, accounts) => {
        const mintSpeed = slice.methods.getMintingSpeed().call({ from: accounts[0] }).then((data) => {return data})
        return mintSpeed
      }
      const { data: mintSpeed, errorMintSpeed } = useSWR([slice, accounts,'speed'], fetchSliceParams)

      // Fetching No of Minters
      const fetchNoOfMinters = (slice, accounts) => (...args) => {
          const noOfMinters = slice.methods.countMinters().call({ from: accounts[0] }).then((data) => {return data})
          return noOfMinters
      }
      const { data: noOfMinters, error1 } = useSWR('noOfMinters', {fetcher: fetchNoOfMinters(slice, accounts)})
          
      // Fetching minted tokens
      const fetchSupplyInfo = (slice, accounts) => {
          const vSupply =  slice.methods.sliceParams().call({ from: accounts[0] }).then((data) => {return data[0]})
          return vSupply
      }
      const { data: vSupply, error2 } = useSWR([slice, accounts],fetchSupplyInfo, { refreshInterval: 1000 })

      // Fetching total supply   
      const fetchTSupplyInfo = (slice, accounts) => (...args) => {
          const tSupply = slice.methods.sliceParams().call({ from: accounts[0] }).then((data) => {return data[1]})
          return tSupply
        }
      const { data: tSupply, error3 } = useSWR('tSupplyInfo', {fetcher: fetchTSupplyInfo(slice, accounts)})
      

     
      const [showSpinner, setShowSpinner] = useState(false)
      const handleNewFight = async () => {    
        setShowSpinner(true)  
        await fightFactory.methods.createFight(dev2, influ2, charity).send({ from: accounts[0] })
        .on('receipt', receipt => {
        console.log(receipt.events.createNewFight.returnValues.fightAddress)
        //alert(receipt.events.createNewFight.returnValues.fightAddress)
        }) 

        setInflu2('')
        setCharity('')
        setShow(false)
        router.push('/yournewfights')
    };
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      const [influ2, setInflu2] = useState(undefined)
      const [charity, setCharity] =useState (undefined)
      const [verifiedCharity, setCharityVerified] = useState(undefined)
      const [verifiedInflu2, setInflu2Verified] = useState(undefined)
      const [addressCheckResults, setAddressCheckResults] = useState(false)
      const [checkingInflu, setCheckingInflu2] = useState(false)
      const [checkingCharity, setCheckingCharity] = useState(false)

      const addressCheck1 = (address) => {
        const isValid = Web3.utils.isAddress(address)
        if (isValid==true) {
          setInflu2Verified(true)
          setInflu2(address)
          setCheckingInflu2(true)
          
        }
        else {
          setInflu2Verified(false)
          setCheckingInflu2(false)
        };
      }
      const addressCheck2 = (address) => {
        const isValid = Web3.utils.isAddress(address)
        if (isValid==true) {
          setCharityVerified(true)
          setCharity(address)
          setCheckingCharity(true)
          
        }
        else {
          setCharityVerified(false)
          setCheckingCharity(false)
        };

      }
      useEffect(() => {
        const init = async () => {
          if (verifiedInflu2==true && verifiedCharity==true )
          {
            setAddressCheckResults(true)
          }
          else {setAddressCheckResults(false)}
        };
        init();
      }, [verifiedCharity, verifiedInflu2]);

const notYetMinted = () => {

       if (isRegistered == 0) {
        const x = new Date();
        const time = x.getTime();
        const timeTr=parseInt(time);
        const startF=parseInt(start)*1000
        const a = (timeTr - startF) / mintSpeed
        const b = new BigNumber(a)
        const c = b.dividedBy(1000).toFixed(0)
        const mint = Web3.utils.toBN(c).toString()
        return mint
       }
       else if (mintedDate!=0) {
        const x = new Date();
        const time = x.getTime();
        const timeTr=parseInt(time);
        
        const lastMinted=parseInt(mintedDate)*1000
        
        const a = (timeTr - lastMinted) / mintSpeed
        
         const b = new BigNumber(a)
         const c = b.dividedBy(1000).toFixed(0)
         const mint = Web3.utils.toBN(c).toString()
        return mint 
       }
       else {
        const x = new Date();
        const time = x.getTime();
        const timeTr=parseInt(time);
        const a = (timeTr - (start*1000)) / mintSpeed
         const b = new BigNumber(a)
         const c = b.dividedBy(1000).toFixed(0)
         const mint = Web3.utils.toBN(c).toString()
        return mint
       }
      
}


const handleNetworkSwitch = async (networkName) => {
  setError();
  await changeNetwork({ networkName, setError });
};

const [error, setError] = useState();
const changeNetwork = async ({ networkName, setError }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName]
        }
      ]
    });
  } catch (err) {
    setError(err.message);
  }
};

const networks = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  polygonTST: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://rpc-mumbai.matic.today/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org"
    ],
    blockExplorerUrls: ["https://bscscan.com"]
  },
  bscTST : {
    chainId: `0x${Number(97).toString(16)}`,
    chainName: "Smart Chain - Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
  avaTest : {
    chainId: `0x${Number(43113).toString(16)}`,
    chainName: "Avalanche FUJI C-Chain",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
  },
  ganache : {
    chainId: `0x${Number(5777).toString(16)}`,
    chainName: "Ganache",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: ["//127.0.0.1:7545/"],
    blockExplorerUrls: ["https://localhost/"],
  },
};
const handleMenu = (eventKey) => {
  if (eventKey==1) {router.push('/yourfights')}
  else if (eventKey==2) {router.push('/yournewfights')}
  else if (eventKey==3) {router.push('/yourrunningfights')}
  else if (eventKey==8) {handleShow()}
}
const handleRegister = () => {router.push('/register')}

    return (
      <>     
        <nav className='navbar'>
          <div className='container'>
              <ul className='logo'>
                  <li>
                    <Link href='/slice'><a><img src='/slice.png' width='50' height='50'></img>
                    </a></Link>
                  </li>
              </ul>
              <ul className='registerOrMint'>
                <li>
                  {(isRegistered && mintSpeed && start) && <Tag
                    color="green"
                    text={notYetMinted() +` SLICE`}
                  />}
                  </li>
                  <li>
                  {(wl && showSpinnerMinter)&& <Button size='sm' hidden variant="outline-secondary" onClick={onMint}>Mint</Button>}
                  {(wl && !showSpinnerMinter) && <Button size='sm' variant="outline-secondary" onClick={onMint}>Mint</Button>}
                  {!wl && <Button size='sm' variant="outline-secondary" onClick={handleRegister}>Register</Button>}
                  {showSpinnerMinter && <Button variant="secondary" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/></Button>}
                  </li>
                </ul>
              <ul>
                  <li>
                  {(staked && vSliceBalance) && <SliceBalance vSliceBalance={vSliceBalance} staked={staked} accounts={accounts}/>}
                  </li>
              </ul>

              <ul className='networks'>
                <li>
                    {defaultOption && <Select
                    defaultOptionIndex={`${defaultOption}`}
                    label="Chain"
                    onChange={(e) => handleNetworkSwitch(e.id)}
                    options={[
                      {
                        id: 'ganache',
                        label: 'Ganage',
                        prefix: 'G'
                      },
                      {
                        id: 'bscTST',
                        label: 'BSC',
                        prefix: <BSCLogo/>
                      },
                      {
                        id: 'polygonTST',
                        label: 'Polygon',
                        prefix: <PolygonLogo/>
                      },
                      {
                        id: 'avaTest',
                        label: 'Avalange',
                        prefix: <AvaxLogo/>
                      }
                    ]}
                  />}
                </li>
              </ul>

              <ul className='menu'>
                <li>
                <Select
                    defaultOptionIndex={0}
                    label="Menu"
                    onChange={(e) => handleMenu(e.id)}
                    options={[
                      {
                        id: '0',
                        label: `${`....`+accounts[0].substring(38,42)}`,
                        prefix: <Icon
                        fill="black"
                        size={10}
                        style={{}}
                        svg="user"
                      />
                      },
                      {
                        id: '1',
                        label: 'Staked fights',
                        prefix: <Icon
                        fill="black"
                        size={10}
                        svg="pulse"
                      />
                      },
                      {
                        id: '8',
                        label: 'Create fight',
                        prefix: <Icon
                        fill="black"
                        size={10}
                        svg="plus"
                      />
                      },
                      {
                        id: '2',
                        label: 'New fights',
                        prefix: <Icon
                        fill="black"
                        size={10}
                        svg="edit"
                      />
                      },
                      {
                        id: '3',
                        label: 'Edit fights',
                        prefix: <Icon
                        fill="black"
                        size={10}
                        svg="edit"
                      />
                      }
                    ]}
                  />
                    
                    </li>
                  </ul>
              </div>
        </nav>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Enter addresses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <FloatingLabel controlId="floatingInputGrid" label="Opponents address">
                      <Form.Control required type="text" placeholder="Address of your opponent" onChange={(e) => addressCheck1(e.target.value)}/>
                    </FloatingLabel>
                      <br></br>
                      <h6>{checkingInflu ? <Icon fill="green" size={32} svg="checkmark"/> : <Icon fill="grey" size={32} svg="checkmark"/>}</h6>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <FloatingLabel controlId="floatingInputGrid" label="Charity address">
                      <Form.Control type="text" placeholder="Enter charity address"  onChange={(e) => addressCheck2(e.target.value)}/>
                    </FloatingLabel>
                      <br></br>
                      <h6>{checkingCharity ? <Icon fill="green" size={32} svg="checkmark"/> : <Icon fill="grey" size={32} svg="checkmark"/>}</h6>
                    </Form.Group>
                </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          {!showSpinner && addressCheckResults ? <Button variant="outline-secondary" type = 'submit' onClick={handleNewFight}> Create fight </Button> : <Button variant="outline-secondary" type = 'submit' onClick={handleNewFight}  disabled>Create fight </Button>}
        {showSpinner && <Button variant="secondary" disabled>
                                        <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        />
                                    </Button>}
        </Modal.Footer>
      </Modal>
     
      </>
    )
}


  export default Navb