import Web3Container from '../lib/infra/Web3Containter'
import Navbar from '../lib/components/Navbar'
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from 'react'
import useSWR from "swr";
import polygonFight from '../lib/contracts/Fight.json'
import { Table, TabList, Tab, Loading } from 'web3uikit';
import Web3 from 'web3';
import Link from 'next/link'
import Spinner from 'react-bootstrap/Spinner'
import Footer from '../lib/components/Footer';

         

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
   const adminFights =  await fight.methods.getFightParams2().call({ from: accounts[0] }).then(data => {
    listN.push({contract: all[i].fightContract, created: data[2], uscs: Number(data[5]), charity: data[6], usersSlice: data[7], actTimer: data[8]})
  })
}
  return listN
  }

  const lsp =  async(web3, accounts, all) =>  {
    const listN =[]
    for (let i=0; i<all.length; i++) {
     const fight = await new web3.eth.Contract(polygonFight.abi,all[i].fightContract)
     const adminFights =  await fight.methods.showBalance().call({ from: accounts[0] }).then(data => {
      listN.push({contract: all[i].fightContract, lspBalance: Number(Web3.utils.fromWei(data[2])), created: data[4], actTimer: data[5]})
    })
    }
    return listN
    }

const { data: all, error } = useSWR([fightFactory, accounts, 'all1'], allFights)
const { data: detail } = useSWR(all ? [web3, accounts, all, 'detailsOfFights'] : null, fetcherFightDetails)
const { data: lastSpotBalance } = useSWR(all ? [web3, accounts, all, 'lastSpotBalance'] : null, lsp)

if (lastSpotBalance!=undefined) {
  const dataFeed = lastSpotBalance
  .filter(a => a.lspBalance!='0')
  .sort((a,b) => b.lspBalance > a.lspBalance ? 1 : -1)
  .map((item) => [<span key={0}></span>, <Link key={1} href="/fights/[address]" as={`/fights/${item.contract}`}><a>{item.contract.substring(0,6)+'...'+item.contract.substring(38,42)}</a></Link>, <span key={2}>{item.lspBalance}</span>, <span key={3}></span>])
  
}
if (detail!=undefined) {
  const dataFeed2 = detail
  .filter(a => a.actTimer!='0')
  .sort((a,b) => b.uscs > a.uscs ? 1 : -1)
  .map((item) => [<span key={0}></span>, <Link key={10}href="/fights/[address]" as={`/fights/${item.contract}`}><a>{item.contract.substring(0,6)+'...'+item.contract.substring(38,42)}</a></Link>, <span key={20}>{item.uscs +' %'}</span>, <span key={30}></span>])

}

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
    {(!lastSpotBalance || !detail || !loadingMintData) && <div
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
      {(lastSpotBalance && detail && loadingMintData) && <Navbar whitel={whitel} isReg={isReg} minter={minter} mintingSpeed={mintingSpeed} start={start} onMint={handleMint} showSpinnerMinter={showSpinnerMinter} staked={staked} vSliceBalance={vSliceBalance} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>}
       <div className='tabs-wrapper'>
        {(lastSpotBalance && detail && loadingMintData) && <TabList
                defaultActiveKey={1}
                tabStyle="bulbUnion"
              >
                <Tab
                      tabKey={1}
                      tabName="Top Rewards"
                    >
                      <div>
                      {detail &&<Table
                    columnsConfig="50px 1fr 1fr 50px"
                    data={dataFeed2}
                    header={[
                      <span key={203}></span>,
                      <span key={201}>Fight</span>,
                      <span key={202}>Users share</span>,
                      <span key={204}></span>
                    ]}
                    maxPages={3}
                    onPageNumberChanged={function noRefCheck(){}}
                    pageSize={5}
                  />}
                      </div>
                </Tab>
                <Tab
                  tabKey={2}
                  tabName="Top Pots"
                >
                  <div>
                  {lastSpotBalance &&<Table
                columnsConfig="50px 1fr 1fr 50px"
                data={dataFeed}
                header={[
                  <span key={103}></span>,
                  <span key={101}>Fight</span>,
                  <span key={102}>Pot balance</span>,
                  <span key={104}></span>
                ]}
                maxPages={3}
                onPageNumberChanged={function noRefCheck(){}}
                pageSize={5}
              />}
                  </div>
                </Tab>
              </TabList>}
              {(lastSpotBalance && detail && loadingMintData) && <Footer />}
  </div>
  
</>
  )
}


const sli = () => (
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
      <Slice accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>
    )}
  />
)
export default sli
