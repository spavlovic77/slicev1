import Button from 'react-bootstrap/Button'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import { Icon} from 'web3uikit';

const Voting = ( { address, startTime, timer, votes1, votes2, onVote1, onVote2 }) => {

    const [days, setDays] = useState()
    const [hours, setHours] = useState();
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();
    const [dist, setDist] = useState()

    // const getTime = (t) => {
    //     var sec_num = parseInt(t); // don't forget the second param
    //     var hours   = Math.floor(sec_num / 3600);
    //     var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    //     var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
    //     if (hours   < 10) {hours   = "0"+hours;}
    //     if (minutes < 10) {minutes = "0"+minutes;}
    //     if (seconds < 10) {seconds = "0"+seconds;}
    //     return hours+':'+minutes+':'+seconds;
    // }
    // const getTimeStart = (t) => {
    //     const date= new Date(t * 1000).toISOString().substr(11, 8)
    //     return date;
    // }
    useEffect(()=>{
        if (timer!=undefined || startTime!=undefined) {
    const myInterval = setInterval(() => {
        const d = new Date();
        const time = d.getTime();
        const timeInt=parseInt(time)
        const actTimerInt=parseInt(timer)*1000
        const startTimeInt=parseInt(startTime)*1000
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
    }, [timer]);


    return (
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
                <li className='center-button-left'>
                <Icon fill="grey" size={32} svg="arrow circle left"/><Button variant="outline-secondary" onClick={onVote1}>Vote</Button>
                </li>
                <li className='center-button-right'>
                    <Button variant="outline-secondary" onClick={onVote2}>Vote</Button><Icon fill="grey" size={32} svg="arrow circle right"/>
                </li>
            </ul>
            <ul className='center-map'>
                <li>
                <Link href="/map/[address]" as={`/map/${address}`}><a><Icon fill="grey" size={36} svg="pin"/></a></Link>
                </li>
            </ul>
        </div>
    )
}

export default Voting
