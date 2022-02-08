import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import Col from 'react-bootstrap/Col'
import ReactPlayer from 'react-player'
import Header from '../../lib/components/Header'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import polygonFight from '../contracts/Fight.json'
import Web3 from 'web3'
import Voting from '../components/Voting'
import Link from 'next/link'
import { Icon } from 'web3uikit';

const Content = ({ shortUrl, showSpinnerVote1, showSpinnerVote2, showSpinnerStake, showSpinnerUnstake, charity, startTime, timer, lsb, accounts, web3, address, fightData, staked, charityBalance, vSliceBalance,pendingWithdrawal, onWithdraw,onPotWithdraw, onStaking, onUnStaking,votes1, votes2, onVote1, onVote2 }) => {
  
  const handlePromo = async (promo1, promo2) => {  
    const fight = new web3.eth.Contract (polygonFight.abi,address)
    await fight.methods.ufp(promo1, promo2).send({ from: accounts[0], value: ''})
    .then(console.log('ide'))
};
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [promo1, setPromo1] = useState(undefined)
  const [promo2, setPromo2] = useState(undefined)
  return (
    <>
 
        <Header showSpinnerStake={showSpinnerStake} showSpinnerUnstake={showSpinnerUnstake} charity={charity} lsb={lsb} onPotWithdraw={onPotWithdraw} accounts={accounts} web3={web3} address ={address} onWithdraw={onWithdraw} onStaking={onStaking} onUnStaking={onUnStaking} fightData={fightData} pendingWithdrawal={pendingWithdrawal} staked={staked} charityBalance={charityBalance} vSliceBalance={vSliceBalance}></Header>
 <div className='flex-container'>
   <div className='left'>
        <ReactPlayer url={fightData[7]} width='75%' height='100%'/>
        <button className= 'btn-promo' onClick={handleShow}><Icon    fill="grey"    size={24}    svg="more vert"  /></button>
   </div>
   <div className='content-center'>
        <Voting shortUrl={shortUrl} showSpinnerVote1={showSpinnerVote1} showSpinnerVote2={showSpinnerVote2} address ={address} startTime={startTime} timer={timer} onVote1={onVote1} onVote2={onVote2} votes1={votes1} votes2={votes2}/>
   </div>   
   <div className='right'>
        <button className= 'btn-promo' onClick={handleShow}><Icon    fill="grey"    size={24}    svg="more vert"  /></button>
        <ReactPlayer url={fightData[8]} width='75%' height='100%'/>
        
   </div>

 </div>   


    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update promo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel controlId="floatingInputGrid" label="Update link to Promo 1">
                  <Form.Control required type="text" placeholder="Update link to Promo 1" onChange={(e) => setPromo1(e.target.value)}/>
                </FloatingLabel>
                </Form.Group>  
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel controlId="floatingInputGrid" label="Update link to Promo 2">
                  <Form.Control required type="text" placeholder="Update link to Promo 2" onChange={(e) => setPromo2(e.target.value)}/>
                </FloatingLabel>
                </Form.Group>  
          </Form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="primary" onClick={()=>handlePromo(promo1, promo2)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default Content