import React from 'react'
import Link from 'next/link'

const index = () => {
  return (
    <>
    <section className='welcome'>
    <Link href='/slice'><a><img src='/slice.png'></img></a></Link>
    </section>
    
    </>
  )
}

export default index
