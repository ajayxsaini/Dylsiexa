import React, { useState, useEffect, useRef } from "react";

const SpeechBox = () => {
  const [active, setActive] = useState(false); // Speak button shows first
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordStatus, setWordStatus] = useState([]); // pending, correct, wrong, skipped

  const recognitionRef = useRef(null);
  const currentIndexRef = useRef(0);
  const wordsRef = useRef([]); // ✅ Added ref for fast access

  // -----------------------------
  // FETCH PARAGRAPH (40+ words)
  // -----------------------------
  const fetchParagraph = async () => {
    try {
      let valid = false;
      let splitWords = [];

      while (!valid) {
        const id = Math.floor(Math.random() * 30) + 1;
        const res = await fetch(`https://dummyjson.com/posts/${id}`);
        const data = await res.json();

        splitWords = data.body
          .replace(/\n/g, " ")
          .trim()
          .split(/\s+/);

        if (splitWords.length >= 40) valid = true;
      }

      setWords(splitWords);
      wordsRef.current = splitWords; // ✅ sync ref
      setWordStatus(Array(splitWords.length).fill("pending"));
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      setActive(false); // Do not auto-start
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchParagraph();
  }, []);

  // -----------------------------
  // SPEECH RECOGNITION SETUP (FAST)
  // -----------------------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser!");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const spoken = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      const index = currentIndexRef.current;
      const target = wordsRef.current[index]?.toLowerCase();

      setWordStatus((prev) => {
        const updated = [...prev];
        updated[index] = spoken === target ? "correct" : "wrong";
        return updated;
      });

      const nextIndex = index + 1;
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;

      // Mark skipped if not spoken after 1.2s
      setTimeout(() => {
        setWordStatus((prev) => {
          const updated = [...prev];
          if (updated[nextIndex] === "pending") updated[nextIndex] = "skipped";
          return updated;
        });
      }, 1200);
    };
  }, []);

  // Start or stop listening
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (!active) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  }, [active]);

  // -----------------------------
  // UI Rendering
  // -----------------------------
  return (
    <div className="flex flex-col items-center justify-center w-screen bg-amber-50 h-[80vh]">
      
      {/* Paragraph */}
      <div className="bg-white max-w-2xl w-full p-4 wrap-break-word">
        {words.length === 0 ? (
          <p className="text-black">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {words.map((word, index) => (
              <span
                key={index}
                className={
                  wordStatus[index] === "correct"
                    ? "text-green-400"
                    : wordStatus[index] === "wrong"
                    ? "text-red-400"
                    : wordStatus[index] === "skipped"
                    ? "text-purple-400"
                    : "text-black"
                }
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-5 mt-4">
        
        {/* Speak / Stop */}
        <button
          onClick={() => setActive(!active)}
          className={`rounded-full text-white px-6 py-4 cursor-pointer transition
            ${active ? "bg-red-600 hover:bg-red-700"
                     : "bg-green-600 hover:bg-green-700"}`}
        >
          {active ? "Stop" : "Speak"}
        </button>

        {/* Reset Paragraph */}
        <button
          onClick={fetchParagraph}
          className="bg-purple-500 hover:bg-purple-600 rounded-full text-white px-6 py-4 cursor-pointer transition"
        >
          Reset
        </button>

        {/* Next (does nothing for now) */}
        <button className="bg-yellow-500 hover:bg-yellow-700 rounded-full text-white px-6 py-4 cursor-pointer">
          Next
        </button>

      </div>
    </div>
  );
};

export default SpeechBox;
