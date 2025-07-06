const API_KEY = import.meta.env?.VITE_OPENWEATHERMAP_API_KEY;

interface WeatherData {
  temperature: number;
  weatherIcon: string;
  description: string;
  location: string;
}

export const getWeatherIcon = (temp: number): string => {
  if (temp < 10) return '❄️'; 
  if (temp < 20) return '🌤️'; 
  if (temp < 30) return '☀️'; 
  return '🔥'; 
};

// Default coordinates for New York City
const DEFAULT_LAT = 40.7128;
const DEFAULT_LON = -74.0060;

export const getWeatherByLocation = async (location: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.cod === '404' || data.cod === '400') {
      throw new Error('Location not found');
    }
    
    if (!data.main || !data.weather || !data.weather[0]) {
      throw new Error('Invalid weather data received');
    }
    
    return {
      temperature: Math.round(data.main.temp),
      weatherIcon: getWeatherIcon(data.main.temp),
      description: data.weather[0].description,
      location: data.name
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const getWeatherData = async (): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      weatherIcon: getWeatherIcon(data.main.temp),
      description: data.weather[0].description,
      location: data.name
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}; 