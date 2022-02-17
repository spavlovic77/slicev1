import Web3 from 'web3'
import Badge from 'react-bootstrap/Badge'
import {Tag} from 'web3uikit'

const SliceBalance = ({ vSliceBalance, staked}) => {
    return (
        <>
        <div className='numbers'>
            <ul className='numbers-flex'>
            <li>
                <Tag
                text={Math.floor(Web3.utils.fromWei(((vSliceBalance).toString()), 'ether'))}
                color="green"
                /> 
            </li>
            <li>
                <Tag
                text={Math.floor(Web3.utils.fromWei(((staked).toString()), 'ether'))}
                color="grey"
                />
            </li>
            </ul>
        </div>
        </>
    )
}

export default SliceBalance
