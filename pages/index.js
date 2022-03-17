import React from 'react'
import Link from 'next/link'
import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'



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
          <section className='welcome'>
            <Link href='/slice'><a><img src='/slice.png'></img></a></Link>
          </section>
          <section>
              {metamask               
              ? <Link href='/slice'><button className='btn-start-app'>Launch app</button></Link>
              : <button className='btn-start-app'><a target="_blank" href='https://metamask.io/' rel="noreferrer">Install MetaMask</a></button>}
          </section>
    </div> 
          <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>What is Slice.help</Accordion.Header>
                <Accordion.Body>
                     Slice.help is a &quot;Possitive Sum Game&quot;, meaning: everybody wins. It is a unique tool for Influencers to gain more Followers. 
                     It allows Users to get passive income. It provides a space created by Influencers for you to present your content. And a lot more...
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>I am an Influencer. How can I create a space for others to present themselves?</Accordion.Header>
                <Accordion.Body>
                Create a friendly fight with another influencer so that you create a space for others to present their content.
                Users use this space to buy Spots in order to present themselves. What is the catch? Other Users can Flip these
                Spots with their content. The previous owner earns back 100% and in addition 30%
                from the increased price of the Spot as a profit. The rest is distributed to the platform participants.
                </Accordion.Body>
                </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>94% of proceeds go to Protocol Users, 6% to developers</Accordion.Header>
                <Accordion.Body>
               Slice.help is open-source protocol, meaning anybody can use it and develop Web application using the protocol smart contracts.
               The Devs get 5% from every created Spot. 1% goes to the Platform Dev. 100% of the platform is on-chain.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>What is the &quot;End game&quot; mission for this protocol</Accordion.Header>
                <Accordion.Body>
                 Each hour, one SLICE is created for everybody. No matter how late you are, you get the same amount of SLICE as everybody else. 
                 Fake accounts? Lets explore the protocol and you will learn how the protocol deals with it. The &quot;End Game&quot; is the most fair distribution
                 of SLICE tokens for everybody. The users, the community itself will make sure that fake accounts are continuously eliminated. 
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
    </>
  )
}

export default Index
