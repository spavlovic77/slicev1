import Web3Container from '../../../lib/infra/Web3Containter'
import Navbar from '../../../lib/components/Navbar'
import { useRouter } from 'next/router'
import polygonFight from '../../../lib/contracts/Fight.json'
import { useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'
import Spots from '../../../lib/components/Spots'
import Content from '../../../lib/components/Content'
import Spinner from 'react-bootstrap/Spinner'
import { Loading } from 'web3uikit';




const Fight = ({ fightFactory, accounts, slice, web3, networkId }) => {
    const router = useRouter()
    const {address} = router.query
    const [fightData, setFightData] = useState(undefined)
    const [spots, setSpots] = useState(undefined)
    const [addr, setAddress]= useState(undefined)
    const [loading, setLoading] = useState(false)
    const [fightContract, setFightContract] = useState(undefined)
    const [spotResPrice, setSpotResPrice] = useState(undefined)
    const [charityBalance, setCharityBalance] = useState(undefined)
    const [stakedInFight, setStaked] = useState(undefined)
    const [staked, setStakedBalance] = useState(undefined)
    const [vSliceBalance, setVSliceBalance] = useState(undefined)
    const [pendingWithdrawal, SetPendingWithdrawal] = useState(undefined)
    const [votes1, setVotes1] = useState(undefined)
    const [votes2, setVotes2] = useState(undefined)
    const [lsb, setLastSpotPot] = useState(0)
    const [timer, setTimer] = useState(undefined)
    const [startTime, setStartTime] = useState(undefined)
    const [freshData, setFreshData] = useState(true)
    const [charity, setCharity] = useState(undefined)
    const [shortUrl, setShortUrl] = useState()
    const [whitel, setIsWL] = useState()
    const [isReg, setIsRegistered] = useState()
    const [minter, setMinter] = useState()
    const [mintingSpeed, setMintingSpeed] = useState()
    const [start, setStart] = useState()
  

    useEffect(() => {
      const init = async () => {
          const fight = new web3.eth.Contract (polygonFight.abi,address)
          setFightContract(fight)
      };
      init();
    }, []);
    
    useEffect(() => {
      if(fightContract==undefined)return;
      else {
        const init = async () => {
          try { 
            const getVotes2 = await fightContract.methods.getVotes().call({ from: accounts[0] })
            .then(data => {
              setVotes2(data[1])
            })
            const getVotes1 = await fightContract.methods.getVotes().call({ from: accounts[0] })
            .then(data => {
              setVotes1(data[0])
            })
              const fightData = await fightContract.methods.getFightData().call({ from: accounts[0] })
              .then(data => {
                setFightData(data)
              })
              const spotResPrice = await fightContract.methods.getFightParams2().call({ from: accounts[0] })
              .then(data => {
                setSpotResPrice(data[4])
              })
              const short = await fightContract.methods.getFightData().call({ from: accounts[0] })
              .then(data => {
                setShortUrl(data[9])
              })
              const charityBalance = await fightContract.methods.showBalance().call({ from: accounts[0] })
              .then(data => {
                setCharityBalance(data[1])
              })
              const vSliceBalance = await fightContract.methods.viewVSliceBalance().call({ from: accounts[0] })
              .then(data => {
                setVSliceBalance(data)
              })              
              const pendingW = await fightContract.methods.showBalance().call({ from: accounts[0] })
              .then(data => {
                SetPendingWithdrawal(data[0])
              })
              const lsb = await fightContract.methods.showBalance().call({ from: accounts[0] })
              .then(data => {
                setLastSpotPot(data[2])
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
              const staked = await slice.methods.getStakedBalance().call({ from: accounts[0] })
              .then(data => {
                setStakedBalance(data)
              })
              const spots = await fightContract.methods.getSpots().call({ from: accounts[0] })
              .then(data => {
                setSpots(data)
              })
              const timer = await fightContract.methods.getFightParams().call({ from: accounts[0] })
              .then(data => {
                setTimer(data[10])
              })
              const startTime = await fightContract.methods.getFightParams().call({ from: accounts[0] })
              .then(data => {
                setStartTime(data[11])
              })
              const charity_addr = await fightContract.methods.getFightParams2().call({ from: accounts[0] })
              .then(data => {
                setCharity(data[3])
              })
              const stakedInFight = await fightContract.methods.getFightParams2().call({ from: accounts[0] })
              .then(data => {
                setStaked(data[0])
                setAddress(address)
                setLoading(true)
              })
          } catch(e) {
            alert(e);
          }};
        init();
      }}, [fightContract, freshData]);

      const [showSpinnerVote1, setShowSpinnerVote1]= useState(false)
      const handleVote1 = async() => {
        setShowSpinnerVote1(true)
        await fightContract.methods.voting1_E7O(accounts[0]).send({ from: accounts[0], value: ''})
        .then(console.log('ide'))
        setFreshData(!freshData)
        setShowSpinnerVote1(false)
      }
      const [showSpinnerVote2, setShowSpinnerVote2]= useState(false)
      const handleVote2 = async() => {
        setShowSpinnerVote2(true)
        await fightContract.methods.voting2_eoL(accounts[0]).send({ from: accounts[0], value: ''})
        .then(console.log('ide'))
        setFreshData(!freshData)
        setShowSpinnerVote2(false)
      }
      const [showSpinnerWith, setShowSpinnerWith] = useState(false)
      const handleOnWithdraw = async() => {
        setShowSpinnerWith(true)
        await fightContract.methods.makeWithdrawal().send({ from: accounts[0], value: ''})
        .then(console.log('ide'))
        setFreshData(!freshData)
        setShowSpinnerWith(false)
      }
      const [showSpinnerPot, setShowSpinnerPot] = useState(false)
      const handlePotWithraw = async() => {
        setShowSpinnerPot(true)
        await fightContract.methods.makeWithdrawalLSP().send({ from: accounts[0], value: ''})
        .then(console.log('ide'))
        setFreshData(!freshData)
        setShowSpinnerPot(false)
      }
      const [buyModalShow, setBuyModalShow] = useState(true)
      const [showSpinnerBuy, setShowSpinnerBuy] = useState(false)
      const handleBuySpot = async(text, link, pic) => {
        if (text==undefined || link==undefined) {
          alert('Looks like you did not fill some value(s). Please check formular.')
          return;
        }
        else {
      setShowSpinnerBuy(true)
      await fightContract.methods.createSpot_g4A(text, link, pic).send({ from: accounts[0], value: fightData[1]})
      .on('receipt', receipt => {
        console.log('spot bought')
      })
      setFreshData(!freshData)
      setShowSpinnerBuy(false)
      setBuyModalShow(false)
        }
      }
    const [showSpinnerReserve, setShowSpinnerReserve] = useState(false)
    const handleSpotReservation = async(spot) => {
      const spotIndex = spot-1;
      setShowSpinnerReserve(true)
      await fightContract.methods.spotReserve_u5k(spotIndex).send({ from: accounts[0], value: spotResPrice})
      .then(console.log('ide'))
      setFreshData(!freshData)
      setShowSpinnerReserve(false)
    }
    const [showFlipModal, setShowFlipModal] = useState(true)
    const [showSpinnerFlip, setShowSpinnerFlip] = useState(false)
    const handleSpotFlip = async(text,link, pic, spot, price) => {
      if (text==undefined || link==undefined) {
        alert('Looks like you did not fill some value(s). Please check formular.')
        return;
      }
      else {
      console.log(text, link, pic, spot, price)
      const spotIndex = spot-1;
      setShowSpinnerFlip(true)
      await fightContract.methods.flip_Maf(spotIndex, text, link, pic).send({ from: accounts[0], value: price})
      .then(console.log('ide'))
      setFreshData(!freshData)
      setShowSpinnerFlip(false)
      setShowFlipModal(false)
    }
  }
    const [showSpinnerReset, setShowSpinnerReset] = useState(false)
    const handleSpotReset = async(spot) => {
      const spotIndex = spot-1;
      setShowSpinnerReset(true)
      await fightContract.methods.resetspot(spotIndex).send({ from: accounts[0]})
      .then(console.log('ide'))
      setFreshData(!freshData)
      setShowSpinnerReset(false)
    }
    const [showSpinnerStake, setShowSpinnerStake] = useState(false)
    const handleStaking = async(amount) => {
      setShowSpinnerStake(true)
      await fightContract.methods.stakeingVSlice_C64(amount).send({ from: accounts[0]})
      .then(setStaked(stakedInFight)
      )
      setFreshData(!freshData)
      setShowSpinnerStake(false)
      
    }
    const [showSpinnerUnstake, setShowSpinnerUnstake] = useState(false)
    const handleUnStaking = async(amount) => {
      setShowSpinnerUnstake(true)
      await fightContract.methods.unstakeingVSlice_EK(amount).send({ from: accounts[0]})
      .then(setVSliceBalance(vSliceBalance)
      )
      setFreshData(!freshData)
      setShowSpinnerUnstake(false)
    }
    const [showSpinnerMinter, setShowSpinnerMinter] = useState(false)
    const handleMint = async () => {
      setShowSpinnerMinter(true)
      await slice.methods.vSliceMinting_ExW().send({ from: accounts[0] })
      .on('receipt', receipt => {
        setFreshData(!freshData)
        setShowSpinnerMinter(false)
      })
      };


  return (
    <>
      {(!loading && !timer && !startTime) &&<div
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
      {(loading && timer && startTime)  && <Navbar whitel={whitel} isReg={isReg} minter={minter} mintingSpeed={mintingSpeed} start={start} showSpinnerMinter = {showSpinnerMinter} staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} fightFactory={fightFactory} address={address} accounts={accounts} slice={slice} web3={web3} networkId={networkId}/>}
      {(loading && timer && startTime)  && <Content whitel={whitel} isReg={isReg} showSpinnerPot={showSpinnerPot} showSpinnerWith={showSpinnerWith} shortUrl={shortUrl} showSpinnerVote1={showSpinnerVote1} showSpinnerVote2={showSpinnerVote2} showSpinnerStake={showSpinnerStake} showSpinnerUnstake={showSpinnerUnstake} charity={charity} startTime={startTime} timer={timer} lsb={lsb} votes1={votes1} votes2={votes2} onVote1={handleVote1} onVote2={handleVote2} accounts={accounts} web3={web3} address ={address} onWithdraw={handleOnWithdraw} onPotWithdraw={handlePotWithraw} onStaking={handleStaking} onUnStaking={handleUnStaking} fightData={fightData} pendingWithdrawal={pendingWithdrawal} staked={stakedInFight} vSliceBalance={vSliceBalance} charityBalance={charityBalance}/>}
      {(loading && timer && startTime)  && <Spots showFlipModal={showFlipModal} buyModalShow={buyModalShow} showSpinnerReset={showSpinnerReset} showSpinnerReserve={showSpinnerReserve} showSpinnerBuy={showSpinnerBuy} showSpinnerFlip={showSpinnerFlip} accounts={accounts} onBuySpot={handleBuySpot} onSpotReservation={handleSpotReservation} onSpotFlip={handleSpotFlip} onSpotReset={handleSpotReset} fightData={fightData} spots={spots} address={addr}/>}
    </>
  )
}
const index = () => (
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
    render={({ accounts, slice, fightFactory, web3, networkId }) => (
      <Fight accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default index

