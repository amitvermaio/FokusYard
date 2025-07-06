import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: number;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            // Save the completed session
            saveFocusSession(true);
            setIsBreak(!isBreak);
            setMinutes(isBreak ? 25 : 5);
            setSeconds(0);
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak]);

  const toggleTimer = () => {
    if (isActive) {
      // If stopping the timer, save as incomplete session
      saveFocusSession(false);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setIsBreak(false);
  };

  // Save focus session when timer completes
  const saveFocusSession = (completed: boolean) => {
    const session = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      duration: isBreak ? 5 : 25,
      type: isBreak ? 'break' : 'pomodoro' as const,
      completed
    };

    const existingSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    existingSessions.push(session);
    localStorage.setItem('focusSessions', JSON.stringify(existingSessions));
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pomodoro Timer</h2>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          Back to Dashboard
        </Link>
      </div>
      
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
          {formatTime(minutes, seconds)}
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">How it works:</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>25 minutes of focused work</li>
          <li>5 minutes of break</li>
          <li>Repeat the cycle</li>
        </ul>
      </div>
    </div>
  );
};

export default PomodoroTimer; 