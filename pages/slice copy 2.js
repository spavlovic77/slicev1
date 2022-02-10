import Web3Container from '../lib/infra/Web3Containter'
import Navbar from '../lib/components/Navbar'
import LandingFights from '../lib/components/LandingFights'
import Footer from '../lib/components/Footer'
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from 'react'
import useSWR from "swr";
import polygonFight from '../lib/contracts/Fight.json'
import Link from 'next/link'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

         

const Slice = ({ accounts, slice, fightFactory, web3, networkId }) => {

  const allFights = () =>{
    const req =  fightFactory.methods.getAllFights().call({ from: accounts[0]})
    const res =  req
    return res
}

const fetcherFightDetails =  async(web3, accounts, all) =>  {
  const listN =[]
  for (let i=0; i<all.length; i++) {
   const fight = await new web3.eth.Contract(polygonFight.abi,all[i].fightContract)
   const adminFights =  await fight.methods.getFightParams().call({ from: accounts[0] }).then(data => {
    listN.push({contract: all[i].fightContract, flipperShare: data[0], influ2Share: data[1], spotCashBack: data[2], usersSlice: data[3], charitySlice: data[4], iscs: data[5], uscs: data[6], maxUsers: data[7], spotBusyTime: data[8], spotReservTime: data[9], actTimer: data[10]})
  })
  }
  return listN
  }

  const lsp =  async(web3, accounts, all) =>  {
    const listN =[]
    for (let i=0; i<all.length; i++) {
     const fight = await new web3.eth.Contract(polygonFight.abi,all[i].fightContract)
     const adminFights =  await fight.methods.showLastSpotPot().call({ from: accounts[0] }).then(data => {
      listN.push({contract: all[i].fightContract, lspBalance: data[0]})
    })
    }
    return listN
    }

const { data: all, error } = useSWR([fightFactory, accounts, 'all1'], allFights)
const { data: detail } = useSWR(all ? [web3, accounts, all, 'detailsOfFights'] : null, fetcherFightDetails)
const { data: lastSpotBalance } = useSWR(all ? [web3, accounts, all, 'lastSpotBalance'] : null, lsp)
console.log(lastSpotBalance)

  const [freshMintData, setFreshMintData] = useState(true)
  const [loadingMintData, setLoadingMintData] = useState(false)
  const [staked, setStaked] = useState(undefined)
  const [vSliceBalance, setVSliceBalance] = useState(undefined)
  useEffect(() => {
    const init = async () => {
      try { 
          const vSliceBalance = await slice.methods.vSliceViewBalance(accounts[0]).call({ from: accounts[0] })
          .then(data => {
            setVSliceBalance(data)
          })              
          const stakedSliceBalance = await slice.methods.getStakedBalance().call({ from: accounts[0] })
          .then(data => {
            setStaked(data)
            setLoadingMintData(true)
          })
      } catch(e) {
        alert(e);
      }};
    init();
  }, [freshMintData]);


  const [showSpinnerMinter, setShowSpinnerMinter] = useState(false)
  const handleMint = async () => {
    setShowSpinnerMinter(true)
    await slice.methods.vSliceMinting_ExW().send({ from: accounts[0] })
    .on('receipt', receipt => {
      setShowSpinnerMinter(false)
    })
    };


    const [key, setKey] = useState('Highest Last Spot Pot');

  return (
    <>
      <Navbar onMint={handleMint} showSpinnerMinter={showSpinnerMinter} staked={staked} vSliceBalance={vSliceBalance} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>
    
      <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="home" title="Highest Last Spot Pot">
      <table>
          <thead>
            <tr>
            <th>Fight</th>
            <th>Users</th>
            </tr>
          </thead>
        {lastSpotBalance && lastSpotBalance.map((fight, index) => (
          <tbody>
        <tr key={index}>
        <td className='fight-link'> <Link href="/fights/[address]" as={`/fights/${fight.contract}`}>{`Fight `+fight.contract.substring(0,6)+`...`+fight.contract.substring(38,42)}</Link>
        </td>
        <td>{fight.lspBalance}</td>
        </tr>
        </tbody>
            )).sort((a,b) => b.lspBalance > a.lspBalance ? 1 : -1)}    
            
        </table>
      </Tab>
      <Tab eventKey="profile" title="Highest Users Reward">
        <table>
          <thead>
            <tr>
            <th>Fight</th>
            <th>Users</th>
            </tr>
          </thead>
        {detail && detail.map((fight, index) => (
          <tbody>
        <tr key={index}>
        <td className='fight-link'> <Link href="/fights/[address]" as={`/fights/${fight.contract}`}>{`Fight `+fight.contract.substring(0,6)+`...`+fight.contract.substring(38,42)}</Link>
        </td>
        <td>{fight.uscs} %</td>
        </tr>
        </tbody>
            )).sort((a,b) => b.uscs > a.uscs ? 1 : -1)}    
            
        </table>
      </Tab>
      <Tab eventKey="contact" title="Highest Charity Reward">
      <table>
          <thead>
            <tr>
            <th>Fight</th>
            <th>Charity</th>
            </tr>
          </thead>
        {detail && detail.map((fight, index) => (
          <tbody>
        <tr key={index}>
        <td className='fight-link'> <Link href="/fights/[address]" as={`/fights/${fight.contract}`}>{`Fight `+fight.contract.substring(0,6)+`...`+fight.contract.substring(38,42)}</Link>
        </td>
        <td>{fight.charitySlice} %</td>
        </tr>
        </tbody>
            )).sort((a,b) => b.charitySlice > a.charitySlice ? 1 : -1)}    
            
        </table>
      </Tab>
    </Tabs>
</>
  )
}


const sli = () => (
  <Web3Container
    renderLoading={() => <div><Alert variant='warning'>Loading Dapp Page...</Alert></div>}
    render={({ accounts, slice, fightFactory, web3, networkId }) => (
      <Slice accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>
    )}
  />
)
export default sli
