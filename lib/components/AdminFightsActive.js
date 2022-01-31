import polygonFight from '../contracts/Fight.json'
import Link from 'next/link'
import useSWR from "swr";
import Button from 'react-bootstrap/Button'



const AdminFightsActive = ({ detail, web3, accounts }) => {


console.log('details', detail)

 
  const getTime = (t) => {
    console.log('t', t)
    const d = new Date();
    let time = d.getTime();
    let timeInteger=parseInt(time);
    let counDownInteger=parseInt(t)*1000
    const countDownDate = timeInteger+counDownInteger
    const distance = ((countDownDate-timeInteger))
    const days=(Math.floor(distance / (1000 * 60 * 60 * 24)))
    const hours=(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    const minutes=(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
    const seconds=(Math.floor((distance % (1000 * 60)) / 1000))
    const formattedTime = days + "d " + hours + "h "+ minutes + "m " + seconds + "s "
    return formattedTime;
        }


return (
  <>
  {(!detail || detail.length==0) ? <div>Scanning blockchain....</div> : null }
  {detail && detail.map((fight, index) => (
    <div  key={index}>
    <ul>
        <li>
        <Link href="/fights/[address]" as={`/fights/${fight.contract}`}>{`Fight `+fight.contract.substring(0,6)+`...`+fight.contract.substring(38,42)+` Finishes in `+getTime(fight.actTimer)}</Link>
        </li>
    <li>
            <Button variant='outline-warning' >Change params</Button>
        </li>
    </ul>
    </div>)).sort((a,b) => b.index > a.index ? 1 : -1)}
</>
    )    
}

export default AdminFightsActive

