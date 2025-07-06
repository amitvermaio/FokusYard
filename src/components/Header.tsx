import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useDarkMode } from '../context/DarkModeContext';
import navbarImage from '../assets/navbar.jpeg';

interface HeaderProps {
  currentTime: Date;
}

const Header: React.FC<HeaderProps> = ({ currentTime }) => {
  const { weather, setLocation, error } = useWeather();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [imageError, setImageError] = React.useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [userName, setUserName] = useState(() => {
    // Initialize with saved name or default
    const savedName = localStorage.getItem('userName');
    return savedName || 'Your Name';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // Save user name to localStorage whenever it changes
  useEffect(() => {
    if (userName && userName !== 'Your Name') {
      localStorage.setItem('userName', userName);
    }
  }, [userName]);

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;

    await setLocation(searchLocation);
    setSearchLocation('');
    setIsSearching(false);
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempName(userName);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      const newName = tempName.trim();
      setUserName(newName);
      // Immediately save to localStorage
      localStorage.setItem('userName', newName);
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(userName);
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="px-4 py-6">
      <div 
        className={`relative rounded-2xl shadow-2xl overflow-hidden border border-gray-800/50 ${
          imageError ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : ''
        }`}
        style={!imageError ? {
          backgroundImage: `url(${navbarImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        {/* Hidden image element to detect loading/error */}
        <img 
          src={navbarImage}
          alt=""
          className="hidden"
          onError={() => setImageError(true)}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-gray-900/60 to-black/60"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
        
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-500 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
            
            {/* Left side - Time and Brand */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-2xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  {formatTime(currentTime)}
                </h1>
                <p className="text-lg lg:text-xl text-gray-400 font-medium tracking-wide uppercase">
                  {formatDate(currentTime)}
                </p>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-xl">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    PRODUCTIVITY
                  </span>
                  <span className="text-white"> HUB</span>
                </h2>
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400 font-semibold tracking-wider uppercase">Organize</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400 font-semibold tracking-wider uppercase">Focus</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400 font-semibold tracking-wider uppercase">Achieve</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Center - User Profile */}
            <div className="text-center">
              <div className="relative bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                <div className="relative">
                  <p className="text-xs text-gray-400 font-bold mb-3 tracking-widest uppercase">
                    Welcome back, Commander
                  </p>
                  {isEditingName ? (
                    <div className="flex items-center justify-center space-x-3">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={handleNameKeyPress}
                        className="text-xl lg:text-2xl font-bold text-white bg-transparent border-b-2 border-blue-400 focus:outline-none focus:border-purple-400 text-center min-w-0 transition-colors duration-300"
                        autoFocus
                        placeholder="Enter your name"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleNameSave}
                          className="text-green-400 hover:text-green-300 transition-colors duration-200 bg-green-500/20 rounded-lg p-2 hover:bg-green-500/30"
                          title="Save name"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleNameCancel}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 bg-red-500/20 rounded-lg p-2 hover:bg-red-500/30"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <h3 className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                        {userName}
                      </h3>
                      <button
                        onClick={handleNameEdit}
                        className="text-gray-400 hover:text-white transition-all duration-300 opacity-60 hover:opacity-100 bg-gray-700/50 rounded-lg p-2 hover:bg-gray-600/50 hover:scale-110"
                        title="Edit name"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side - Controls */}
            <div className="flex flex-col items-center lg:items-end space-y-6">
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400 font-semibold">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
                <button
                  onClick={toggleDarkMode}
                  className="relative w-14 h-7 bg-gray-700 rounded-full p-1 transition-colors duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}>
                    {isDarkMode ? (
                      <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
              
              {/* Weather Widget */}
              {weather && (
                <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="flex items-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl px-6 py-4 border border-gray-700/50 shadow-xl">
                    <span className="text-4xl mr-4">{weather.weatherIcon}</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-white block drop-shadow-lg">
                        {weather.temperature}°C
                      </span>
                      <span className="text-sm text-gray-400 font-semibold tracking-wide">
                        {weather.location}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsSearching(!isSearching)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl w-14 h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/25 border border-blue-500/50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Location Search */}
              {isSearching && (
                <form onSubmit={handleLocationSearch} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Enter location..."
                    className="px-4 py-3 bg-gray-800/50 backdrop-blur-xl border-2 border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 font-medium transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-bold border border-blue-500/50 shadow-lg hover:shadow-blue-500/25"
                  >
                    Search
                  </button>
                </form>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-900/30 backdrop-blur-xl border border-red-500/50 px-4 py-3 rounded-xl">
                  <p className="text-red-300 text-sm font-semibold">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 