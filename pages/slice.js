import Web3Container from '../lib/infra/Web3Containter'
import Navbar from '../lib/components/Navbar'
import LandingFights from '../lib/components/LandingFights'
import Footer from '../lib/components/Footer'
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from 'react'
import useSWR from "swr";
import polygonFight from '../lib/contracts/Fight.json'
import Link from 'next/link'
import { Table, Icon, Tag, Avatar } from 'web3uikit';

         

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

const { data: all, error } = useSWR([fightFactory, accounts, 'all1'], allFights)
const { data: detail } = useSWR(all ? [web3, accounts, all, 'detailsOfFights'] : null, fetcherFightDetails)


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

    console.log('detail', detail)
    console.log({all})
  return (
    <>
      <Navbar onMint={handleMint} showSpinnerMinter={showSpinnerMinter} staked={staked} vSliceBalance={vSliceBalance} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>
    <div className='table'>
    <table>
        <tr>
          <th>Fight</th>
          <th>Users Slice from flips</th>
          <th>Charity Slice from flips</th>
          <th>Users Slice from spots</th>
        </tr>
      {detail && detail.map((fight, index) => (
      <tr key={index}>
      <td className='fight-link'> <Link href="/fights/[address]" as={`/fights/${fight.contract}`}>{`Fight `+fight.contract.substring(0,6)+`...`+fight.contract.substring(38,42)}</Link>
      </td>
      <td>{fight.usersSlice} %</td>
      <td>{fight.charitySlice} %</td>
      <td>{fight.uscs} %</td>
      </tr>
          )).sort((a,b) => b.index > a.index ? 1 : -1)}    
          </table>
    </div>          
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
