import Button from 'react-bootstrap/Button'
import Web3 from 'web3';
import Dropdown from 'react-bootstrap/Dropdown'
import { useState, useEffect } from 'react'
import { BigNumber } from "bignumber.js";
import polygonFight from '../contracts/Fight.json'
import useSWR from "swr";
import { Icon} from 'web3uikit';
import Modal from 'react-bootstrap/Modal'

const Header = ({  charity, lsb, accounts, web3, pendingWithdrawal, onWithdraw,onPotWithdraw, onStaking, onUnStaking, vSliceBalance, charityBalance, address, staked }) => {
    const [bignum25, setBignum25] = useState(undefined)
    const [bignum50, setBignum50] = useState(undefined)
    const [bignum75, setBignum75] = useState(undefined)
    const [bignum100, setBignum100] = useState(undefined)
    const [bignum25Stake, setBignum25Stake] = useState(undefined)
    const [bignum50Stake, setBignum50Stake] = useState(undefined)
    const [bignum75Stake, setBignum75Stake] = useState(undefined)
    const [bignum100Stake, setBignum100Stake] = useState(undefined)
    const [loading, setLoading] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    useEffect(() => {
        const init = async () => {
            const y = new BigNumber(staked)

            const number25 =y.times(25).dividedBy(100)
            const number25BN = number25.toFixed(0)
            const bigNumber25 = Web3.utils.toBN(number25BN).toString()

            const number50 =y.times(50).dividedBy(100)
            const number50BN = number50.toFixed(0)
            const bigNumber50 = Web3.utils.toBN(number50BN).toString()

            const number75 =y.times(75).dividedBy(100)
            const number75BN = number75.toFixed(0)
            const bigNumber75 = Web3.utils.toBN(number75BN).toString()

            const number100 =y.times(100).dividedBy(100)
            const number100BN = number100.toFixed(0)
            const bigNumber100 = Web3.utils.toBN(number100BN).toString()

            const x = new BigNumber(vSliceBalance);
            
            const number25Stake =x.times(25).dividedBy(100)
            const number25StakeBN = number25Stake.toFixed(0)
            const bigNumber25Stake = Web3.utils.toBN(number25StakeBN).toString()

            const number50Stake =x.times(50).dividedBy(100)
            const number50StakeBN = number50Stake.toFixed(0)
            const bigNumber50Stake = Web3.utils.toBN(number50StakeBN).toString()
            
            const number75Stake =x.times(75).dividedBy(100)
            const number75StakeBN = number75Stake.toFixed(0)
            const bigNumber75Stake = Web3.utils.toBN(number75StakeBN).toString()


            const number100Stake =x.times(100).dividedBy(100)
            const number100StakeBN = number100Stake.toFixed(0)
            const bigNumber100Stake = Web3.utils.toBN(number100StakeBN).toString()

            setBignum25(bigNumber25)
            setBignum50(bigNumber50)
            setBignum75(bigNumber75)
            setBignum100(bigNumber100)
            setBignum25Stake(bigNumber25Stake)
            setBignum50Stake(bigNumber50Stake)
            setBignum75Stake(bigNumber75Stake)
            setBignum100Stake(bigNumber100Stake)
            setLoading(true)
        };
        init();
      }, [staked, vSliceBalance]);

// Fetching  last spot pot owner
const fetchLastSpotPotOwner = (web3, accounts) => (...args) => {
    const [arg1] = args
    const address = arg1   
    const fight = new web3.eth.Contract(polygonFight.abi, address)
    const lso =  fight.methods.showLastSpotPot().call({ from: accounts[0] }).then((data) => {return data[1]})
    return lso
}
const { data: lso, error6 } = useSWR([address, 'lastSpotPotOwner'], {fetcher: fetchLastSpotPotOwner(web3,accounts)})

    const [days, setDays] = useState()
    const [hours, setHours] = useState();
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();
    const [dist, setDist] = useState()


    return (
        <> 
        
            
                <section className='header'>
                    <ul className='charity'>
                        <li>
                            Charity {Web3.utils.fromWei(charityBalance, 'ether')} 
                            
                        </li>
                        <li>
                        <Icon fill="grey" size={18} style={{}} svg="user"/> {charity.substring(0,6)}...{charity.substring(38,42)}
                            
                        </li>
                    </ul>
                    <ul className='pot'>
                        <li>
                            {(lso && lsb) && <div>Winner's Pot  {Web3.utils.fromWei(lsb, 'ether')}</div> }
                                
                        </li>
                        <li>
                            {(lso && lsb) && <div><Icon fill="grey" size={18} style={{}} svg="user"/> {lso.substring(0,6)}...{lso.substring(38,42)}</div> }
                        </li>
                    </ul>
                    <ul className='stake'>
                        <li>
                            You Staked {Math.floor(Web3.utils.fromWei(staked, 'ether'))} SLICE
                        </li>
                        <ul className='dropdown'>
                            <li className='left-dropdown'> 
                                    <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                                Stake
                                                {loading &&  <Dropdown.Menu><Dropdown.Item onClick={()=> onStaking(bignum100Stake)}>100%</Dropdown.Item><Dropdown.Item onClick={()=> onStaking(bignum75Stake)}>75%</Dropdown.Item><Dropdown.Item onClick={()=> onStaking(bignum50Stake)}>50%</Dropdown.Item><Dropdown.Item onClick={()=> onStaking(bignum25Stake)}>25%</Dropdown.Item></Dropdown.Menu>}
                                            </Dropdown.Toggle>
                                    </Dropdown>
                            </li>
                            <li className='right-dropdown'>
                                    <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                                Unstake
                                                {loading &&  <Dropdown.Menu><Dropdown.Item onClick={()=> onUnStaking(bignum100)}>100%</Dropdown.Item><Dropdown.Item onClick={()=> onUnStaking(bignum75)}>75%</Dropdown.Item><Dropdown.Item onClick={()=> onUnStaking(bignum50)}>50%</Dropdown.Item><Dropdown.Item onClick={()=> onUnStaking(bignum25)}>25%</Dropdown.Item></Dropdown.Menu>}
                                            </Dropdown.Toggle>
                                    </Dropdown> 
                            </li>
                        </ul>
                    </ul>
                    <ul className='earn'>
                        <li>
                            You Earned {Web3.utils.fromWei(pendingWithdrawal, 'ether')}
                        </li> 
                        <li className='wallet'>
                            <button className= 'btn-promo' onClick={handleShow}> <Icon    fill="grey"    size={32}    svg="credit card"  /></button> 
                        </li> 
                    </ul>

                </section>  

                <Modal show={show} onHide={handleClose} backdrop="static">
                    <Modal.Header closeButton>
                    <Modal.Title>Withdraw</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Button variant="outline-secondary" onClick={onWithdraw}>Withdraw</Button>  
                    <Button variant="outline-secondary" onClick={onWithdraw}>Charity</Button>
                    <Button variant="outline-secondary" onClick={onPotWithdraw}>Pot</Button> 
                            

                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>


        </>
    )
}

export default Header
