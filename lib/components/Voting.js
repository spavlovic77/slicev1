import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import { Icon} from 'web3uikit';



const Voting = ( { shortUrl, showSpinnerVote1, showSpinnerVote2, address, startTime, timer, votes1, votes2, onVote1, onVote2 }) => {

    

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleCopy = async () => {
            const linkToFight = shortUrl
            console.log(linkToFight)
            await navigator.clipboard.writeText(linkToFight);
            setShow(true)
    }
    const d = new Date();
    const time = d.getTime();
    const timeInt=parseInt(time)


    const [days, setDays] = useState()
    const [hours, setHours] = useState();
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();
    const [dist, setDist] = useState()
    const [interval, setId] = useState(undefined)

    useEffect(()=>{
        clearInterval(interval)
        if (timer!=undefined && startTime!=undefined) {
            const myInterval = setInterval(() => {
            const d = new Date();
            const time = d.getTime();
            const timeInt=parseInt(time)
            const actTimerInt=parseInt(timer)*1000
            const startTimeInt=parseInt(startTime)*1000
            const distance = ((startTimeInt+actTimerInt)-timeInt)
            setId(myInterval)
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
        }, [startTime]);
console.log(((startTime*1000)+(timer*1000)), timeInt)
    return (
        <>
        <div className='center'>
            <ul className='center-timer'>
                {((startTime*1000)+(timer*1000)) > timeInt && 
                 <li>
                    <Icon fill="green" size={20} svg="off"/> {dist > 0 ? (days <10 ? '0'+days : days) +':'+(hours <10 ? '0'+hours : hours)+':'+(minutes <10 ? '0'+ minutes : minutes)+':'+(seconds <10 ? '0'+seconds : seconds) : 'Refresh window'}
                 </li>}
                 {((startTime*1000)+(timer*1000)) <= timeInt && 
                 <li>
                     <Icon fill="red" size={20} svg="off"/> Game Over
                 </li>}
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
            <li className='center-button-left'>
            <Icon fill="grey" size={32} svg="arrowCircleLeft"/>
                    {!showSpinnerVote1 && <Button  variant="outline-secondary" onClick={onVote1}>Vote</Button>}
                    {showSpinnerVote1 && <Button  variant="secondary" disabled>
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
                    {!showSpinnerVote2 && <Button  variant="outline-secondary" onClick={onVote2}>Vote</Button>}<Icon fill="grey" size={32} svg="arrowCircleRight"/>
                    {showSpinnerVote2 && <Button  variant="secondary" disabled>
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
                <li className='short-link'> 
                <button onClick={handleCopy} className='btn-promo'><Icon fill="black" size={18} svg="copy" /> <a>Copy fight link</a></button>
                </li>
                <li>

                </li>
            </ul>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title><Icon fill="green" size={32} svg="checkmark"/> Link copied to your clipboard</Modal.Title>
            </Modal.Header>
            <Modal.Body><span className='link-background'>{shortUrl}</span></Modal.Body>
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
