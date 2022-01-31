import Web3Container from '../../../lib/infra/Web3Containter'
import Navbar from '../../../lib/components/Navbar'
import { useRouter } from 'next/router'
import polygonFight from '../../../lib/contracts/Fight.json'
import { useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'
import Spots from '../../../lib/components/Spots'
import Content from '../../../lib/components/Content'




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
    const [lsb, setLastSpotPot] = useState(undefined)
    const [timer, setTimer] = useState(undefined)
    const [startTime, setStartTime] = useState(undefined)
    const [freshData, setFreshData] = useState(true)
    const [charity, setCharity] = useState(undefined)
  
  

    useEffect(() => {
      const init = async () => {
        if (networkId==5777 || 8001 || 97) {
          const fight = new web3.eth.Contract (polygonFight.abi,address)
          
          setFightContract(fight)
        }else {alert('Not Supported network')}
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
              const spotResPrice = await fightContract.methods.getFightData().call({ from: accounts[0] })
              .then(data => {
                setSpotResPrice(data[10])
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
              const lsb = await fightContract.methods.showLastSpotPot().call({ from: accounts[0] })
              .then(data => {
                setLastSpotPot(data[0])
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
              const charity_addr = await fightContract.methods.staked().call({ from: accounts[0] })
              .then(data => {
                setCharity(data[3])
              })
              const stakedInFight = await fightContract.methods.staked().call({ from: accounts[0] })
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


      const handleVote1 = async() => {
        await fightContract.methods.voting1_E7O(accounts[0]).send({ from: accounts[0], value: ''})
        .then(console.log('ide'))
        setFreshData(!freshData)
      }
      const handleVote2 = async() => {
        await fightContract.methods.voting2_eoL(accounts[0]).send({ from: accounts[0], value: ''})
        .then(console.log('ide'))
        setFreshData(!freshData)
      }
      const handleOnWithdraw = async() => {
        await fightContract.methods.makeWithdrawal().send({ from: accounts[0], value: ''})
        .then(console.log('ide'))
        setFreshData(!freshData)
      }
      const handlePotWithraw = async() => {
        await fightContract.methods.makeWithdrawalLSP().send({ from: accounts[0], value: ''})
        .then(console.log('ide'))
        setFreshData(!freshData)
      }
      const handleBuySpot = async(text, link, pic) => {
        if (text==undefined || link==undefined) {
          alert('Looks like you did not fill some value(s). Please check formular.')
          return;
        }
        else {
      await fightContract.methods.createSpot_g4A(text, link, pic).send({ from: accounts[0], value: fightData[1]})
      .then(console.log('ide'))
      setFreshData(!freshData)
      window.location.reload();
        }
      }
    const handleSpotReservation = async(spot) => {
      const spotIndex = spot-1;
      await fightContract.methods.spotReserve_u5k(spotIndex).send({ from: accounts[0], value: spotResPrice})
      .then(console.log('ide'))
      setFreshData(!freshData)
    }
    const handleSpotFlip = async(text,link, pic, spot, price) => {
      console.log(text, link, pic, spot, price)
      const spotIndex = spot-1;
      await fightContract.methods.flip_Maf(spotIndex, text, link, pic).send({ from: accounts[0], value: price})
      .then(console.log('ide'))
      setFreshData(!freshData)
      window.location.reload();
    }
    const handleSpotReset = async(spot) => {
      const spotIndex = spot-1;
      await fightContract.methods.resetspot(spotIndex).send({ from: accounts[0]})
      .then(console.log('ide'))
      setFreshData(!freshData)
    }
    const handleStaking = async(amount) => {
      await fightContract.methods.stakeingVSlice_C64(amount).send({ from: accounts[0]})
      .then(setStaked(stakedInFight)
      )
      setFreshData(!freshData)
      
    }
    const handleUnStaking = async(amount) => {
      await fightContract.methods.unstakeingVSlice_EK(amount).send({ from: accounts[0]})
      .then(setVSliceBalance(vSliceBalance)
      )
      setFreshData(!freshData)
    }

    const handleMint = async () => {
      await slice.methods.vSliceMinting_ExW().send({ from: accounts[0] })
      .on('receipt', receipt => {
        setFreshData(!freshData)
      })
      };

  return (
    <>

      {loading  && <Navbar staked={staked} vSliceBalance={vSliceBalance} onMint={handleMint} fightFactory={fightFactory} address={address} accounts={accounts} slice={slice} web3={web3} networkId={networkId}/>}
      {loading  && <Content charity={charity} startTime={startTime} timer={timer} lsb={lsb} votes1={votes1} votes2={votes2} onVote1={handleVote1} onVote2={handleVote2} accounts={accounts} web3={web3} address ={address} onWithdraw={handleOnWithdraw} onPotWithdraw={handlePotWithraw} onStaking={handleStaking} onUnStaking={handleUnStaking} fightData={fightData} pendingWithdrawal={pendingWithdrawal} staked={stakedInFight} vSliceBalance={vSliceBalance} charityBalance={charityBalance}/>}
      {loading  && <Spots accounts={accounts} onBuySpot={handleBuySpot} onSpotReservation={handleSpotReservation} onSpotFlip={handleSpotFlip} onSpotReset={handleSpotReset} fightData={fightData} spots={spots} address={addr}/>}
    </>
  )
}
const index = () => (
  <Web3Container
    renderLoading={() => <div><Alert variant='warning'>Loading Dapp Page...</Alert></div>}
    render={({ accounts, slice, fightFactory, web3, networkId }) => (
      <Fight accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId} />
    )}
  />
)
export default index

