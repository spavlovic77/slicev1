import React from 'react'
import Link from 'next/link'
import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react'
import { Stepper } from 'web3uikit';


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
              ? <button className='btn-start-app'><Link href='/slice'><a>Launch app</a></Link></button> 
              : <button className='btn-start-app'><a target="_blank" href='https://metamask.io/' rel="noreferrer">Install MetaMask</a></button>}
          </section>

          <div
                style={{
                  height: '1px',
                  minHeight: '450px'
                }}
              >
                <Stepper
                  completeTitle="Enjoy it                         "
                  completeMessage=""
                  onComplete={() => window.location.reload()}
                  step={1}
                  stepData={[
                    {
                      content: <p>Create a friendly fight with another influencer so that your followers can earn proceeds from platform<br />
                      <strong>How?</strong><br/> 
                      Users use your popularity and buy Spots under your content in order to present <strong>their content.</strong><br />
                      <strong>What's the catch?</strong><br />
                      Other users can Flip these Spots with their content. The previous owner earns back <strong>100% </strong> and <strong>in addition 30%</strong><br/>
                      from <strong>the increased price</strong> of the spot as <strong>a profit</strong>. The rest is distributed to the platform participants.</p>,
                      title: 'Partner with other Influencer and create a friendly fight '
                    },
                    {
                      content: <p><ul><li>Set the prices of Spots and Flips</li><li> Set the duration of the game</li><li>
                      Link your content (YouTube, Facebook, Twitch, SoundCloud, Streamable, <br />Vimeo, Wistia, Mixcloud, DailyMotion and Kaltura)</li></ul></p>,
                      title: 'Set it up'
                    },
                    {
                      content: <p>Call on your followers to participate by sending generated <strong>Bitly short link</strong><br />
                      They can earn proceeds in the following ways:<br />        
                      1. Buying a Spot and be Flipped later for <strong>profit</strong> (be aware of risk of not being flipped!)<br />        
                      2. The owner of the last bought Spot wins the <strong>Last Spot Pot</strong><br />        
                      3. <strong>Passive income</strong> from staking <strong>freely</strong> minted SLICE tokens</p>,
                      title: 'Share it'
                    },
                    {
                      content: <p><strong>Influencers</strong><br />
                      Allow others to earn money = more followers = more popularity<br />
                      <strong>Advertisers</strong><br />
                      Free advertisement Spots when flipped + <strong>profit</strong><br />
                      The owner of the last bought Spot <strong>wins the Pot</strong><br />
                      <strong>Users</strong><br />
                      Passive income from the platform<br />
                      <strong>Charity</strong><br />
                      Funds raised<br />
                      <strong>Developers</strong><br />
                      Slice.help is open source protocol. Anybody can build on top of it.<br />
                      Developers earn 5% from all bought Spots<br />
                      </p>,
                      title: 'Who benefits from this platform?'
                    }
                  ]}
                />
      </div>

    </div> 
    </>
  )
}

export default Index
