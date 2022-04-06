
import Button from 'react-bootstrap/Button'
import Web3 from 'web3'
import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Icon, Loading } from 'web3uikit';
import Spinner from 'react-bootstrap/Spinner'
import ProgressBar from 'react-bootstrap/ProgressBar'
import ReactPlayer from 'react-player'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { Web3Storage } from 'web3.storage'


const Spot = ({ icon, showFlipModal, showSpinnerReset, showSpinnerReserve, showSpinnerFlip, fightData, accounts, spot, onSpotReset, onSpotFlip, onSpotReservation }) => {

    const [show, setShow] = useState(false);
    const [text, setText] = useState(undefined);
    const [link, setLink] = useState('');
    const [pic, setPic] = useState('empty');
    const [mediaType, setMediaType] = useState('video');
    const [uploading, setUploading] = useState();


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [disableVideo, setDisableVideo] = useState(false)

    const d = new Date();
    const time = d.getTime();
    const timeInt=parseInt(time)

    useEffect(() => {
      if (showFlipModal===false) {
        setText('')
        setLink('')
        setPic('empty')
        setDisableVideo(false)
        setLeft('160')
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
          const token = process.env.NEXT_PUBLIC_WEB3STORAGETOKEN
          const [files, setFiles] = useState([])
        
          async function handleUpload (event) {
            console.log({files})
            if (files.length==0) {alert ('Select a file please');return;}
            setUploading('Uploading')
            // don't reload the page!
            event.preventDefault()
            const client = new Web3Storage({ token })
            const file = document.getElementById('filepicker'); 
            const filename=file.value;
            const fileNameClean=filename.replace(/.*[\/\\]/, '');
            const onRootCidReady = rootCid => console.log('root cid:', rootCid)
            const cid = await client.put(files, { onRootCidReady })
            setMediaType('picture')
            setDisableVideo(true)
            setPic(`https://dweb.link/ipfs/${cid}/${fileNameClean}`)
            setUploading('Uploaded')
          }

    return (
        <>
            <article className='card'>
                <div className='card-flip'>
                     {((spot.bu <= timeInt/1000 && spot.ru <= timeInt/1000) || (spot.ru >= timeInt/1000 && spot.booker.toLowerCase() === accounts[0])) ? <Button size='sm' variant="outline-secondary" onClick={handleShow}>Flip for {(Web3.utils.fromWei(((spot.priceOfSpot)), 'ether'))} </Button> : <Button size='sm' variant="outline-secondary" onClick={handleShow} disabled>Flip</Button>}
                </div>
                <div className='text'>
                    {spot.text}
                </div> 
                {spot.mediaType=='picture' && <div className="card-img-top"><a target="_blank" href={spot.link} rel="noopener noreferrer"><img src={spot.pic}/></a></div>}
                {spot.mediaType=='picture' && <div className='link'><Icon fill="black" size={16} svg="link"/>
                  <a target="_blank" href={spot.link} rel="noopener noreferrer">{spot.link}</a>
                </div>}
                {spot.mediaType=='video' && <div className='card-img-top'><ReactPlayer  className='video' url={spot.pic} width='100%' height='100%'/></div>}
                {spot.mediaType=='video' && <div className='link'></div>}
                  <ul className='card-status'>
                    {(spot.bu*1000)-timeInt > 0 && <li><Icon className='icon-inline' fill="red" size={14} svg="lockClosed"/>Locked untill {getTime(spot.bu)}</li>}
                    {(spot.ru*1000)-timeInt > 0 && <li><Icon className='icon-inline' fill="red" size={14} svg="lockClosed"/>Reserved untill {getTime(spot.ru)}</li>}
                  </ul>
                <ul className='card-buttons'>
                  <li>
                      {(spot.flipper.toLowerCase() !=accounts[0] && spot.bu <= timeInt/1000 && spot.ru <= timeInt/1000)  ? <Button style = {{margin: '2px'}} size='sm' variant="outline-secondary" onClick={() => onSpotReservation(spot.SpotNo)}>Reserve</Button> : <Button style = {{margin: '2px'}} size='sm' variant="outline-secondary" onClick={() => onSpotReservation(spot.SpotNo)} hidden>Reserve</Button>}
                  </li>
                  <li>
                      {fightData[0].toLowerCase() !=accounts[0] ? <Button style = {{margin: '2px'}} size='sm'variant="outline-secondary" onClick={()=> onSpotReset(spot.SpotNo)} hidden>Reset</Button> : <Button style = {{margin: '2px'}} size='sm' variant="outline-secondary" onClick={()=> onSpotReset(spot.SpotNo)}>Reset</Button>}
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
                {left >= 25 && <div><ProgressBar variant="success" now={((left/160)*100)} /></div>}
                {(left <= 24 && left >=10) && <div><ProgressBar variant="warning" now={((left/160)*100)} /></div>}
                {left <= 9 && <div><ProgressBar variant="danger" now={((left/160)*100)} /></div>}<br />
                

                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                      <Tab eventKey="picture" title="Upload a picture">
                      <Form.Group  className="mb-3">
                                        <Form.Label>Select picture</Form.Label>
                                        <Form.Control type="file" id='filepicker' onChange={e => setFiles(e.target.files)} />
                                      </Form.Group>
                                      {files.length==0 && <Button variant='secondary' disabled> Upload picture</Button>}
                                      {files.length>0 && <Button variant='success' onClick={handleUpload}> Upload picture</Button>}
                                      {uploading=='Uploading' && <div
                                                  style={{
                                                    backgroundColor: '#ECECFE',
                                                    borderRadius: '8px',
                                                    padding: '20px'
                                                  }}
                                                >
                                                  <Loading text="Uploading file to ipfs..." size={30}  spinnerColor="#2E7DAF"/>
                                                </div>}
                                      {uploading=='Uploaded' && <Icon
                                                            fill="green"
                                                            size={24}
                                                            svg="checkmark" 
                                                          />}<br />
                    <Form.Label htmlFor="basic-url">Enter link</Form.Label>
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3"> https://example.com</InputGroup.Text>
                    <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={(e) => setLink(e.target.value)}/>
                     </InputGroup>
                    </Tab>
                    {disableVideo && <Tab eventKey="video" title="Picture will be shown on your card" disabled>
                        <Form.Group className="mb-3" >
                          <Form.Label>Link to video</Form.Label>
                          <Form.Control type="text" placeholder="Enter link to video" onChange={(e) => setPic(e.target.value)}  />
                        </Form.Group>
                      </Tab>}
                    {!disableVideo && <Tab eventKey="video" title="Or share a video" >
                        <Form.Group className="mb-3" >
                          <Form.Label>Link to video</Form.Label>
                          <Form.Control type="text" placeholder="Enter link to video" onChange={(e) => setPic(e.target.value)}  />
                        </Form.Group>
                      </Tab>}
                 </Tabs>
          </Form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!showSpinnerFlip && <Button variant="secondary" onClick={()=>onSpotFlip(text, link, pic, spot.SpotNo, spot.priceOfSpot, mediaType)}>Flip</Button>}
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
