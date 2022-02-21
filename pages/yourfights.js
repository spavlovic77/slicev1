import Web3Container from '../lib/infra/Web3Containter'
import Alert from 'react-bootstrap/Alert'
import Navbar from '../lib/components/Navbar'
import StakedFights from '../lib/components/StakedFights'
import useSWR from "swr";
import polygonFight from '../lib/contracts/Fight.json'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from 'react-bootstrap/Spinner'

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
  const [whitel, setIsWL] = useState()
  const [isReg, setIsRegistered] = useState()
  const [minter, setMinter] = useState()
  const [mintingSpeed, setMintingSpeed] = useState()
  const [start, setStart] = useState()

  useEffect(() => {
    const init = async () => {
      try { 
          const vSliceBalance = await slice.methods.vSliceViewBalance(accounts[0]).call({ from: accounts[0] })
          .then(data => {
            setVSliceBalance(data)
          })
          const wlist = await slice.methods.wl(accounts[0]).call({ from: accounts[0] })
          .then(data => {
            setIsWL(data)
          })
          const reg = await slice.methods.isRegistered(accounts[0]).call({ from: accounts[0] })
          .then(data => {
            setIsRegistered(data)
          })
          const Minter = await slice.methods.getMinter(accounts[0]).call({ from: accounts[0] })
          .then(data => {
            setMinter(data)
          })
          const MintSpeed = await slice.methods.getMintingSpeed().call({ from: accounts[0] })
          .then(data => {
            setMintingSpeed(data)
          })
          const start = await slice.methods.getStart().call({ from: accounts[0] })
          .then(data => {
            setStart(data)
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
      setFreshMintData(!freshMintData)
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
     {loadingMintData && <Navbar whitel={whitel} isReg={isReg} minter={minter} mintingSpeed={mintingSpeed} start={start} showSpinnerMinter={showSpinnerMinter} onMint={handleMint} staked={staked} vSliceBalance={vSliceBalance} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>}
    <div >
    {!detail && <div className='fight-spinner'><Spinner animation="grow" /> Loading fights from blockchain....</div>}
      {detail && <StakedFights  onUnstake={handleUnStaking} web3={web3} stakedFights={detail.filter(f => f.Staked>0)} slice={slice} accounts={accounts}/>}
    </div>
    </>
  )
}

const list = () => (

  <Web3Container
    renderLoading={() => <div className='fight-spinner'><Spinner animation="grow" /> Connecting to blockchains....</div>}
    render={({ accounts, slice, fightFactory, web3, networkId}) => (
      <Yourfights accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default list