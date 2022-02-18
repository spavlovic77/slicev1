import { useState, useEffect } from 'react';
import getBlockchain from '../infra/getBlockchain'
import Spinner from 'react-bootstrap/Spinner'



export default function Web3Containter(props) {
    const [loading, setLoading] = useState(true);
    const [fightFactory, setFightFactory] = useState(undefined);
    const [slice, setSlice] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined)
    const [web3, setWeb3] = useState(undefined)
    const [networkId, setNetworkId] = useState(undefined)
    const [accChanged, setAccountChanged] = useState(undefined)
    const [netChanged, setNetChanged] = useState(undefined)

useEffect(() => {
let provider = window.ethereum;
if (typeof provider !== 'undefined') {
  window.ethereum.on('accountsChanged', (accounts) => window.location.reload());
  window.ethereum.on('chainChanged', (chainId) => window.location.reload());
    setAccountChanged(accounts)
    setNetChanged(networkId)
  }
}, [])

    useEffect(() => {
        const init = async () => {
          try { 
            const { accounts, fightFactory, slice, web3, networkId} = await getBlockchain();
            setFightFactory(fightFactory);
            setSlice(slice);
            setAccounts(accounts);
            setWeb3(web3)
            setNetworkId(networkId)
            setLoading(false);
          } catch(e) {
            setLoadingMessage(e);
          }
        };
        init();
      }, [accChanged, netChanged]);
      //console.log({slice, fightFactory, accounts, web3, networkId})
    return loading
    ? props.renderLoading()
    : props.render ({ accounts, fightFactory, slice, networkId, web3 })
};
