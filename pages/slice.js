import Web3Container from '../lib/infra/Web3Containter'
import Navbar from '../lib/components/Navbar'
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from 'react'
import useSWR from "swr";
import polygonFight from '../lib/contracts/Fight.json'
import { Table, TabList, Tab, Icon, Button } from 'web3uikit';
import Web3 from 'web3';
import Link from 'next/link'
import { BigNumber } from "bignumber.js";

         

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
      <Navbar onMint={handleMint} showSpinnerMinter={showSpinnerMinter} staked={staked} vSliceBalance={vSliceBalance} accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>
        <div className='tabs-wrapper'>
        
        {!lastSpotBalance && <div className='fight-spinner'><Spinner animation="grow" /> Loading fights from blockchain....</div>}
        {!detail && <div className='fight-spinner'><Spinner animation="grow" /> Loading fight from blockchain....</div>}
          <TabList
                defaultActiveKey={1}
                tabStyle="bulbUnion"
              >
                <Tab
                  tabKey={1}
                  tabName="Highest Pot"
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
                <Tab
                  tabKey={2}
                  tabName="Highest User Rewards"
                >
                  <div>
                  {detail &&<Table
                columnsConfig="50px 1fr 1fr 50px"
                data={dataFeed2}
                header={[
                  <span key={203}></span>,
                  <span key={201}>Fight</span>,
                  <span key={202}>Rewards from created spots</span>,
                  <span key={204}></span>
                ]}
                maxPages={3}
                onPageNumberChanged={function noRefCheck(){}}
                pageSize={5}
              />}
                  </div>
                </Tab>
                <Tab
                  tabKey={3}
                  tabName="Highest Charity Rewards"
                >
                  <div>
                    Comming soon  
                  </div>
                </Tab>
              </TabList>
  </div>
</>
  )
}


const sli = () => (
  <Web3Container
    renderLoading={() => <div><Alert variant='warning'>Loading Dapp Page...Check your Metamask please</Alert></div>}
    render={({ accounts, slice, fightFactory, web3, networkId }) => (
      <Slice accounts={accounts} slice={slice} fightFactory={fightFactory} web3={web3} networkId={networkId}/>
    )}
  />
)
export default sli
