import Web3Container from '../lib/infra/Web3Containter'
import Alert from 'react-bootstrap/Alert'
import Navbar from '../lib/components/Navbar'
import Footer from '../lib/components/Footer'
import AdminFightsActive from '../lib/components/AdminFightsActive'
import useSWR from "swr";
import polygonFight from '../lib/contracts/Fight.json'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { Table, Loading } from 'web3uikit';
import Spinner from 'react-bootstrap/Spinner'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'


const fetcherFightsByAdmin = async(fightFactory, accounts) => {
  const fightsByAdmin = await fightFactory.methods.getFightsByAdmin(accounts[0]).call({ from: accounts[0] }).then((data) => {return data})
  return fightsByAdmin
}

const fetcherOnlyActive = async(fightsByAdmin) => {
  const data = await fightsByAdmin.filter(f=> f.active===true)
return data
}

const fetcherFightDetails =  async(activeOnly, accounts, web3) =>  {
const listN =[]
for (let i=0; i<activeOnly.length; i++) {
 const fight = await new web3.eth.Contract(polygonFight.abi,activeOnly[i].fightContract)
 const adminFights =  await fight.methods.getFightParams().call({ from: accounts[0] }).then(data => {
  listN.push({contract: activeOnly[i].fightContract, flipperShare: data[0], influ2Share: data[1], spotCashBack: data[2], usersSlice: data[3], charitySlice: data[4], iscs: data[5], uscs: data[6], maxUsers: data[7], spotBusyTime: data[8], spotReservTime: data[9], actTimer: data[10], startTime: data[11]})
})
}
return listN
}

const YourRunningFights = ({ fightFactory, web3, accounts,slice, networkId  }) => {

  const { data: fightsByAdmin, error } = useSWR([fightFactory, accounts, 'allFights'], fetcherFightsByAdmin)
  const { data: activeOnly } = useSWR(fightsByAdmin ? [fightsByAdmin, 'onlyActive'] : null, fetcherOnlyActive)
  const { data: details } = useSWR(activeOnly ? [activeOnly, accounts, web3, 'details'] : null, fetcherFightDetails)

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

      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      const [share, setShare] = useState()
      const [cashB, setCashB] = useState()
      const [influCrea, setInfluCrea] = useState()
      const [usersCrea, setUsersCrea] = useState()
      const [influFlip, setInfluFlip] = useState()
      const [usersFlip, setUsersFlip] = useState()
      const [charFlip, setCharFlip] = useState()
      const [maxUsers, setMaxUsers] = useState()
      const [spotBusy, setSpotBusy] = useState()
      const [spotReserv, setSpotReserv] = useState()
      const [addr, setAddress] = useState()

      const [configSpinner, setConfigSpinner] = useState()
      const handleChangeFightParams = async (addr, accounts, web3) => {
        setConfigSpinner(true)
        const fight = new web3.eth.Contract(polygonFight.abi, addr);
              await fight.methods.sF(share, influFlip, cashB,usersFlip, charFlip, influCrea, usersCrea, maxUsers, spotBusy, spotReserv).send({ from: accounts[0] })
              .on('receipt', receipt => {
                console.log('fight params updated')
                setConfigSpinner(false)
                handleClose()
              })
            };

      const fightParams =  async(address, accounts, web3) =>  {
         const fight = await new web3.eth.Contract(polygonFight.abi,address)
         const fightPar = await fight.methods.getFightParams().call({ from: accounts[0] }).then(data => data)
         handleShow()
         setShare(fightPar[0])
         setCashB(fightPar[2])
         setInfluCrea(fightPar[5])
         setUsersCrea(fightPar[6])
         setInfluFlip(fightPar[1])
         setUsersFlip(fightPar[3])
         setCharFlip(fightPar[4])
         setMaxUsers(fightPar[7])
         setSpotBusy(fightPar[8])
         setSpotReserv(fightPar[9])
         setAddress(address)
         return fightPar
          }

  if (details!=undefined) {
    const dataFeed3 = details
    .filter(f => f.actTimer!='0')
    .map((fight) => [<span key={1}></span>, <Link key={2} href="/fights/[address]" as={`/fights/${fight.contract}`}>{`Fight `+fight.contract.substring(0,6)+`...`+fight.contract.substring(38,42)}</Link>,
    <Button key={3} variant='outline-secondary'  onClick={()=>fightParams(fight.contract, accounts, web3)} >Change params</Button>, <span key={4}></span>])
    .sort((a,b) => b.index > a.index ? 1 : -1)
  }
console.log({dataFeed3})
  return (
    <>
    {(!details && !loadingMintData) && <div
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
        {(details && loadingMintData) && <Navbar whitel={whitel} isReg={isReg} minter={minter} mintingSpeed={mintingSpeed} start={start} showSpinnerMinter={showSpinnerMinter} staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>}

        <div className='tabs-wrapper'>
        
          {(details && loadingMintData) && <Table
              columnsConfig="80px 3fr 2fr 80px"
              data={dataFeed3}
              header={[
                <span key={30}></span>,
                <span key={10}>Fight</span>,
                <span key={20}>Action</span>,
                <span key={40}></span>
              ]}
              maxPages={3}
              onPageNumberChanged={function noRefCheck(){}}
              pageSize={5}
            />}
    </div>


    <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Change fight parameters (%)</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                <Form>
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="flipper" title="Flipper share">
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Flipper share from the spot price increase</Form.Label>
                          <Form.Control type="text" placeholder={share} onChange={(e) => setShare(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Flipper gets back when flipped</Form.Label>
                          <Form.Control type="text" placeholder={cashB} onChange={(e) => setCashB(e.target.value)} />
                        </Form.Group>
                    </Tab>
                    <Tab eventKey="create" title="Spot Share">
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Influencers share for each spot</Form.Label>
                          <Form.Control type="text" placeholder={influCrea} onChange={(e) => setInfluCrea(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Users share for each spot</Form.Label>
                          <Form.Control type="text" placeholder={usersCrea} onChange={(e) => setUsersCrea(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Platform share for each spot</Form.Label>
                          <Form.Control type="text" placeholder="1" disabled/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Developer share for each spot</Form.Label>
                          <Form.Control type="text" placeholder="5" disabled/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Last spot Pot share for each spot</Form.Label>
                          <Form.Control type="text" placeholder="30" disabled/>
                        </Form.Group>
                        <span style={{color: 'orange'}}>The sum must be 100%. Do not use decimals.</span>
                      </Tab>
                    <Tab eventKey="flip" title="Flip Share">
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Influencers share for each flipped spot</Form.Label>
                          <Form.Control type="text" placeholder={influFlip} onChange={(e) => setInfluFlip(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Users share for each flipped spot</Form.Label>
                          <Form.Control type="text" placeholder={usersFlip} onChange={(e) => setUsersFlip(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Charity share for each flipped spot</Form.Label>
                          <Form.Control type="text" placeholder={charFlip} onChange={(e) => setCharFlip(e.target.value)} />
                        </Form.Group>
                        <span style={{color: 'orange'}}>The sum must be 100%. Do not use decimals.</span>
                    </Tab>
                    <Tab eventKey="others" title="Others">
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>Max count of Staking users</Form.Label>
                          <Form.Control type="text" placeholder={maxUsers} onChange={(e) => setMaxUsers(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>How long the spot will not be flippable in seconds</Form.Label>
                          <Form.Control type="text" placeholder={spotBusy} onChange={(e) => setSpotBusy(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="input1">
                          <Form.Label>How long the spot will be reserved after spot reservation</Form.Label>
                          <Form.Control type="text" placeholder={spotReserv} onChange={(e) => setSpotReserv(e.target.value)} />
                        </Form.Group>
                    </Tab>
                </Tabs>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {!configSpinner &&<Button variant="secondary" onClick={()=>handleChangeFightParams(addr, accounts, web3)}>
                    Save parameters
                </Button>}
                {configSpinner && <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        />}
                </Modal.Footer>
                </Modal>

    </>
  )
}

const list = () => (

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
    render={({ accounts, slice, fightFactory, web3, networkId}) => (
      <YourRunningFights accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default list