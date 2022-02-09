
import Button from 'react-bootstrap/Button'
import Web3 from 'web3'
import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Icon } from 'web3uikit';
import Spinner from 'react-bootstrap/Spinner'
import ProgressBar from 'react-bootstrap/ProgressBar'


const Spot = ({ showFlipModal, showSpinnerReset, showSpinnerReserve, showSpinnerFlip, fightData, accounts, spot, onSpotReset, onSpotFlip, onSpotReservation }) => {

    const [show, setShow] = useState(false);
    const [text, setText] = useState(undefined);
    const [link, setLink] = useState(undefined);
    const [pic, setPic] = useState('reserved');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const d = new Date();
    const time = d.getTime();
    const timeInt=parseInt(time)

    useEffect(() => {
      if (showFlipModal===false) {
        handleClose()
      }
    }, [showFlipModal])

    //reservation modal handler start
    const [showReservationModal, setShowReservationModal] = useState(false);
    const handleCloseReservationModal = () => setShowReservationModal(false);
    const handleShowReservationModal = () => setShowReservationModal(true);
    useEffect(() => {
      if (showSpinnerReserve===true) {
        handleShowReservationModal()
      }
      else if (showSpinnerReserve===false) {
        handleCloseReservationModal()
      }
    }, [showSpinnerReserve])
    //reservation modal hander end

    //reset modal handler start
    const [showResetModal, setShowResetModal] = useState(false);
    const handleCloseResetModal = () => setShowResetModal(false);
    const handleShowResetModal = () => setShowResetModal(true);
    useEffect(() => {
      if (showSpinnerReset===true) {
        handleShowResetModal()
      }
      else if (showSpinnerReset===false) {
        handleCloseResetModal()
      }
    }, [showSpinnerReset])
    //reset modal hander end


const getTime = (t) => {
    var date = new Date(t * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
        }

        const [left, setLeft] =useState()
        const countText =(a) => {
          const l= a.length
          const lefty = 160-l
          console.log(lefty, text)
          if (lefty>=0) {
          setLeft(lefty)
          setText(a)}
          }


    return (
        <>
            <article className='card'>
                <div className='card-flip'>
                     {((spot.bu <= timeInt/1000 && spot.ru <= timeInt/1000) || (spot.ru >= timeInt/1000 && spot.booker.toLowerCase() === accounts[0])) ? <Button size='sm' variant="outline-secondary" onClick={handleShow}>Flip for {(Web3.utils.fromWei(((spot.priceOfSpot)), 'ether'))}</Button> : <Button size='sm' variant="outline-secondary" onClick={handleShow} disabled>Flip</Button>}
                </div>
                <div className='text'>
                    {spot.text}
                </div> 
                <div className='link'><Icon fill="black" size={16} svg="link"/>
                  <a target="_blank" href={spot.link} rel="noopener noreferrer">{spot.link}</a>
                </div>
                  <ul className='card-status'>
                    {(spot.bu*1000)-timeInt > 0 && <li><Icon fill="red" size={14} svg="lockClosed"/>Locked untill {getTime(spot.bu)}</li>}
                    {(spot.ru*1000)-timeInt > 0 && <li><Icon fill="red" size={14} svg="lockClosed"/>Reserved untill {getTime(spot.ru)}</li>}
                  </ul>
                <ul className='card-buttons'>
                  <li>
                      {(spot.flipper.toLowerCase() !=accounts[0] && spot.bu <= timeInt/1000 && spot.ru <= timeInt/1000)  ? <Button size='sm' variant="outline-secondary" onClick={() => onSpotReservation(spot.SpotNo)}>Reserve</Button> : <Button size='sm' variant="outline-secondary" onClick={() => onSpotReservation(spot.SpotNo)} hidden>Reserve</Button>}
                  </li>
                  <li>
                      {fightData[0].toLowerCase() !=accounts[0] ? <Button size='sm'variant="outline-secondary" onClick={()=> onSpotReset(spot.SpotNo)} hidden>Reset</Button> : <Button size='sm' variant="outline-secondary" onClick={()=> onSpotReset(spot.SpotNo)}>Reset</Button>}
                  </li>
                </ul>
            </article>
        

            <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Create your spot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form> 
                <InputGroup>
                    <InputGroup.Text>Say something</InputGroup.Text>
                    <FormControl maxLength={160} as="textarea" rows="4" cols="50" aria-label="With textarea"  onChange={(e) => countText(e.target.value)}/>
                </InputGroup>
                {left >= 25  && <div><ProgressBar variant="success" now={((left/160)*100)} /></div>}
                {(left <= 24 && left >=10) && <div><ProgressBar variant="warning" now={((left/160)*100)} /></div>}
                {left <= 9 && <div><ProgressBar variant="danger" now={((left/160)*100)} /></div>}
                <Form.Label htmlFor="basic-url">Enter link</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3"> https://example.com</InputGroup.Text>
                    <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={(e) => setLink(e.target.value)}/>
                </InputGroup>         
          </Form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!showSpinnerFlip && <Button variant="secondary" onClick={()=>onSpotFlip(text, link, pic, spot.SpotNo, spot.priceOfSpot)}>Flip</Button>}
          {showSpinnerFlip && <Button variant="secondary" disabled>
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

      <Modal show={showReservationModal} onHide={handleCloseReservationModal} backdrop="static">
        <Modal.Body>
        Reservation in progress <Spinner animation="grow" size="md" /> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReservationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showResetModal} onHide={handleCloseResetModal} backdrop="static">
        <Modal.Body>
        Reset in progress <Spinner animation="grow" size="md" /> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseResetModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



        </>
    )
}

export default Spot
