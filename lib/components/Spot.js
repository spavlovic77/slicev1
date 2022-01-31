
import Button from 'react-bootstrap/Button'
import Web3 from 'web3'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Icon } from 'web3uikit';


const Spot = ({ fightData, accounts, spot, onSpotReset, onSpotFlip, onSpotReservation }) => {

    const [show, setShow] = useState(false);
    const [text, setText] = useState(undefined);
    const [link, setLink] = useState(undefined);
    const [pic, setPic] = useState('reserved');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const d = new Date();
    const time = d.getTime();
    const timeInt=parseInt(time)



const getTime = (t) => {
    var date = new Date(t * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
        }
console.log({spot})
    return (
        <>
            <article className='card'>
                <div className='card-flip'>
                     {((spot.bu <= timeInt/1000 && spot.ru <= timeInt/1000) || (spot.ru >= timeInt/1000 && spot.booker.toLowerCase() === accounts[0])) ? <Button variant="outline-secondary" onClick={handleShow}>Flip for {(Web3.utils.fromWei(((spot.priceOfSpot)), 'ether'))}</Button> : <Button variant="outline-secondary" onClick={handleShow} disabled>Flip</Button>}
                </div>
                <div className='text'>
                    {spot.text}
                </div> 
                <div className='link'><Icon fill="black" size={16} svg="link"/>
                  <a target="_blank" href={spot.link} rel="noopener noreferrer">{spot.link}</a>
                </div>
                <div className='card-status'>
                  Busy untill {getTime(spot.bu)} Reserved untill:{getTime(spot.ru)}
                </div>
                <ul className='card-buttons'>
                  <li>
                  {(spot.flipper.toLowerCase() !=accounts[0] && spot.bu <= timeInt/1000 && spot.ru <= timeInt/1000)  ? <Button variant="outline-secondary" onClick={() => onSpotReservation(spot.SpotNo)}>Reserve</Button> : <Button variant="outline-secondary" onClick={() => onSpotReservation(spot.SpotNo)} disabled>Reserve</Button>}
                  </li>
                  <li>
                      {fightData[0].toLowerCase() !=accounts[0] ? <Button variant="outline-secondary" onClick={()=> onSpotReset(spot.SpotNo)} hidden>Reset</Button> : <Button variant="outline-secondary" onClick={()=> onSpotReset(spot.SpotNo)}>Reset</Button>}
                  </li>
                </ul>
            </article>
        

         <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a spot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form> 
                <InputGroup>
                    <InputGroup.Text>Say something</InputGroup.Text>
                    <FormControl as="textarea" aria-label="With textarea" onChange={(e) => setText(e.target.value)} />
                </InputGroup>
                <Form.Label htmlFor="basic-url">Enter hyperlink</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3"> https://www.example.com</InputGroup.Text>
                    <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={(e) => setLink(e.target.value)}/>
                </InputGroup>         
          </Form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>onSpotFlip(text,link, pic, spot.spotNo, spot.priceOfSpot)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

        </>
    )
}

export default Spot
