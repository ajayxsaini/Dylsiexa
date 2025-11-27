import React from 'react'

const SpeechBox = () => {
  return (
    <div className='flex flex-column items-center justify-center w-screen bg-amber-50 h-[20vh] '>
      <div className='bg-white cursor-alias'>
        <input type="text"/>
        <label htmlFor=""></label>
      </div>
      <div>
        <div>
          <button>Generate</button>
        </div>
      </div>
    </div>
    
  )
}

export default SpeechBox