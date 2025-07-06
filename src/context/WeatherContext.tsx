import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWeatherData, getWeatherByLocation } from '../services/weatherService';

interface WeatherInfo {
  temperature: number;
  weatherIcon: string;
  description: string;
  location: string;
}

interface WeatherContextType {
  weather: WeatherInfo | null;
  setLocation: (location: string) => Promise<void>;
  error: string;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    } else {
      fetchWeather();
    }
  }, []);

  const fetchWeather = async () => {
    try {
      const data = await getWeatherData();
      setWeather(data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };

  const setLocation = async (location: string) => {
    try {
      const data = await getWeatherByLocation(location);
      setWeather(data);
      setError('');
      localStorage.setItem('selectedLocation', location);
    } catch (error) {
      setError('Location not found');
      console.error('Failed to fetch weather:', error);
    }
  };

  return (
    <WeatherContext.Provider value={{ weather, setLocation, error }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}; 