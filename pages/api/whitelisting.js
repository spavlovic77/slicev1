import Web3 from 'web3';

export default async (req, res) => {
    const message = Web3.utils.soliditySha3(req.body.address).toString('hex');
    const web3 = new Web3('');
    const { signature } = web3.eth.accounts.sign(
      message, 
      process.env.SIGNER
      );
    res
      .status(200)
      .json({signature});
      console.log(signature)
    return;
}