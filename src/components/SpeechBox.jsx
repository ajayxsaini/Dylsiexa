import React, { useState } from 'react'

const SpeechBox = () => {

  const[active, setActive] = useState(true)

  const text = "Hi, now this is how we do it and if the text will increase then what will happen.ddddd ddddddddd dddd dddddd dddd ddd ddd ddd ddd ddd dddd ddddd dddddd ddddd dddd dddd ddd ddd ddd ddd dd ddd dddddd";

  // Split the text into words
  const words = text.split(" ");

  return (
    <div className="flex flex-col items-center justify-center w-screen bg-amber-50 h-[50vh]">
      <div className="bg-blue-900 w-2xl p-4 wrap-break-word">
        <div className="flex flex-wrap gap-2">
          {words.map((word, index) => (
            <span key={index} className="text-white word">
              {word}
            </span>
          ))}
        </div>
      </div>
      <div className='flex gap-5 mt-2'>
        <div onClick={() => setActive(!active)} className={`rounded-full text-white  ${active ? "bg-green-600 hover:bg-green-700" 
                 : "bg-red-600 hover:bg-red-700"}`}>
          <button className=' p-4 '>
            {active ? "Speak" : "Stop"}
          </button>
        </div>
        <div className='bg-purple-400 rounded-full text-white'>
          <button className='p-4'>
            Next 
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechBox;
