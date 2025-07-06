import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageLayout from '../components/PageLayout';

interface FocusSession {
  id: number;
  date: string;
  duration: number; // in minutes
  type: 'pomodoro' | 'break';
  completed: boolean;
}

interface Achievement {
  id: number;
  message: string;
  type: 'daily' | 'weekly' | 'milestone';
  achieved: boolean;
  progress?: number;
  target?: number;
}

const FocusHistoryPage: React.FC = () => {
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');



  // Calculate statistics
  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const todaySessions = focusSessions.filter(s => s.date === today && s.type === 'pomodoro');
    const weekSessions = focusSessions.filter(s => s.date >= weekAgoStr && s.type === 'pomodoro');
    
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalSessions = focusSessions.filter(s => s.type === 'pomodoro').length;
    const completedSessions = focusSessions.filter(s => s.type === 'pomodoro' && s.completed).length;
    
    return {
      todayMinutes,
      weekMinutes,
      totalSessions,
      completedSessions,
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
    };
  };

  // Generate achievement messages
  const generateAchievements = () => {
    const stats = calculateStats();
    const newAchievements: Achievement[] = [];

    // Daily achievements
    if (stats.todayMinutes >= 50) {
      newAchievements.push({
        id: 1,
        message: `You've logged ${stats.todayMinutes} focused minutes today. Great job!`,
        type: 'daily',
        achieved: true
      });
    } else {
      newAchievements.push({
        id: 1,
        message: `You're ${50 - stats.todayMinutes} minutes away from your daily goal!`,
        type: 'daily',
        achieved: false,
        progress: stats.todayMinutes,
        target: 50
      });
    }

    // Weekly achievements
    if (stats.weekMinutes >= 1000) {
      newAchievements.push({
        id: 2,
        message: `Amazing! You've completed ${Math.round(stats.weekMinutes / 25)} pomodoros this week!`,
        type: 'weekly',
        achieved: true
      });
    } else {
      const remaining = Math.ceil((1000 - stats.weekMinutes) / 25);
      newAchievements.push({
        id: 2,
        message: `You're ${remaining} pomodoros away from your weekly goal!`,
        type: 'weekly',
        achieved: false,
        progress: stats.weekMinutes,
        target: 1000
      });
    }

    // Milestone achievements
    if (stats.totalSessions >= 100) {
      newAchievements.push({
        id: 3,
        message: `Milestone reached! You've completed ${stats.totalSessions} focus sessions!`,
        type: 'milestone',
        achieved: true
      });
    }

    if (stats.completionRate >= 90) {
      newAchievements.push({
        id: 4,
        message: `Excellent consistency! ${stats.completionRate}% completion rate!`,
        type: 'milestone',
        achieved: true
      });
    }

    setAchievements(newAchievements);
  };

  // Prepare chart data
  const getChartData = () => {
    const today = new Date();
    const data = [];
    
    const days = selectedPeriod === 'day' ? 1 : selectedPeriod === 'week' ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySessions = focusSessions.filter(s => s.date === dateStr && s.type === 'pomodoro');
      const minutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
      const completed = daySessions.filter(s => s.completed).length;
      
      data.push({
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        minutes,
        sessions: daySessions.length,
        completed,
        dateStr
      });
    }
    
    return data;
  };

  // Load focus sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('focusSessions');
    if (saved) {
      setFocusSessions(JSON.parse(saved));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('focusSessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  // Generate achievements when data changes
  useEffect(() => {
    generateAchievements();
  }, [focusSessions]);

  const stats = calculateStats();
  const chartData = getChartData();

  const colors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    danger: '#EF4444'
  };

  return (
    <PageLayout title="Focus History">
      <div className="space-y-8">
        {/* Achievement Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl shadow-lg border-2 transition-all duration-300 ${
                achievement.achieved
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900 dark:to-green-800 dark:border-green-700'
                  : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900 dark:to-blue-800 dark:border-blue-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${achievement.achieved ? 'text-green-600' : 'text-blue-600'}`}>
                  {achievement.achieved ? '🏆' : '🎯'}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${
                    achievement.achieved 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {achievement.message}
                  </p>
                  {achievement.progress !== undefined && achievement.target && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Focus</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.todayMinutes}m</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weekly Focus</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.weekMinutes}m</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              {(['day', 'week', 'month'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedPeriod === period
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Focus Minutes Line Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Daily Focus Minutes</h3>
            {focusSessions.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No data available</p>
                  <p className="text-sm">Complete some Pomodoro sessions to see your progress!</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      color: '#374151'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke={colors.primary} 
                    strokeWidth={3}
                    dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Sessions Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Daily Sessions</h3>
            {focusSessions.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No data available</p>
                  <p className="text-sm">Complete some Pomodoro sessions to see your progress!</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      color: '#374151'
                    }}
                  />
                  <Bar dataKey="sessions" fill={colors.secondary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Focus Sessions</h3>
          <div className="space-y-3">
            {focusSessions.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p className="text-lg mb-2">No focus sessions yet</p>
                <p className="text-sm">Complete some Pomodoro sessions to see your history here!</p>
              </div>
            ) : (
              focusSessions
                .filter(s => s.type === 'pomodoro')
                .slice(0, 5) // Show only last 5 sessions
                .map(session => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        session.completed ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {session.duration}min Focus Session
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      session.completed 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {session.completed ? 'Completed' : 'Incomplete'}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FocusHistoryPage; 