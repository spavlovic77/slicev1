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
                '0x624247Db6593794371B50CE9717224faa63Ad3E4');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x48A5485a14365f2d76914bF9deFa65A3379c80d9');
                //console.log('getBlockchain', web3, fightFactory, slice, networkId, accounts)
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==97){ //bnb testnet
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0xC640bF09641Ad0A2F487f7E2a273F619A407f27D');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0xf53565D12de708303fdF717485E3B29E449D2EB4');
                //console.log('getBlockchain', web3, fightFactory, slice, networkId, accounts)
                resolve ({accounts, fightFactory, slice, web3, networkId});
        }
        else if (networkId==43113){ //AVA
            const web3 = new Web3(provider);
            const fightFactory = new web3.eth.Contract(
                polygonFightFactory.abi,
                '0x6F8f662d65B06512C86880A669e492cbDBD0Ff66');
            const slice = new web3.eth.Contract (
                polygonSlice.abi,
                '0x435AB84196B1A90d9D584Dd82e44c4bbF3857f89');
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