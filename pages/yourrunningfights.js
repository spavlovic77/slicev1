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


const getTime = (t) => {
  const d = new Date();
  let time = d.getTime();
  let timeInteger=parseInt(time);
  let counDownInteger=parseInt(t)*1000
  const countDownDate = timeInteger+counDownInteger
  const distance = ((countDownDate-timeInteger))
  const days=(Math.floor(distance / (1000 * 60 * 60 * 24)))
  const hours=(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const minutes=(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
  const seconds=(Math.floor((distance % (1000 * 60)) / 1000))
  const formattedTime = days + "d " + hours + "h "+ minutes + "m " + seconds + "s "
  return formattedTime;
      }

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

      const handleChangeFightParams = async (addr, accounts, web3) => {
        const fight = new web3.eth.Contract(polygonFight.abi, addr);
              await fight.methods.sF(share, influFlip, cashB,usersFlip, charFlip, influCrea, usersCrea, maxUsers, spotBusy, spotReserv).send({ from: accounts[0] })
              .on('receipt', receipt => {
                console.log('fight params updated')
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


  return (
    <>
        {loadingMintData && <Navbar staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>}
        <div className='table'>
    <table>
        <tr>
          <th>Fight</th>
          <th>Action</th>
        </tr>
        
        {details && details.map((fight, index) => (
          <tr key={index}>
          <td className='fight-link'>  <Link href="/fights/[address]" as={`/fights/${fight.contract}`}>{`Fight `+fight.contract.substring(0,6)+`...`+fight.contract.substring(38,42)}</Link>
         </td>
          <td><Button variant='outline-secondary'  onClick={()=>fightParams(fight.contract, accounts, web3)} >Change params</Button></td>
          </tr>
              )).sort((a,b) => b.index > a.index ? 1 : -1)}    
              </table>
        </div>          


    <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Change fight parameters (%)</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                <Form>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Flipper's slice from the spot price increase</Form.Label>
                      <Form.Control type="text" placeholder={share} onChange={(e) => setShare(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Flipper gets back when flipped</Form.Label>
                      <Form.Control type="text" placeholder={cashB} onChange={(e) => setCashB(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Influencers's slice for each created spot</Form.Label>
                      <Form.Control type="text" placeholder={influCrea} onChange={(e) => setInfluCrea(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Users's slice for each created spot</Form.Label>
                      <Form.Control type="text" placeholder={usersCrea} onChange={(e) => setUsersCrea(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Developer's 1 slice for each created spot</Form.Label>
                      <Form.Control type="text" placeholder="1" disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Developer's 2 slice for each created spot</Form.Label>
                      <Form.Control type="text" placeholder="5" disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Last spot Pot slice for each created spot</Form.Label>
                      <Form.Control type="text" placeholder="30" disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Influencer's slice for each flipped spot</Form.Label>
                      <Form.Control type="text" placeholder={influFlip} onChange={(e) => setInfluFlip(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Users's slice for each flipped spot</Form.Label>
                      <Form.Control type="text" placeholder={usersFlip} onChange={(e) => setUsersFlip(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Charity's slice for each flipped spot</Form.Label>
                      <Form.Control type="text" placeholder={charFlip} onChange={(e) => setCharFlip(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Last spot Pot slice for each flipped spot</Form.Label>
                      <Form.Control type="text" placeholder="30" disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="input1">
                      <Form.Label>Max count of users</Form.Label>
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
                      </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>handleChangeFightParams(addr, accounts, web3)}>
                    Save parameters
                </Button>
                </Modal.Footer>
                </Modal>

    </>
  )
}

const list = () => (

  <Web3Container
    renderLoading={() => <div><Alert variant='warning'>Loading Dapp Page...</Alert></div>}
    render={({ accounts, slice, fightFactory, web3, networkId}) => (
      <YourRunningFights accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default list