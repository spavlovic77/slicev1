import Spinner from 'react-bootstrap/Spinner'
import ReactPlayer from 'react-player'
import Header from '../../lib/components/Header'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import polygonFight from '../contracts/Fight.json'
import Voting from '../components/Voting'
import { Icon } from 'web3uikit';


const Content = ({ whitel, isReg, showSpinnerPot, showSpinnerWith, shortUrl, showSpinnerVote1, showSpinnerVote2, showSpinnerStake, showSpinnerUnstake, charity, startTime, timer, lsb, accounts, web3, address, fightData, staked, charityBalance, vSliceBalance,pendingWithdrawal, onWithdraw,onPotWithdraw, onStaking, onUnStaking,votes1, votes2, onVote1, onVote2 }) => {
  
  const [showSpinnerPromo, setShowSpinnerPromo]= useState()
  const handlePromo = async (promo1, promo2) => {  
    setShowSpinnerPromo(true)
    const fight = new web3.eth.Contract (polygonFight.abi,address)
    await fight.methods.ufp(promo1, promo2).send({ from: accounts[0], value: ''})
    .then(console.log('ide'))
    setShowSpinnerPromo(false)
    handleClose()
    window.location.reload()
};
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [promo1, setPromo1] = useState(undefined)
  const [promo2, setPromo2] = useState(undefined)
  console.log({fightData})
  return (
    <>
 
        <Header showSpinnerPot={showSpinnerPot} showSpinnerWith={showSpinnerWith} showSpinnerStake={showSpinnerStake} showSpinnerUnstake={showSpinnerUnstake} charity={charity} lsb={lsb} onPotWithdraw={onPotWithdraw} accounts={accounts} web3={web3} address ={address} onWithdraw={onWithdraw} onStaking={onStaking} onUnStaking={onUnStaking} fightData={fightData} pendingWithdrawal={pendingWithdrawal} staked={staked} charityBalance={charityBalance} vSliceBalance={vSliceBalance}></Header>
 <div className='flex-container'>
   <div className='left'>
        <ReactPlayer url={fightData[7]} width='75%' height='100%'/>
        <button className= 'btn-promo' onClick={handleShow}><Icon    fill="grey"    size={24}    svg="moreVert"  /></button>
   </div>
   <div className='content-center'>
        <Voting whitel={whitel} isReg={isReg} shortUrl={shortUrl} showSpinnerVote1={showSpinnerVote1} showSpinnerVote2={showSpinnerVote2} address ={address} startTime={startTime} timer={timer} onVote1={onVote1} onVote2={onVote2} votes1={votes1} votes2={votes2}/>
   </div>   
   <div className='right'>
        <button className= 'btn-promo' onClick={handleShow}><Icon    fill="grey"    size={24}    svg="moreVert"  /></button>
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

          {!showSpinnerPromo && <Button variant="primary" onClick={()=>handlePromo(promo1, promo2)}>
            Save Changes
          </Button>}
          {showSpinnerPromo && <Button  variant="secondary" disabled>
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

export default Content