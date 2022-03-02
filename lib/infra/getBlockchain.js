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
                    if (networkId==5777) {                       
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            polygonFightFactory.networks[networkId].address);
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            polygonSlice.networks[networkId].address);
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==80001){ //polygon testnet mumbai
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0xEF8E7a73ae667C499896b68fA2819766ee91208d');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0xF8dB5Ceae1DfaA77d8ba9F9bf0c21365562294d0');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==97){ //bnb testnet
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0xD3140824A99dBA9d94D98c862C77b7374A233919');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0xeFc7C3497E5d76FAFEEdc36266694767DC72BC2A');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==43113){ //AVA
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0xd48B3c2F18508df57EDD061223AF06B67DECD2aA');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x64bd9b4C8231AaeadFBBD90424ae0A20CbA1cD85');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else {
                        alert('Select supported network in Metamask: Ethereum, AVAX, Polygon or BSC')
                        return;  }
        } else 
            reject ('You need to install Metamask Wallet from https://metamask.io') ;
    });
    
export default getBlockchain