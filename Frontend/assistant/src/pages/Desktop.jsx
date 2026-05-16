import React from 'react'
import purplebg from '../assets/purplebg.png'
const Desktop = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-cover bg-center p-8 text-center" style={{ backgroundImage: `url(${purplebg})` }}>
        <div className="bg-transparent backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
          <h1 className="text-white text-2xl font-bold">This project is only available in desktop</h1>
          <p className="text-gray-200 text-sm leading-relaxed">  For the best experience, <span className="text-cyan-400 font-semibold">Smart College AI Assistant</span> is designed and optimized for desktop devices.
</p>
          <div className="px-6 py-3 border border-cyan-100 rounded-full text-cyan-200 text-sm font-medium">Please open on a larger screen</div>
        </div>
      </div>

  )
}

export default Desktop
