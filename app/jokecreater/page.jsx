"use client";
import { useState, useEffect } from "react";

const JokeCreater = () => {
    const [setup, setSetup] = useState("");
    const [punchline, setPunchline] = useState("");

    const fetchJoke = async () => {
        try {
            const res = await fetch("https://official-joke-api.appspot.com/random_joke");
            const data = await res.json();
            setSetup(data.setup);
            setPunchline(data.punchline);
        } catch {
            console.error("Error fetching the joke");
        }
    };

    useEffect(() => {
        fetchJoke();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-amber-300 shadow-xl rounded-lg p-6 md:p-8 border border-gray-200 text-center">
                <h3 className="font-semibold text-lg mb-2">Setup: {setup}</h3>
                <p className="text-gray-700 mb-4">Punchline: {punchline}</p>
                <button
                    onClick={fetchJoke}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default JokeCreater;
