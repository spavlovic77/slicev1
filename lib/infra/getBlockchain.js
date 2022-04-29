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
                            '0x29d7FBDe25fE415A88754dfA6406F6BC5aEFC9E6');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x645569A2ea1F8318Ed98562734080f4712d41f85');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==56){ //bnb 
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x1811064E60D2eF0309cbBFa0Ca6199aad436393F');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0xc8112384615155515e8d6e25a01A52020D40b883');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else if (networkId==43114){ //AVA
                        const web3 = new Web3(provider);
                        const fightFactory = new web3.eth.Contract(
                            polygonFightFactory.abi,
                            '0x9F36B68450E13f42CcDe4aE1b25cC694a288f72D');
                        const slice = new web3.eth.Contract (
                            polygonSlice.abi,
                            '0x5ce7de86720021B424F2e40C2869423E97e492F9');
                            resolve ({accounts, fightFactory, slice, web3, networkId});
                    }
                    else {
                        alert('Select supported network in Metamask: AVAX, Polygon or BSC')
                        return;  }
        } else 
            reject ('You need to install Metamask Wallet from https://metamask.io') ;
    });
    
export default getBlockchain