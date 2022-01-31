import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import 'bootstrap/dist/css/bootstrap.css'
import { useState, useEffect }  from 'react'
import Link from 'next/link'
import SliceBalance from '../../lib/components/SliceBalance'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Web3 from 'web3'
import Badge from 'react-bootstrap/Badge'
import useSWR from "swr";
import { BigNumber } from "bignumber.js";
import { useRouter } from 'next/router'
import { route } from 'next/dist/server/router'
import { Select, Icon, Avatar } from 'web3uikit';
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "../../lib/components/Logos";


const Navb = ({ networkId, slice, accounts, fightFactory, onMint, staked, vSliceBalance}) => {
  const dev2 = process.env.NEXT_PUBLIC_DEV2
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [whiteList, setOnWhitelist] = useState(undefined)

  const [defaultOption, setDefaultOption] = useState()
useEffect(() => {
  if (networkId==5777) {setDefaultOption (0)}
  else if (networkId=97) {setDefaultOption('1')}
  else if (networkId=8001){setDefaultOption('2')}
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
      

          

      const handleNewFight = async () => {      
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
      const [checkingInflu, setCheckingInflu2] = useState()
      const [checkingCharity, setCheckingCharity] = useState()

      const addressCheck1 = (address) => {
        const isValid = Web3.utils.isAddress(address)
        if (isValid==true) {
          setInflu2Verified(true)
          setInflu2(address)
          setCheckingInflu2('Opponent address checked')
          
        }
        else {
          setInflu2Verified(false)
          setCheckingInflu2('Opponent address not valid')
        };
      }
      const addressCheck2 = (address) => {
        const isValid = Web3.utils.isAddress(address)
        if (isValid==true) {
          setCharityVerified(true)
          setCharity(address)
          setCheckingCharity('Charity address checked')
          
        }
        else {
          setCharityVerified(false)
          setCheckingCharity('Charity address not valid')
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
const handleSelect = (eventKey) => {
         if (eventKey==1) {router.push('/yourfights')}
         else if (eventKey==2) {router.push('/yournewfights')}
         else if (eventKey==3) {router.push('/yourrunningfights')}
         else if (eventKey==8) {handleShow()}
         //else if (eventKey==4) {() => handleNetworkSwitch("ethereum")}
         else if (eventKey==5) {handleNetworkSwitch("polygonTST")}
         else if (eventKey==6) {handleNetworkSwitch("bscTST")}
         else if (eventKey==7) {handleNetworkSwitch("ganache")}
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
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org"
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

    return (
      <>
      <div className='navbar'>
        <Nav onSelect={handleSelect}>
        <ul >
            <li>
              <Link href='/slice'><a><img src='/slice.png' width='50' height='50'></img>
              </a></Link>
            </li>
            <li>
              <h5>Slice.<span>help</span></h5>
            </li>{' '}
            <li>
            <Button onClick={onMint} variant="outline-warning"> Take your Slice <Badge bg="secondary">{(isRegistered && mintSpeed && start) && notYetMinted()} </Badge>
                <span className="visually-hidden">Free SLICE</span>
            </Button>
            </li>
          </ul>
          
        <ul>
            <li>
            {wl ? null : <Link href='/register'>Register</Link>}
          </li>
        </ul>

        <ul>
            <li>
            {(staked && vSliceBalance) && <SliceBalance vSliceBalance={vSliceBalance} staked={staked} accounts={accounts}/>}
            </li>
        </ul>

        <ul>
          <li>
              <Select
              defaultOptionIndex={2}
              label="Select other Chain"
              onChange={(e) => handleNetworkSwitch(e.id)}
              options={[
                {
                  id: 'polygonTST',
                  label: 'Polygon',
                  prefix: <PolygonLogo/>
                },
                {
                  id: 'bsc',
                  label: 'BSC',
                  prefix: <BSCLogo/>
                },
                {
                  id: 'ganache',
                  label: 'Ganace',
                  prefix: <AvaxLogo/>
                }
              ]}
            />
          </li>
        </ul>
        
        {/*<ul className={styles.links}>
         <li>
        <NavDropdown title={networkId} id="nav-dropdown">
                <NavDropdown.Item eventKey="5"> Polygon T</NavDropdown.Item>
                <NavDropdown.Item eventKey="6">Binance Chain T</NavDropdown.Item>
                <NavDropdown.Item eventKey="7">Ganache</NavDropdown.Item>
              </NavDropdown>
          </li>
        </ul> */}
        <ul>
          <li>
          <Avatar
            isRounded
            theme="image"
          />
          </li>
          <li>
              <NavDropdown title={`...`+accounts[0].substring(38,42)} id="nav-dropdown">
                <NavDropdown.Item eventKey="1">Fights you staked</NavDropdown.Item>
                      <NavDropdown.Divider />
                <NavDropdown.Item eventKey="8">Create new fight</NavDropdown.Item>
                <NavDropdown.Item eventKey="2">Your new fights</NavDropdown.Item>
                <NavDropdown.Item eventKey="3">Your running fights</NavDropdown.Item>
              </NavDropdown>
          </li>
        </ul>
        </Nav>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Enter addresses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <FloatingLabel controlId="floatingInputGrid" label="Opponents address">
                      <Form.Control required type="text" placeholder="Address of your opponent" onChange={(e) => setInflu2(e.target.value)} onChange={(e) => addressCheck1(e.target.value)}/>
                    </FloatingLabel>
                      <br></br>
                      <h6>{checkingInflu}</h6>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <FloatingLabel controlId="floatingInputGrid" label="Charity address">
                      <Form.Control type="text" placeholder="Enter charity address" onChange={(e) => setCharity(e.target.value)} onChange={(e) => addressCheck2(e.target.value)}/>
                    </FloatingLabel>
                      <br></br>
                      <h6>{checkingCharity}</h6>
                    </Form.Group>
                </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-warning" onClick={handleClose}>
            Close
          </Button>
          {addressCheckResults ? <Button variant="outline-warning" type = 'submit' onClick={handleNewFight}> Create challenge </Button> : <Button variant="outline-warning" type = 'submit' onClick={handleNewFight}  disabled>Create challange </Button>}
        </Modal.Footer>
      </Modal>
      </div>
      </>
    )
}


  export default Navb