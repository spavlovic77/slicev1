import Web3Container from '../lib/infra/Web3Containter'
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from 'react'
import useSWR from "swr";
import AdminFightsNew from '../lib/components/AdminFightsNew'
import Navbar from '../lib/components/Navbar'
import Spinner from 'react-bootstrap/Spinner'

const fetcherFightsByAdmin = async(fightFactory, accounts) => {
  const fightsByAdmin = await fightFactory.methods.getFightsByAdmin(accounts[0]).call({ from: accounts[0] }).then((data) => {return data})
  return fightsByAdmin
}

const YourNewFights = ({ fightFactory, web3, accounts, slice, networkId }) => {

const { data: fights, errorfights } = useSWR([fightFactory, accounts, 'fightsByAdmin'], fetcherFightsByAdmin)


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
  

      return (
        <>
        
         {loadingMintData && <Navbar showSpinnerMinter={showSpinnerMinter} staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>}
         {!fights && <div className='fight-spinner'><Spinner animation="grow" /> Loading new fights from blockchain....</div>}
        {fights && <AdminFightsNew newFights={fights.filter(f => f.active===false)} fightFactory={fightFactory} web3={web3} accounts={accounts}/>}
        
        </>
        
        
        )
        }

const list = () => (

  <Web3Container
    renderLoading={() => <div className='fight-spinner'><Spinner animation="grow" /> Connecting to blockchains....</div>}
    render={({ accounts, slice, fightFactory, web3, networkId}) => (
      <YourNewFights accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default list