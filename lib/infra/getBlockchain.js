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
                            '0x07365Cb891344BCeF38f27FfE12336E770cE1d6C');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x942ca76EcB48cdb7c88b945d471C0AEfb4783334');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==56){ //bnb 
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x359d61e2721B44912D6198EC4d3A5E0874CB1b0c');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0xDD63e8D2c833A7BC1ff311432E3cF0F42Db0b9c1');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==43114){ //AVA
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x5A69b29522bbC7Dd098190FCF14E28C99eA82Add');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0xd40cDB30f80bbab997c023AB2657d313c57805c9');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else {
                        alert('Select supported network in Metamask: Ethereum, AVAX, Polygon or BSC')
                        return;  }
        } else 
            reject ('You need to install Metamask Wallet from https://metamask.io') ;
    });
    
export default getBlockchain