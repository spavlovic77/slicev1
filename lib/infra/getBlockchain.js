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
                '0xAfB76820adF4B95A741BFBa89a8260bb4bf11f47');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x9AE73EcCbDEC127d980e2aabCcA833036d820B12');
                //console.log('getBlockchain', web3, fightFactory, slice, networkId, accounts)
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==97){ //bnb testnet
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0x2f193434c4A4Cf12c40435601FEf6eA517525Bbd');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x20a4C6966CA9a03cc8A27DD28e4F91eA46a6d34A');
                //console.log('getBlockchain', web3, fightFactory, slice, networkId, accounts)
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==43113){ //AVA
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0xD1765B2F870b7ACaD04F46C55916a634fa1DbC7D');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0xb26E73967C1e5AE1e6E35Be8BbA8E2f56197AAa4');
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