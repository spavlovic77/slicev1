import detectProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import polygonFightFactory from '../contracts/fightFactory.json';
import polygonSlice from '../contracts/slice.json';



const getBlockchain = () => 
    new Promise ( async (resolve, reject) =>{
        const provider = await detectProvider();
        if (provider==window.ethereum) { 
        
         const accounts = await provider.request({method: 'eth_requestAccounts'});
         const networkId = await provider.request({method: 'net_version'});
        if(networkId==5777) {                       
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
                '0x71c52343b14Bf94a3B7E02f1CE1f7bb56bD8Aef7');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x43E76Be6881662Fb33D27d62Cb8ceA1f5AD0b510');
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==43113){ //AVA
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0xFD129b64a98B9A1d34AEFD713A56a3CAA512B6df');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x52916fc85c96a12173400c8ADCb401542752AB40');
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else {
            alert('Select supported network in Metamask: Ethereum, AVAX, Polygon or BSC')
            return;  }
        
        
        return;
        }
            reject ('Install Metamask') ;
    });
    
export default getBlockchain