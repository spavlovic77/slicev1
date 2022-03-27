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
                    else if (networkId==1){ //ethereum 
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x95192219230CE045073Cb21d4546C207744809fF');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x96a930C0252772756A45647f9d83d33E0A8a9cb6');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                     else if (networkId==137){ //polygon 
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x38ED85d4D7341AD1247A3c0A0ba86516Eb7E8bB7');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x34EBBd6BfF2225fE40D7600287C3d31F0A5EDb2a');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==56){ //bnb 
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x1533736052F3132c7cdBf97cf3c241B3897d61C4');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x27623a235429978FB9B81feB7FB723a8F96a0CC6');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==43114){ //AVA
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x7aa0026C67F1f910cca429a13595c3fD818607d8');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x1b5eC4c0A44bB7975ee020A652148dE71d2bcb50');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else {
                        alert('Select supported network in Metamask: AVAX, Polygon or BSC')
                        return;  }
        } else 
            reject ('You need to install Metamask Wallet from https://metamask.io') ;
    });
    
export default getBlockchain