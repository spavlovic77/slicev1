const getMoralis = async () => {
    const Moralis = require('moralis');
    Moralis.initialize("vdLadSr4mmwOnnTcTHxpDZmchA5f5aUyy1gwH5TJ");
    Moralis.serverURL = 'https://ptfs9sdkf6xx.usemoralis.com:2053/server'
    const res = await Moralis.Cloud.run("fight", {})
    const data = await res
    console.log('raw data', data)
    return data
  }

export default getMoralis


//polygon test net
//Moralis.initialize("vdLadSr4mmwOnnTcTHxpDZmchA5f5aUyy1gwH5TJ");
//Moralis.serverURL = 'https://ptfs9sdkf6xx.usemoralis.com:2053/server'

// bnb test net 
//Moralis.initialize("zWnbf9AsqMrLyNfGWXroqmr4iervs86pocETkZoO");
//Moralis.serverURL = 'https://qsv9laydcwom.usemoralis.com:2053/server'

// ganache
// Moralis.initialize("Rev6dHfpcPd95MuA3P2s1n2veMyklRBm5xFKD37N");
// Moralis.serverURL = 'https://c37ykqrq9se3.moralis.io:2053/server'