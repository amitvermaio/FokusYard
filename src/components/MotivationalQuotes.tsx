import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  }
];

const MotivationalQuotes: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const changeQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(changeQuote, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daily Motivation</h2>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          Back to Dashboard
        </Link>
      </div>
      
      <div className="relative min-h-[200px] flex items-center justify-center">
        <div
          className={`transition-opacity duration-500 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <blockquote className="text-center">
            <p className="text-2xl text-gray-800 dark:text-white mb-4 italic">
              "{currentQuote.text}"
            </p>
            <footer className="text-gray-600 dark:text-gray-300">
              — {currentQuote.author}
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={changeQuote}
          className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          New Quote
        </button>
      </div>

      <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Why Motivation Matters:</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Daily motivation helps you maintain focus, overcome challenges, and achieve your goals.
          Take a moment to reflect on these words of wisdom and let them inspire your day.
        </p>
      </div>
    </div>
  );
};

export default MotivationalQuotes; 