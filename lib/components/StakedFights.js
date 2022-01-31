import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import polygonFight from '../contracts/Fight.json'
import Web3 from 'web3'


const StakedFights = ({ stakedFights, onUnstake }) => {

return (
    <>
    <div className='table'>
    <table>
    <tr>
      <th>Fight</th>
      <th>Staked</th>
      <th>Action</th>
    </tr>
    {stakedFights && stakedFights.map((stakedFights, index) => (
        <tr key={index}>
        <td className='fight-link'>  <Link href="/fights/[address]" as={`/fights/${stakedFights.contract}`}>{`Fight `+stakedFights.contract.substring(0,6)+`...`+stakedFights.contract.substring(38,42)}</Link>
          </td>
        <td>{Math.floor(Web3.utils.fromWei(((stakedFights.Staked).toString()), 'ether'))+` SLICE`}</td>
        <td><Button variant='outline-secondary' onClick={()=>onUnstake(stakedFights.Staked, stakedFights.contract)}>Unstake</Button></td>
        </tr>
            )).sort((a,b) => b.index > a.index ? 1 : -1)}    
            </table>
      </div>    
  </>
)
    }

export default StakedFights
