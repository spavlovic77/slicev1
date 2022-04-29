import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Web3 from 'web3'
import { BigNumber } from "bignumber.js";
import polygonFight from '../../lib/contracts/Fight.json'
import { useRouter } from 'next/router'
import Spinner from 'react-bootstrap/Spinner'
import axios from 'axios';
import { Table, Icon } from 'web3uikit';


const AdminFightsNew = ({ newFights, accounts, web3, fightFactory, networkId }) => {

    const router = useRouter();
    
    const [address, setAddress] = useState(undefined)
    const [priceInWei, setPriceInWei] = useState(undefined)
    const [price, setPrice]= useState(undefined)
    const [priceCoef, setPriceCoef] = useState(undefined)
    const [duration, setDuration] = useState(undefined)
    const [extend, setExtention] = useState(undefined)
    const [promo1, setPromo1] = useState(undefined)
    const [promo2, setPromo2] = useState(undefined)
    const fightTopic = ["topic1","topic2","topic3","topic4","topic5"]
    //const fightLocation = ["location1","location2","location3"]
 

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

const [showSpinner, setShowSpinner] = useState(false)
const [shortLink, setShortLink] = useState()
const handleAddFightData = async () => {
  if (priceInWei==undefined || priceCoef==undefined || extend==undefined || duration==undefined || promo1==undefined || promo2==undefined) {
    alert('Looks like you did not fill some value(s). Please check formular.')
    return;
  }
  else {
      
      setShowSpinner(true)
    const fight = new web3.eth.Contract(polygonFight.abi, address);
          await fight.methods.addFightData(accounts[0], priceInWei, priceCoef, extend, duration, fightTopic, promo1, promo2, shortLink).send({ from: accounts[0] })
          .on('receipt', receipt => {
            console.log('fight data updated')
          })
          setShow(false)
          handleShowLink()
          }
        }


    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        router.push('/yournewfights')
    }
    const handleShow = async(address) => {
        setAddress(address);
      //bitly link start
      const linkToFight = `https://www.slice.help/fights/${address}`
      const response = await axios.post(
        '/api/bitlyLink', 
        {
          linkToFight
        })
        const link = await response
      setShortLink(link.data.link)
      console.log(link.data.link)
      //bitly link end
        setShow(true);
    }

    const [showLink, setShowLink] = useState(false);
    const handleCloseLink = () => {
        setShowLink(false);
        router.push('/fights/'+address+'')
    }
    const handleShowLink = () => setShowLink(true);

    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
        await navigator.clipboard.writeText(shortLink)
        .then(setCopied(true))
}

if (newFights!=undefined) {
    const dataFeed3 = newFights
    .map((fight) => [<span key={0}></span>, <span key={1}>{`Fight `+fight.fightContract.substring(0,6)+`...`+fight.fightContract.substring(38,42)}</span>,
    <Button key={2} variant='outline-secondary' onClick={()=> handleShow(fight.fightContract)}>Start fight</Button>, <span key={3}></span>])
    .sort((a,b) => b.index > a.index ? 1 : -1)
  }

        
    return (
       
    <>
     <div className='tabs-wrapper'>
         {newFights && <Table
              columnsConfig="80px 3fr 2fr 80px"
              data={dataFeed3}
              header={[
                <span key={10}></span>,
                <span key={20}>Fight</span>,
                <span key={30}>Action</span>,
                <span key={40}></span>
              ]}
              maxPages={3}
              onPageNumberChanged={function noRefCheck(){}}
              pageSize={5}
            />}
            </div>


                <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Enter fight details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <Form noValidate>
                    <Form.Group className="mb-3" controlId="validationCustom01">
                    <FloatingLabel controlId="floatingInput" label="Enter price of a spot" className="mb-3">
                            <Form.Control required type="number" placeholder="Enter starting price of a spot"  onChange={(e) => toWeiValue(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </FloatingLabel>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="coef">
                      <Form.Label>Each Flip the spot price is increase by </Form.Label><br></br>
                        <Form.Check inline label="1.3x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('30')} />
                        <Form.Check inline label="1.2x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('20')} />
                        <Form.Check inline label="1.1x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('10')} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Duration">
                        <FloatingLabel controlId="floatingInput" label="Enter duration of the fight in hours (min 6 - max 168)" className="mb-3">
                            <Form.Control type="text" placeholder="Enter duration of the fight in hours (min 25 - max 168)"  onChange={(e) => durationToSeconds(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Extention">
                        <FloatingLabel controlId="floatingInput" label="Extention of the fight in minutes by each flip? (Max.60)" className="mb-3">
                            <Form.Control type="text" placeholder="Extention of the fight in minutes by each flip? (Max.60)"  onChange={(e) => extentionToSeconds(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Promo 1">
                        <FloatingLabel controlId="floatingInput" label="Paste link to your content (YouTube, Twitch)" className="mb-3">
                            <Form.Control type="text" placeholder="Paste link to your content" onChange={(e) => setPromo1(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Promo 2">
                        <FloatingLabel controlId="floatingInput" label="Paste link to the content of your opponent (YouTube, Twitch)" className="mb-3">
                            <Form.Control type="text" placeholder="Paste link to the content of your opponent" onChange={(e) => setPromo2(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                </Form>
                    
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {showSpinner ? <Button variant="secondary" disabled>
                                        <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        />
                                        Starting fight...
                                    </Button> : <Button variant="secondary" onClick={handleAddFightData}>
                                                    Start fight
                                                </Button>}
                
                </Modal.Footer>
                </Modal>

                <Modal show={showLink} onHide={handleCloseLink}>
                    <Modal.Header closeButton>
                    <Modal.Title><Icon fill="green" size={32} svg="checkmark"/>Fight started</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                         Short link for easy sharing <span className='link-background'>{shortLink} </span>
                         {!copied ? <button onClick={handleCopy} className='btn-promo'><Icon fill="black" size={32} svg="copy" /></button> : <button className='btn-promo'><Icon fill="green" size={32} svg="checkmark"/></button>}
                    </Modal.Body>
                    
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLink}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleCloseLink}>
                        Lets begin
                    </Button>
                    </Modal.Footer>
                </Modal>


    </>
        
    

        )    
}

export default AdminFightsNew