import { useState, useEffect } from 'react';
import getBlockchain from '../infra/getBlockchain'
import Spinner from 'react-bootstrap/Spinner'
import detectProvider from '@metamask/detect-provider';
import { useRouter } from 'next/router'



export default function Web3Containter(props) {
    const [loading, setLoading] = useState(true);
    const [fightFactory, setFightFactory] = useState(undefined);
    const [slice, setSlice] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined)
    const [web3, setWeb3] = useState(undefined)
    const [networkId, setNetworkId] = useState(undefined)
    const [accChanged, setAccountChanged] = useState(undefined)
    const [netChanged, setNetChanged] = useState(undefined)
    const router = useRouter();

    useEffect(() => {
      const changeAccount =async() => {
          const provider = await detectProvider();
          if (provider===window.ethereum) {
                ethereum.on('accountsChanged', handleAccountsChanged);
                function handleAccountsChanged(accounts) {
                  if (accounts.length === 0) {
                    // MetaMask is locked or the user has not connected any accounts
                    alert ('Your Metamask seams to be Locked')
                  } else {
                  window.location.reload()}
                }
                window.ethereum.on('chainChanged', (chainId) => router.push('/slice'));
                  setAccountChanged(accounts)
                  setNetChanged(networkId)
              }
            }
        changeAccount()
    }, [])

    useEffect(() => {
        const coreWeb3 = async () => {
          try { 
            const { accounts, fightFactory, slice, web3, networkId} = await getBlockchain();
            setFightFactory(fightFactory);
            setSlice(slice);
            setAccounts(accounts);
            setWeb3(web3)
            setNetworkId(networkId)
            setLoading(false);
          } catch(e) {
            alert(e);
          }
        };
        coreWeb3();
      }, [accChanged, netChanged]);
    return loading
    ? props.renderLoading()
    : props.render ({ accounts, fightFactory, slice, networkId, web3 })
};

