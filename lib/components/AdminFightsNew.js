import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Web3 from 'web3'
import { BigNumber } from "bignumber.js";
import polygonFight from '../../lib/contracts/Fight.json'
import useSWR from "swr";
import { useRouter } from 'next/router'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

const AdminFightsNew = ({ newFights, accounts, web3, fightFactory, networkId }) => {

    const router = useRouter();
    
    const [address, setAddress] = useState(undefined)
    const [priceInWei, setPriceInWei] = useState(undefined)
    const [price, setPrice]= useState(undefined)
    const [priceCoef, setPriceCoef] = useState(undefined)
    const [duration, setDuration] = useState(undefined)
    const [extend, setExtention] = useState(undefined)
    const [followers, setFollowers] = useState(undefined)
    const [promo1, setPromo1] = useState(undefined)
    const [promo2, setPromo2] = useState(undefined)
    const fightTopic = ["topic1","topic2","topic3","topic4","topic5"]
    const fightLocation = ["location1","location2","location3"]
 

    const durationToSeconds =(hours) => {
        if (hours==undefined || hours=='') {return;} 
        else{
        const seconds = (hours * 3600)
        setDuration(seconds)
        console.log('seconds', seconds)
        }
    }
    const extentionToSeconds =(minutes) => {
        if (minutes==undefined || minutes=='') {return;} 
        else{
        const seconds = (minutes * 60)
        setExtention(seconds)
        console.log('seconds', seconds)
        }
    }

    const toWeiValue = (price) => {
        if (price==undefined || price=='') {return;} 
        else{
        const a = new BigNumber(price)
        const b = a.toFixed(18)
        const w = Web3.utils.toWei(b)
        setPriceInWei(w)
        setPrice(price)
        console.log('in Wei', w)
        }
    }


const handleAddFightData = async () => {
  if (priceInWei==undefined || priceCoef==undefined || extend==undefined || duration==undefined || followers==undefined || promo1==undefined || promo2==undefined) {
    alert('Looks like you did not fill some value(s). Please check formular.')
    return;
  }
  else {
    const fight = new web3.eth.Contract(polygonFight.abi, address);
          await fight.methods.addFightData(accounts[0], priceInWei, priceCoef, extend, duration, fightTopic, fightLocation, followers, promo1, promo2).send({ from: accounts[0] })
          .on('receipt', receipt => {
            console.log('fight data updated')
          })
          setShow(false)
          router.push('/yourrunningfights')
          }
        }
          const [show, setShow] = useState(false);
          const handleClose = () => setShow(false);
          const handleShow = (address) => {
              setAddress(address);
              setShow(true);
          }
        
    return (
       
    <>
     <div className='table'>
        <table>
        <tr>
          <th>Fight</th>
          <th>Action</th>
        </tr>
       {newFights && newFights.map((fight, index) => (
           <tr key={index}>
           <td className='fight-link'> {`Fight `+fight.fightContract.substring(0,6)+`...`+fight.fightContract.substring(38,42)}</td>
           <td><Button variant='outline-secondary' onClick={()=> handleShow(fight.fightContract)}>Add fight data</Button></td>
 
           </tr>
               )).sort((a,b) => b.index > a.index ? 1 : -1)}    
               </table>
         </div>    

                <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Enter fight details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <Form noValidate>
                    <Form.Group className="mb-3" controlId="validationCustom01">
                    <FloatingLabel controlId="floatingInput" label="Enter price of first spot" className="mb-3">
                            <Form.Control required type="number" placeholder="Enter price of first spot"  onChange={(e) => toWeiValue(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </FloatingLabel>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="coef">
                      <Form.Label>Each next price will be multiplied by </Form.Label>
                        <Form.Check inline label="1.3x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('30')} />
                        <Form.Check inline label="1.2x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('20')} />
                        <Form.Check inline label="1.1x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('10')} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Duration">
                        <FloatingLabel controlId="floatingInput" label="Enter duration of the fight in hours (max 168)" className="mb-3">
                            <Form.Control type="text" placeholder="Enter duration of the fight in hours (max 168)"  onChange={(e) => durationToSeconds(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Extention">
                        <FloatingLabel controlId="floatingInput" label="Fight extention in minutes (Max.60)" className="mb-3">
                            <Form.Control type="text" placeholder="Fight extention"  onChange={(e) => extentionToSeconds(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Total number of followers">
                        <FloatingLabel controlId="floatingInput" label="Enter number of followers together" className="mb-3">
                            <Form.Control type="text" placeholder="Enter number of followers together" onChange={(e) => setFollowers(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Promo 1">
                        <FloatingLabel controlId="floatingInput" label="Paste link to your content" className="mb-3">
                            <Form.Control type="text" placeholder="Paste link to your content" onChange={(e) => setPromo1(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Promo 2">
                        <FloatingLabel controlId="floatingInput" label="Paste link to the content of your opponent" className="mb-3">
                            <Form.Control type="text" placeholder="Paste link to the content of your opponent" onChange={(e) => setPromo2(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                </Form>
                    
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAddFightData}>
                    Start fight
                </Button>
                </Modal.Footer>
                </Modal>
    </>
        
    

        )    
}

export default AdminFightsNew