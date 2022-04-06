
import Button from 'react-bootstrap/Button'
import Spot from '../../lib/components/Spot'
import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Spinner from 'react-bootstrap/Spinner'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Web3Storage } from 'web3.storage'
import { Loading, Icon } from 'web3uikit';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Web3 from 'web3'


const Spots = ({ icon, showFlipModal, buyModalShow, showSpinnerBuy, showSpinnerReset, showSpinnerReserve, showSpinnerFlip, fightData, accounts, spots, onSpotReset, onSpotFlip, onSpotReservation, onBuySpot }) => {

    const [show, setShow] = useState(false);
    const [text, setText] = useState();
    const [link, setLink] = useState('empty');
    const [pic, setPic] = useState('empty');
    const [mediaType, setMediaType] = useState('video');
    const [uploading, setUploading] = useState();


    const handleClose = () => {
      setShow(false);}

    const handleShow = () => {
      setShow(true);
    }
    const [disableVideo, setDisableVideo] = useState(false)

useEffect(() => {
  if (buyModalShow===false) {
    handleClose()
  }
}, [buyModalShow])

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
        <div className='buy'>
            <Button size='sm' variant="outline-secondary" onClick={handleShow}>Buy spot for {(Web3.utils.fromWei(((fightData[1])), 'ether'))} <Icon fill="grey" size={12} svg={icon}/></Button>
        </div>
        <section className='card-list'>
            {spots.map((spot)=>(
            <Spot icon={icon} showFlipModal={showFlipModal} showSpinnerReset = {showSpinnerReset} showSpinnerReserve={showSpinnerReserve} showSpinnerFlip={showSpinnerFlip} fightData={fightData} accounts ={accounts} key={spot.SpotNo} spot={spot} onSpotReservation={onSpotReservation} onSpotFlip={onSpotFlip} onSpotReset={onSpotReset}    >
            </Spot>    
            )
            )}
        </section>
        



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
          {!showSpinnerBuy && <Button variant="primary" onClick={()=>onBuySpot(text, link, pic, mediaType)}>Create spot</Button>}
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

