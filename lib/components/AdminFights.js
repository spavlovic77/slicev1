//import styles from '../../styles/Staked.module.css'
import AdminFightsNew from './AdminFightsNew'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import useSWR from "swr";
import polygonFight from '../contracts/Fight.json'
import AdminFightsActive from './AdminFightsActive'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { BigNumber } from "bignumber.js";
import Web3 from 'web3'

const fetcherFightsByAdmin = (fightFactory, accounts) => {
      const fightsByAdmin = fightFactory.methods.getFightsByAdmin(accounts[0]).call({ from: accounts[0] }).then((data) => {return data})
      return fightsByAdmin
  }

  const fetcherFightFlags = async(fightsByAdmin, accounts, web3) => {
    const data = () => {
          const listN =[]
          fightsByAdmin.map((f) => {
            const fight = new web3.eth.Contract (polygonFight.abi,f.fightContract)
            const adminFights =  fight.methods.getFightParams().call({ from: accounts[0] }).then(data => {
              listN.push({contract: f.fightContract, data: data[11]})
            })
          })
          return listN
        }
        const response =  await data();
        return response
      }


const AdminFights = ({ fightFactory, web3, accounts }) => {

const { data: fightsByAdmin } = useSWR('fightsByAdmin', ()=> fetcherFightsByAdmin(fightFactory, accounts))
const { data: listFightData, error } = useSWR(()=>'listFights'+fightsByAdmin, ()=>fetcherFightFlags(fightsByAdmin, accounts, web3), {revalidateOnFocus : false})


// console.log('fights', fightsByAdmin)
 console.log('fightData', listFightData)
// console.log('datails New', detailsNew)
// console.log('datails Active', detailsActive)


const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = (address) => {
    setAddress(address);
    setShow(true);
}
const [address, setAddress] = useState(undefined)
const [priceInWei, setPriceInWei] = useState(undefined)
const [price, setPrice]= useState(undefined)
const [priceCoef, setPriceCoef] = useState(undefined)
// const [example1, setExample1] = useState(undefined)
// const [example2, setExample2] = useState(undefined)
// const [example3, setExample3] = useState(undefined)
// const [isPrice, setIsPrice] = useState(false)
// const [isCoef, setIsCoef] = useState(false)
const startTime='8888'
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
// const simulate = (coef) => {
//     if (coef==undefined || coef=='') {return;} 
//     else{
//     const a= coef
//     const b= (a*price).toFixed(3)
//     const c= (b*coef).toFixed(3)
//     const d= (c*coef).toFixed(3)
//     const coefValid= (a*10).toFixed(2)
//     setPriceCoef(a)
//     setExample1(b)
//     setExample2(c)
//     setExample3(d)
//     setIsCoef(true)
//     console.log('price', price, 'coef', coef, 'ex1', b, 'ex2', c, 'ex3', d)

//     }
// }

const handleAddFightData = async () => {
const fight = new web3.eth.Contract(polygonFight.abi, address);
      await fight.methods.addFightData(accounts[0], priceInWei, priceCoef, extend, duration, fightTopic, fightLocation, followers, promo1, promo2).send({ from: accounts[0] })
      .on('receipt', receipt => {
        console.log('fight data updated', receipt.events.fightPending.returnValues.fightContract)
      })
      };

      if (!fightsByAdmin) return '';
return (
<>
<p>Newly created Challenges</p>
{listFightData && <AdminFightsNew listFightData={listFightData.filter(f => f.data == 0)} fightFactory={fightFactory} web3={web3} accounts={accounts}/>}

<p>Active Challenges</p>
{listFightData && <AdminFightsActive listFightData={listFightData.filter(f => f.data == 1 && f.actTimer!=0)} fightFactory={fightFactory} web3={web3} accounts={accounts}/>}

<Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Enter challange details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <Form>
                    <Form.Group className="mb-3" controlId="price">
                        <FloatingLabel controlId="floatingInput" label="Enter initial price of spot" className="mb-3">
                            <Form.Control type="text" placeholder="Initial price of spot"  onChange={(e) => toWeiValue(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="coef">
                        <Form.Check inline label="1.3x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('30')} />
                        <Form.Check inline label="1.2x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('20')} />
                        <Form.Check inline label="1.1x" name="group1" type='radio' id='inline-radio-1' onChange={(e) => setPriceCoef('10')} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Duration">
                        <FloatingLabel controlId="floatingInput" label="Enter duration of the challange (in hours)" className="mb-3">
                            <Form.Control type="text" placeholder="Enter duration of the challange (in hours)"  onChange={(e) => durationToSeconds(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Extention">
                        <FloatingLabel controlId="floatingInput" label="Challange prolongation in minutes (Max.60)" className="mb-3">
                            <Form.Control type="text" placeholder="Challange prolongation" onChange={(e) => extentionToSeconds(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Total number of followers">
                        <FloatingLabel controlId="floatingInput" label="Enter number of followers together" className="mb-3">
                            <Form.Control type="text" placeholder="Enter number of followers together" onChange={(e) => setFollowers(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Promo 1">
                        <FloatingLabel controlId="floatingInput" label="Paste link to your content" className="mb-3">
                            <Form.Control type="text" placeholder="Paste link to your content" onChange={(e) => setPromo1(e.target.value)}/>
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
                    Start Challange
                </Button>
                </Modal.Footer>
                </Modal>

</>


)
}

export default AdminFights
