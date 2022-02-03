import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import { Icon} from 'web3uikit';

const Voting = ( { showSpinnerVote1, showSpinnerVote2, address, startTime, timer, votes1, votes2, onVote1, onVote2 }) => {

    

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleCopy = async () => {
            const linkToFight = `http://localhost:3000/fights/${address}`
            console.log(linkToFight)
            await navigator.clipboard.writeText(linkToFight);
            setShow(true)
    }

    const [days, setDays] = useState()
    const [hours, setHours] = useState();
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();
    const [dist, setDist] = useState()

    useEffect(()=>{
        if (timer!=undefined || startTime!=undefined) {
        const myInterval = setInterval(() => {
        const d = new Date();
        const time = d.getTime();
        const timeInt=parseInt(time)
        const actTimerInt=parseInt(timer)*1000
        console.log({timer})
        const startTimeInt=parseInt(startTime)*1000
        console.log({startTime})
        const distance = ((startTimeInt+actTimerInt)-timeInt)
        

        setDist(distance)
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)))
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
        if (distance < 0) {
            clearInterval(myInterval);
          }
    }, 1000)   
    }    
    }, [timer, startTime]);

    return (
        <>
        <div className='center'>
            <ul className='center-timer'>
                <li>
                    <Icon fill="grey" size={20} svg="bell"/> {dist > 0 ? days+':'+hours+':'+minutes+':'+seconds : 'Refresh window'}
                 </li>
            </ul>
            <ul className='center-votes'>
                <li>
                    <p>{votes1}</p>
                </li>
                <li>
                    <p>{votes2}</p>
                </li>
            </ul>
            <ul className='center-buttons'>
            <li className='center-button-right'>
                    {!showSpinnerVote1 && <Button variant="outline-secondary" onClick={onVote1}>Vote</Button>}<Icon fill="grey" size={32} svg="arrow circle right"/>
                    {showSpinnerVote1 && <Button variant="secondary" disabled>
                                        <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        />
                                    </Button>}
                </li>
                <li className='center-button-right'>
                    {!showSpinnerVote2 && <Button variant="outline-secondary" onClick={onVote2}>Vote</Button>}<Icon fill="grey" size={32} svg="arrow circle right"/>
                    {showSpinnerVote2 && <Button variant="secondary" disabled>
                                        <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        />
                                    </Button>}
                </li>
            </ul>
            <ul className='center-map'>
                <li className='see-map'>
                <Link href="/map/[address]" as={`/map/${address}`}><a><Icon fill="grey" size={18} svg="pin"/>See map</a></Link>
                </li>
                <li> 
                <button onClick={handleCopy} className='btn-promo'><Icon fill="black" size={18} svg="copy" /> Share fight</button>
                </li>
            </ul>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Lets share it</Modal.Title>
            </Modal.Header>
            <Modal.Body>Link to fight is in your clipboad</Modal.Body>
            <Modal.Footer>
            <Button variant="success" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
      </Modal>
        </>
    )
}

export default Voting
