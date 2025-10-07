"use client"
import React, { useState, useCallback } from 'react';

// Main App Component
const App = () => {
    // State to hold the name from the input field
    const [name, setName] = useState('');
    // State to store the data fetched from the API
    const [apiData, setApiData] = useState(null);
    // State to manage the loading status during API calls
    const [isLoading, setIsLoading] = useState(false);
    // State to store any potential error messages
    const [error, setError] = useState(null);

    // Memoized function to fetch gender data from the API
    const fetchGenderData = useCallback(async () => {
        // Trim whitespace and check if the name is empty
        if (!name.trim()) {
            setError('Please enter a name.');
            return;
        }

        // Reset state before a new request
        setIsLoading(true);
        setError(null);
        setApiData(null);

        try {
            // Fetch data from the Genderize API
            const response = await fetch(`https://api.genderize.io/?name=${encodeURIComponent(name)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();

            // Handle cases where the API returns a null gender (name not found)
            if (data.gender === null) {
                setError(`Could not determine the gender for the name "${data.name}".`);
            } else {
                setApiData(data);
            }
        } catch (err) {
            // Handle network or other errors
            setError('Failed to fetch data. Please check your connection.');
            console.error("Fetch error:", err);
        } finally {
            // Ensure loading is set to false after the request completes
            setIsLoading(false);
        }
    }, [name]); // This function depends on the 'name' state

    // Function to handle the form submission (or button click)
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        fetchGenderData();
    };

    // Determine card colors based on the result
    const isMale = apiData?.gender === 'male';
    const cardGradient = isMale
        ? 'from-blue-100 to-blue-200'
        : 'from-pink-100 to-pink-200';
    const textColor = isMale ? 'text-blue-800' : 'text-pink-800';
    const accentColor = isMale ? 'text-blue-500' : 'text-pink-500';
    const buttonColor = isLoading
        ? 'bg-gray-400'
        : 'bg-indigo-600 hover:bg-indigo-700';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">Gender Predictor</h1>
                    <p className="text-center text-gray-500 mt-2">Enter a first name to guess its likely gender.</p>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name-input" className="sr-only">Enter a name</label>
                        <input
                            id="name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Alex, Maria, David"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-black"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ${buttonColor}`}
                    >
                        {isLoading ? 'Guessing...' : 'Guess Gender'}
                    </button>
                </form>

                {/* Results Section */}
                <div className="pt-4">
                    {error && (
                        <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}
                    {apiData && (
                        <div className={`p-6 rounded-lg shadow-inner bg-gradient-to-br ${cardGradient} transition-all duration-500`}>
                            <div className="text-center">
                                <p className={`text-sm font-semibold uppercase ${textColor}`}>Result for</p>
                                <p className="text-4xl font-bold text-gray-800 capitalize">{apiData.name}</p>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className={`text-sm font-semibold uppercase ${textColor}`}>Gender</p>
                                    <p className={`text-2xl font-bold ${accentColor} capitalize`}>{apiData.gender}</p>
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold uppercase ${textColor}`}>Probability</p>
                                    <p className={`text-2xl font-bold ${accentColor}`}>
                                        {(apiData.probability * 100).toFixed(0)}%
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className={`text-sm font-semibold uppercase ${textColor}`}>Based on Sample Count</p>
                                <p className={`text-xl font-bold ${accentColor}`}>
                                    {apiData.count.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
