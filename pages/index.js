import React from 'react'
import Link from 'next/link'
import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react'


const index = () => {

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
          <section className='welcome'>
            <Link href='/slice'><a><img src='/slice.png'></img></a></Link>
          </section>
          <section>
              {metamask               
              ? <button className='btn-start-app'><Link href='/slice'><a>Launch app</a></Link></button> 
              : <button className='btn-start-app'><a target="_blank" href='https://metamask.io/' rel="noreferrer">Install MetaMask</a></button>}
          </section>
    </div> 
    </>
  )
}

export default index
