import React from 'react'

const Footer = () => {
  return (
    <div className='fixed bottom-0 left-0 w-full py-2 text-white/60 bg-transparent border-t border-white/10 overflow-hidden'>
      <marquee behavior="scroll" direction="right" scrollamount="5">
        <h1 className='text-[10px] px-8 lg:text-[13px]'> CopyRight © 2026 <span className='font-bold '> SDITS CSE Department </span>* Developed by <span className='font-bold text-[13px] text-cyan-400'>Usha Patel,Rajni Verma and Priti Patel.</span>  * Batch 2022-2026</h1>
      </marquee>
    </div>
  )
}

export default Footer
