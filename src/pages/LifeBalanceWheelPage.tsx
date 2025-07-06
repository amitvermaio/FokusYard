import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import PageLayout from '../components/PageLayout';

interface LifeArea {
  id: string;
  name: string;
  value: number;
  color: string;
  description: string;
  icon: string;
}

const LifeBalanceWheelPage: React.FC = () => {
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([
    {
      id: 'health',
      name: 'Health',
      value: 7,
      color: '#10B981',
      description: 'Physical fitness, nutrition, sleep, and overall well-being',
      icon: '🏃‍♂️'
    },
    {
      id: 'work',
      name: 'Work',
      value: 8,
      color: '#3B82F6',
      description: 'Career progress, productivity, and professional development',
      icon: '💼'
    },
    {
      id: 'fun',
      name: 'Fun',
      value: 6,
      color: '#F59E0B',
      description: 'Entertainment, hobbies, and leisure activities',
      icon: '🎮'
    },
    {
      id: 'growth',
      name: 'Growth',
      value: 7,
      color: '#8B5CF6',
      description: 'Learning, personal development, and skill building',
      icon: '📚'
    },
    {
      id: 'relationships',
      name: 'Relationships',
      value: 8,
      color: '#EC4899',
      description: 'Family, friends, and social connections',
      icon: '❤️'
    }
  ]);

  const [selectedArea, setSelectedArea] = useState<LifeArea | null>(null);
  const [currentWeek, setCurrentWeek] = useState<string>('');

  // Get current week
  useEffect(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const weekKey = startOfWeek.toISOString().split('T')[0];
    setCurrentWeek(weekKey);
    
    // Load saved data for current week
    loadWeekData(weekKey);
  }, []);

  const loadWeekData = (weekKey: string) => {
    const saved = localStorage.getItem(`lifeBalance_${weekKey}`);
    if (saved) {
      const savedAreas = JSON.parse(saved);
      setLifeAreas(prev => prev.map(area => ({
        ...area,
        value: savedAreas[area.id] || area.value
      })));
    }
  };

  const saveWeekData = (weekKey: string, areas: LifeArea[]) => {
    const data = areas.reduce((acc, area) => {
      acc[area.id] = area.value;
      return acc;
    }, {} as Record<string, number>);
    
    localStorage.setItem(`lifeBalance_${weekKey}`, JSON.stringify(data));
  };

  const handleValueChange = (areaId: string, newValue: number) => {
    const updatedAreas = lifeAreas.map(area => 
      area.id === areaId ? { ...area, value: newValue } : area
    );
    setLifeAreas(updatedAreas);
    saveWeekData(currentWeek, updatedAreas);
  };

  const calculateBalanceScore = () => {
    const values = lifeAreas.map(area => area.value);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const balanceScore = Math.max(0, 100 - (variance * 10)); // Lower variance = higher balance
    return Math.round(balanceScore);
  };

  const getBalanceMessage = (score: number) => {
    if (score >= 80) return "Excellent balance! You're thriving in all areas.";
    if (score >= 60) return "Good balance! Consider focusing on lower-rated areas.";
    if (score >= 40) return "Moderate balance. Try to bring up areas below 6.";
    return "Unbalanced. Focus on improving areas below 5 for better life satisfaction.";
  };

  const balanceScore = calculateBalanceScore();
  const chartData = lifeAreas.map(area => ({
    area: area.name,
    value: area.value,
    fullMark: 10
  }));

  return (
    <PageLayout title="Life Balance Wheel">
      <div className="space-y-8">
        {/* Balance Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Life Balance Score
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - balanceScore / 100)}`}
                    className="text-green-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {balanceScore}%
                  </span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {getBalanceMessage(balanceScore)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Balance Overview</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={chartData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis 
                  dataKey="area" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                />
                <Radar
                  name="Life Balance"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    color: '#374151'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Life Areas Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Rate Your Life Areas</h3>
            <div className="space-y-6">
              {lifeAreas.map((area) => (
                <div
                  key={area.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    selectedArea?.id === area.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedArea(area)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{area.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">{area.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{area.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">{area.value}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">/10</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={area.value}
                      onChange={(e) => handleValueChange(area.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${area.color} 0%, ${area.color} ${(area.value / 10) * 100}%, #E5E7EB ${(area.value / 10) * 100}%, #E5E7EB 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Poor (1)</span>
                      <span>Excellent (10)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips and Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Balance Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">For Low-Rated Areas:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Set small, achievable goals</li>
                <li>• Schedule dedicated time each week</li>
                <li>• Find activities you genuinely enjoy</li>
                <li>• Track your progress</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">For High-Rated Areas:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Maintain your current habits</li>
                <li>• Share your knowledge with others</li>
                <li>• Set new challenges to grow further</li>
                <li>• Use your energy to support other areas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Weekly Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Week of {new Date(currentWeek).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Rate each area from 1-10 based on how satisfied you feel with that aspect of your life this week.
          </p>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </PageLayout>
  );
};

export default LifeBalanceWheelPage; 