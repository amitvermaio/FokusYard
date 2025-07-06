import React from 'react';

// Import images for Vite to handle them properly
import todoImage from '../assets/9403187.jpg';
import plannerImage from '../assets/9403196.jpg';
import pomodoroImage from '../assets/9403205.jpg';
import quotesImage from '../assets/9403212.jpg';
import goalsImage from '../assets/9403218.jpg';
import habitsImage from '../assets/bg.jpeg';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
  id: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  onClick,
  id
}) => {
  const getBackgroundImage = (cardId: string) => {
    const imageMap: { [key: string]: string } = {
      'todo': todoImage,
      'planner': plannerImage,
      'pomodoro': pomodoroImage,
      'quotes': quotesImage,
      'goals': goalsImage,
      'habits': habitsImage
    };
    return imageMap[cardId] || imageMap['todo'];
  };

  const getFallbackGradient = (cardId: string) => {
    const gradientMap: { [key: string]: string } = {
      'todo': 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
      'planner': 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
      'pomodoro': 'bg-gradient-to-br from-red-400 via-red-500 to-red-600',
      'quotes': 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
      'goals': 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
      'habits': 'bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600'
    };
    return gradientMap[cardId] || gradientMap['todo'];
  };

  // Check if images exist and are loaded properly
  const [imageLoaded, setImageLoaded] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Use fallback gradient if image fails to load
  const useFallback = imageError || !imageLoaded;

  return (
    <div
      onClick={onClick}
      className={`relative h-64 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2 group ${
        useFallback ? getFallbackGradient(id) : ''
      }`}
      style={!useFallback ? {
        backgroundImage: `url(${getBackgroundImage(id)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {/* Hidden image element to detect loading/error */}
      <img 
        src={getBackgroundImage(id)}
        alt=""
        className="hidden"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      <div className={`absolute inset-0 ${useFallback ? 'bg-black bg-opacity-20 group-hover:bg-opacity-10' : 'bg-black bg-opacity-40 group-hover:bg-opacity-30'} transition-all duration-300`}></div>
      
      {/* Gradient overlay for professional look */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent ${useFallback ? 'opacity-40' : 'opacity-60'} transition-all duration-300`}></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 text-white">
        {/* Top section with icon */}
        <div className="flex justify-center items-center flex-1">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
            <span className="text-4xl">
              {icon}
            </span>
          </div>
        </div>
        
        {/* Bottom section with text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {title}
          </h3>
          <p className="text-sm text-gray-100 drop-shadow-md leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
    </div>
  );
};

export default DashboardCard; 