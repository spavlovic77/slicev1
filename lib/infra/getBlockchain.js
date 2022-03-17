import detectProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import polygonFightFactory from '../contracts/fightFactory.json';
import polygonSlice from '../contracts/slice.json';

const getBlockchain = () => 
    new Promise ( async (resolve, reject) =>{
        const provider = await detectProvider();
        if (provider===window.ethereum) { 
         const accounts = await provider.request({method: 'eth_requestAccounts'});
         const networkId = await provider.request({method: 'net_version'});
                     if (networkId==137){ //polygon testnet mumbai
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x95192219230CE045073Cb21d4546C207744809fF');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x96a930C0252772756A45647f9d83d33E0A8a9cb6');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==56){ //bnb testnet
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x2320fB2596d66707ed37990ee06421Ac35817327');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x30ebD6940222F3f196aA9F7a881caFaBCD75Dd3F');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==43114){ //AVA
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0xAd3d045b6fEB4Cd24893a50bd5DDc550760a1B71');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x3f92FC7844147d4bA4Bfc3599AA4eaCCaceA9E94');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else {
                        alert('Select supported network in Metamask: Ethereum, AVAX, Polygon or BSC')
                        return;  }
        } else 
            reject ('You need to install Metamask Wallet from https://metamask.io') ;
    });
    
export default getBlockchain