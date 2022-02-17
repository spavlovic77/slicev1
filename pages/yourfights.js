import Web3Container from '../lib/infra/Web3Containter'
import Alert from 'react-bootstrap/Alert'
import Navbar from '../lib/components/Navbar'
import Footer from '../lib/components/Footer'
import AdminFights from '../lib/components/AdminFights'
import StakedFights from '../lib/components/StakedFights'
import useSWR from "swr";
import polygonFight from '../lib/contracts/Fight.json'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const fetcherStakedByStaker = async(slice, accounts) =>{
  const req =  await slice.methods.getStakedByStaker(accounts[0]).call({ from: accounts[0] }).then((data) => {return data})
  const res =  await req
  return res
}

const details =  async(web3, accounts, all) =>  {
  const listN =[]
  for (let i=0; i<all.length; i++) {
   const fight = await new web3.eth.Contract(polygonFight.abi,all[i].fightContract)
   const adminFights =  await fight.methods.getFightParams2().call({ from: accounts[0] }).then(data => {
      listN.push({contract: all[i].fightContract, Staked: data[0]})
     })
  }
  return listN
}

const Yourfights = ({ accounts, slice, fightFactory, web3, networkId }) => {

  const { data: all, errorAll } = useSWR([slice, accounts, 'allStaked'], fetcherStakedByStaker)
  const { data: detail, errorDetail } = useSWR(all ? [web3, accounts, all] : null, details)

  const router = useRouter();
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

    const handleUnStaking = async(amount, address) => {
      const fight = new web3.eth.Contract (polygonFight.abi,address)
      await fight.methods.unstakeingVSlice_EK(amount).send({ from: accounts[0]})
      .then(setVSliceBalance(vSliceBalance)
      )
      router.reload();
    }

  return (
    <>
     {loadingMintData && <Navbar showSpinnerMinter={showSpinnerMinter} onMint={handleMint} staked={staked} vSliceBalance={vSliceBalance} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>}
    <div >
      {!all && 'Loading...'}
      {!detail && 'Loading...'}
      {errorAll && 'Error during loading list of fights...'}
      {errorDetail && 'Error during loading details...'}
      {detail && <StakedFights  onUnstake={handleUnStaking} web3={web3} stakedFights={detail.filter(f => f.Staked>0)} slice={slice} accounts={accounts}/>}
    </div>
    </>
  )
}

const list = () => (

  <Web3Container
    renderLoading={() => <div><Alert variant='warning'>Loading Dapp Page...Check your Metamask please</Alert></div>}
    render={({ accounts, slice, fightFactory, web3, networkId}) => (
      <Yourfights accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default list