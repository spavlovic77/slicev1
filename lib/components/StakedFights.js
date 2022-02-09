import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import polygonFight from '../contracts/Fight.json'
import Web3 from 'web3'
import { Table, TabList, Tab, Icon } from 'web3uikit';


const StakedFights = ({ stakedFights, onUnstake }) => {

  if (stakedFights!=undefined) {
    const dataFeed3 = stakedFights
    .map(stakedFights => ['', <Link href="/fights/[address]" as={`/fights/${stakedFights.contract}`}>{`Fight `+stakedFights.contract.substring(0,6)+`...`+stakedFights.contract.substring(38,42)}</Link>,
    <span>{Math.floor(Web3.utils.fromWei(((stakedFights.Staked).toString()), 'ether'))+` SLICE`}</span>,
    <Button variant='outline-secondary' onClick={()=>onUnstake(stakedFights.Staked, stakedFights.contract)}>Unstake</Button>, ''])
    .sort((a,b) => b.Staked > a.Staked ? 1 : -1)
  }

return (
    <>
    <div className='tabs-wrapper'>
          {stakedFights && <Table
      columnsConfig="80px 3fr 2fr 2fr 80px"
      data={dataFeed3}
      header={[
        '',
        <span>Fight</span>,
        <span>Staked</span>,
        <span>Action</span>,
        ''
      ]}
      maxPages={3}
      onPageNumberChanged={function noRefCheck(){}}
      pageSize={5}
    />}
    </div>

      </>
    )
        }

export default StakedFights
