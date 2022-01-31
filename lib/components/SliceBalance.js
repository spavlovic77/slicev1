import Web3 from 'web3'
import Badge from 'react-bootstrap/Badge'
import {Tag} from 'web3uikit'

const SliceBalance = ({ vSliceBalance, staked}) => {
    return (
        <>
        <div className='numbers'>
            <Tag
            active
            text={Math.floor(Web3.utils.fromWei(((vSliceBalance).toString()), 'ether'))}
            theme="status"
            />
            <Tag
            text={Math.floor(Web3.utils.fromWei(((staked).toString()), 'ether'))}
            theme="status"
            />
        </div>
        </>
    )
}

export default SliceBalance
