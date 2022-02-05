import React from 'react'
import Link from 'next/link'

const index = () => {
  return (
    <>
    <div className='index-container'>
          <section className='welcome'>
            <Link href='/slice'><a><img src='/slice.png'></img></a></Link>
          </section>
          <section>
              <button className='btn-start-app'><Link href='/slice'><a>Launch app</a></Link></button>
          </section>
    </div>
    </>
  )
}

export default index
