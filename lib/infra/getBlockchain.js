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
                '0x91a6BCab58F50d368a24a2c746156c0bb2F95f71');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x446fA26fe329F217f319f8777bDC4bc668138139');
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==97){ //bnb testnet
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0x8DaF53fD478fc574316b5a128AAe9781da58b3f7');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0xdA9f1462738CC0119Fb6B30a2f14567Bf6876B32');
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==43113){ //AVA
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0x40a65091DE3f796E4E90dB119DF18806076C752D');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0xBAB80E8ecB8b4AF906a5A5e31f25e5f9c49BfE3A');
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