import { Icon } from 'web3uikit'  ;

const Footer = () => {
    return (
        <>
        <ul className='social'>
            <li>
            <a target="_blank" href='https://t.me/SliceDotHelp' rel="noopener noreferrer"><Icon fill="grey" size={28} svg="telegram"/></a>
        </li>
        <li>
        <a target="_blank" href='https://twitter.com/slicedothelp' rel="noopener noreferrer"><Icon fill="grey" size={28} svg="twitter"/></a>
        </li>
        <li>
        <a target="_blank" href='https://app.gitbook.com/' rel="noopener noreferrer"><Icon fill="grey" size={28} svg="book"/></a>
        </li>
      </ul>
      </>
    )
}

export default Footer
