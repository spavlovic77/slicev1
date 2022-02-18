import Button from 'react-bootstrap/Button'
import Web3 from 'web3';
import Dropdown from 'react-bootstrap/Dropdown'
import { useState, useEffect } from 'react'
import { BigNumber } from "bignumber.js";
import polygonFight from '../contracts/Fight.json'
import useSWR from "swr";
import { Icon} from 'web3uikit';
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

const Header = ({  showSpinnerPot, showSpinnerWith, showSpinnerStake, showSpinnerUnstake, charity, lsb, accounts, web3, pendingWithdrawal, onWithdraw,onPotWithdraw, onStaking, onUnStaking, vSliceBalance, charityBalance, address, staked }) => {
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
    const lso =  fight.methods.showBalance().call({ from: accounts[0] }).then((data) => {return data[3]})
    return lso
}
const { data: lso, error6 } = useSWR([address, 'lastSpotPotOwner'], {fetcher: fetchLastSpotPotOwner(web3,accounts)})

const [charityBalanceFormated, setCharityPrecision] = useState()
const [lsBalanceFormated, setLsBalanceFormated] = useState()
const [pendingWithFormated, setPendingWithFormated] = useState()

useEffect(() => {
    const charity = new BigNumber(Web3.utils.fromWei(charityBalance, 'ether'))
    const lsBalance= new BigNumber(Web3.utils.fromWei(lsb, 'ether'))
    const pendingWith = new BigNumber(Web3.utils.fromWei(pendingWithdrawal, 'ether'))
    const charityPrecision = charity.toFixed(5)
    const lsBalancePrecision = lsBalance.toFixed(5)
    const pendingWithPrecision = pendingWith.toFixed(5)
    
    setCharityPrecision(charityPrecision)
    setLsBalanceFormated(lsBalancePrecision)
    setPendingWithFormated(pendingWithPrecision)


}, [charityBalance, lsb, pendingWithdrawal])

console.log({vSliceBalance})
    return (
        <> 
        
            
                <section className='header'>
                    <ul className='charity'>
                        <li>
                            Charity {charityBalanceFormated}
                            
                        </li>
                        <li>
                        <Icon fill="grey" size={18} style={{}} svg="user"/> {charity.substring(0,6)}...{charity.substring(38,42)}
                            
                        </li>
                    </ul>
                    <ul className='pot'>
                        <li>
                            {(lso && lsb) && <div>Winners Pot  {lsBalanceFormated}</div> }
                                
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
                                        {!showSpinnerStake &&
                                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                                Stake
                                                {loading &&  <Dropdown.Menu><Dropdown.Item onClick={()=> onStaking(bignum100Stake)}>100%</Dropdown.Item><Dropdown.Item onClick={()=> onStaking(bignum75Stake)}>75%</Dropdown.Item><Dropdown.Item onClick={()=> onStaking(bignum50Stake)}>50%</Dropdown.Item><Dropdown.Item onClick={()=> onStaking(bignum25Stake)}>25%</Dropdown.Item></Dropdown.Menu>}
                                            </Dropdown.Toggle>}
                                        {showSpinnerStake && <Button  variant="secondary" disabled>
                                                                <Spinner
                                                                as="span"
                                                                animation="grow"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                />
                                                            </Button>}
                                    </Dropdown>
                            </li>
                            <li className='right-dropdown'>
                                    <Dropdown>
                                        {!showSpinnerUnstake && 
                                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                                Unstake
                                                {loading &&  <Dropdown.Menu><Dropdown.Item onClick={()=> onUnStaking(bignum100)}>100%</Dropdown.Item><Dropdown.Item onClick={()=> onUnStaking(bignum75)}>75%</Dropdown.Item><Dropdown.Item onClick={()=> onUnStaking(bignum50)}>50%</Dropdown.Item><Dropdown.Item onClick={()=> onUnStaking(bignum25)}>25%</Dropdown.Item></Dropdown.Menu>}
                                            </Dropdown.Toggle>}
                                            {showSpinnerUnstake && <Button variant="secondary" disabled>
                                                                <Spinner
                                                                as="span"
                                                                animation="grow"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                />
                                                            </Button>}
                                    </Dropdown> 
                            </li>
                        </ul>
                    </ul>
                    <ul className='earn'>
                        <li>
                            You Earned {pendingWithFormated}
                        </li> 
                        <li className='wallet'>
                            <button className= 'btn-promo' onClick={handleShow}> <Icon    fill="grey"    size={32}    svg="creditCard"  /></button> 
                        </li> 
                    </ul>

                </section>  

                <Modal show={show} onHide={handleClose} backdrop="static">
                    <Modal.Header closeButton>
                    <Modal.Title>Withdraw</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {!showSpinnerPot && <Button variant="outline-secondary" onClick={onPotWithdraw}>Withdraw Last Spot Pot</Button>}
                            {showSpinnerPot && <Button  variant="secondary" disabled>
                                                                <Spinner
                                                                as="span"
                                                                animation="grow"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                />
                                                            </Button>}  {'  '} 
                            {!showSpinnerWith && <Button variant="outline-secondary" onClick={onWithdraw}>Withdraw</Button>}
                            {showSpinnerWith && <Button  variant="secondary" disabled>
                                                                <Spinner
                                                                as="span"
                                                                animation="grow"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                />
                                                            </Button>} 
                                           
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
