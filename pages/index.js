import React from 'react'
import Link from 'next/link'
import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Footer from '../lib/components/Footer';
import { CryptoLogos } from 'web3uikit';



const Index = () => {

  const [metamask, setMetamask] = useState()
    useEffect(() => {
      const isMetaMaskInstalled = async() => {
        const provider = await detectEthereumProvider();
        if (provider) {setMetamask(true)} else {setMetamask(false)}
      };
      isMetaMaskInstalled();
    }, [])

  return (
    <>
    <div className='index-container'>
      <ul className='social'>
      <li><CryptoLogos  chain="avalanche"  onClick={function noRefCheck(){}}  size="48px"/></li>
      <li><CryptoLogos  chain="polygon"  onClick={function noRefCheck(){}}  size="48px"/></li>
      <li><CryptoLogos  chain="binance"  onClick={function noRefCheck(){}}  size="48px"/></li>
      </ul>
          <section className='welcome'>
            <Link href='/slice'><a><img src='/slice.png'></img></a></Link>
          </section>
          <section>
              {metamask               
              ? <Link href='/slice'><button className='btn-start-app'>Launch app</button></Link>
              : <button className='btn-start-app'><a target="_blank" href='https://metamask.io/' rel="noreferrer">Install MetaMask</a></button>}
          </section>
    </div> 
            <Footer />
    </>
  )
}

export default Index
