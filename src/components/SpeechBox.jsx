import React, { useState, useEffect } from "react";

const SpeechBox = () => {
  const [active, setActive] = useState(true);
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchParagraph = async () => {
      try {
        const id = Math.floor(Math.random() * 30) + 1;
        const res = await fetch(`https://dummyjson.com/posts/${id}`);
        const data = await res.json();

        const splitWords = data.body
          .replace(/\n/g, " ")
          .trim()
          .split(/\s+/);

        setWords(splitWords);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchParagraph(); // ✅ CALL THE FUNCTION
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-screen bg-amber-50 h-[80vh]">
      <div className="bg-white max-w-2xl w-full p-4 wrap-break-word">
        {words.length === 0 ? (
          <p className="text-black">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {words.map((word, index) => (
              <span key={index} className="text-black">
                {word}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-5 mt-4">
        <button
          onClick={() => setActive(!active)}
          className={`rounded-full text-white px-6 py-4 cursor-pointer transition
            ${active ? "bg-green-600 hover:bg-green-700"
                     : "bg-red-600 hover:bg-red-700"}`}
        >
          {active ? "Speak" : "Stop"}
        </button>

        <button className="bg-purple-500 hover:bg-purple-600 rounded-full text-white px-6 py-4 cursor-pointer transition">
          Next
        </button>
      </div>
    </div>
  );
};

export default SpeechBox;
