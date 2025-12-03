import React, { useState, useEffect, useRef } from "react";

const SpeechBox = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listening, setListening] = useState(false); 
  const [spokenWord, setSpokenWord] = useState("");

  const recognitionRef = useRef(null);

  // ----------------------------------------------------
  // FETCH PARAGRAPH
  // ----------------------------------------------------
  const fetchParagraph = async () => {
    try {
      let valid = false;
      let splitWords = [];

      while (!valid) {
        const id = Math.floor(Math.random() * 30) + 1;
        const res = await fetch(`https://dummyjson.com/posts/${id}`);
        const data = await res.json();

        if (!data.body || typeof data.body !== "string") continue;

        splitWords = data.body.replace(/\n/g, " ").trim().split(/\s+/);

        if (splitWords.length >= 40) valid = true;
      }

      setWords(splitWords);
      setCurrentIndex(0);
      setSpokenWord("");
      setListening(false);

    } catch (err) {
      console.error("Error fetching paragraph:", err);
    }
  };

  useEffect(() => {
    fetchParagraph();
  }, []);

  // ----------------------------------------------------
  // SPEECH RECOGNITION (FAST)
  // ----------------------------------------------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true; 
    recognition.interimResults = true; 

    recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript;
      const last = text.trim().toLowerCase().split(" ").pop();
      setSpokenWord(last);
    };

    recognitionRef.current = recognition;

    if (listening) {
      try { recognition.start(); } catch {}
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [listening]);

  // ----------------------------------------------------
  // COLOR LOGIC
  // ----------------------------------------------------
  const getColor = (i) => {
    if (i !== currentIndex) return "black";

    const expected = words[currentIndex]?.toLowerCase();

    if (!spokenWord) return "black";

    return spokenWord === expected ? "green" : "red";
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="flex flex-col items-center justify-center w-screen bg-amber-50 h-[80vh]">

      {/* Paragraph */}
      <div className="bg-white max-w-2xl w-full p-4 wrap-break-word rounded">
        {words.length === 0 ? (
          <p className="text-black">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-2 text-xl">
            {words.map((word, index) => (
              <span key={index} style={{ color: getColor(index) }}>
                {word}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-5 mt-4">

        {/* SINGLE TOGGLE BUTTON */}
        <button
          onClick={() => setListening((prev) => !prev)}
          className={`rounded-full text-white px-6 py-4 cursor-pointer transition
            ${listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          {listening ? "Stop" : "Speak"}
        </button>

        {/* NEXT */}
        <button
          onClick={() => {
            setCurrentIndex((i) => i + 1);
            setSpokenWord("");
          }}
          className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white px-6 py-4"
        >
          Next
        </button>

        {/* RESET */}
        <button
          onClick={fetchParagraph}
          className="bg-purple-500 hover:bg-purple-600 rounded-full text-white px-6 py-4"
        >
          Reset
        </button>

      </div>

    </div>
  );
};

export default SpeechBox;
