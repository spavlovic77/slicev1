import detectProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import polygonFightFactory from '../contracts/fightFactory.json';
import polygonSlice from '../contracts/slice.json';



const getBlockchain = () => 
    new Promise ( async (resolve, reject) =>{
        const provider = await detectProvider();
        if (provider) {
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
                //console.log('getBlockchain', web3, fightFactory, slice, networkId, accounts)
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==80001){ //polygon testnet mumbai
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0x27b1ceDec5Cb1c63CbF54B0D9Fd48a538cd68304');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x6746b201Eb442234e91a7ABF2b3933a215f9dB7c');
                //console.log('getBlockchain', web3, fightFactory, slice, networkId, accounts)
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==97){ //bnb testnet
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0xb3914196BFfC64d76f03861668dE74A446f9137b');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x8f2B66C25e4c270F6ad040249A01552C8Da401DE');
                //console.log('getBlockchain', web3, fightFactory, slice, networkId, accounts)
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==43113){ //AVA
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0x882C52A415A8aDb7c86214bABd685F7Bb0f36746');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0xd23c7347BDa81E3408C151E424aC609a8e4A3C11');
                //console.log('getBlockchain', web3, fightFactory, slice, networkId, accounts)
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else {
            alert('Select supported network in Metamask')
            return;  }
        
        
        return;
        }
            reject ('Install Metamask') ;
    });
    
export default getBlockchain