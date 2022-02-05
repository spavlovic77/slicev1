
import Button from 'react-bootstrap/Button'
import Spot from '../../lib/components/Spot'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Spinner from 'react-bootstrap/Spinner'


const Spots = ({ showSpinnerBuy, showSpinnerReset, showSpinnerReserve, showSpinnerFlip, fightData, accounts, spots, onSpotReset, onSpotFlip, onSpotReservation, onBuySpot }) => {

    const [show, setShow] = useState(false);
    const [text, setText] = useState(undefined);
    const [link, setLink] = useState(undefined);
    const [pic, setPic] = useState('undefined');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const [left, setLeft] =useState()
    const countText =(a) => {
      const l= a.length
      const lefty = 160-l
      console.log(lefty, text)
      if (lefty>=0) {
      setLeft(lefty)
      setText(a)}
      else {alert ('160 letters exceeded. Please reduce.')}
    }

    return (
        <>
        <div className='buy'>
            <Button variant="outline-secondary" onClick={handleShow}>Buy spot</Button>
        </div>
        <section className='card-list'>
            {spots.map((spot)=>(
            <Spot showSpinnerReset = {showSpinnerReset} showSpinnerReserve={showSpinnerReserve} showSpinnerFlip={showSpinnerFlip} fightData={fightData} accounts ={accounts} key={spot.SpotNo} spot={spot} onSpotReservation={onSpotReservation} onSpotFlip={onSpotFlip} onSpotReset={onSpotReset}    >
            </Spot>    
            )
            )}
        </section>
        



             <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create your spot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form> 
                <InputGroup>
                    <InputGroup.Text>Say something</InputGroup.Text>
                    <FormControl as="textarea" rows="4" cols="50" aria-label="With textarea"  onChange={(e) => countText(e.target.value)}/>
                </InputGroup>
                <div>Remaining space {left}</div><br></br>
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
          {!showSpinnerBuy && <Button variant="primary" onClick={()=>onBuySpot(text, link, pic)}>Create spot</Button>}
          {showSpinnerBuy && <Button variant="secondary" disabled>
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

export default Spots
