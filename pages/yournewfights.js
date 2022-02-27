import Web3Container from '../lib/infra/Web3Containter'
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from 'react'
import useSWR from "swr";
import AdminFightsNew from '../lib/components/AdminFightsNew'
import Navbar from '../lib/components/Navbar'
import Spinner from 'react-bootstrap/Spinner'
import { Loading } from 'web3uikit';

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
  

      return (
        <>
        {(!fights && !loadingMintData) && <div
          style={{
            backgroundColor: '#ECECFE',
            borderRadius: '8px',
            padding: '20px'
          }}
        >
          <Loading
            size={40}
            spinnerColor="#2E7DAF"
            text="Loading data from blockchains... "
          />
        </div>}
        {(fights && loadingMintData) && <Navbar whitel={whitel} isReg={isReg} minter={minter} mintingSpeed={mintingSpeed} start={start} showSpinnerMinter={showSpinnerMinter} staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>}
        {(fights && loadingMintData) && <AdminFightsNew newFights={fights.filter(f => f.active===false)} fightFactory={fightFactory} web3={web3} accounts={accounts}/>}
        </>
        )
        }

const list = () => (

  <Web3Container
    renderLoading={() => <div
      style={{
        backgroundColor: '#ECECFE',
        borderRadius: '8px',
        padding: '20px'
      }}
    >
      <Loading
        size={40}
        spinnerColor="#2E7DAF"
        text="Connecting to Blockchains... "
      />
    </div>}
    render={({ accounts, slice, fightFactory, web3, networkId}) => (
      <YourNewFights accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default list