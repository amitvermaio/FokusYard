import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import TodoPage from './pages/TodoPage';
import DailyPlanner from './components/DailyPlanner';
import PomodoroTimer from './components/PomodoroTimer';
import MotivationalQuotes from './components/MotivationalQuotes';
import DailyGoals from './components/DailyGoals';
import HabitTracker from './components/HabitTracker';
import QuickWidgets from './components/QuickWidgets';
import StatsPage from './pages/StatsPage';
import FocusHistoryPage from './pages/FocusHistoryPage';
import LifeBalanceWheelPage from './pages/LifeBalanceWheelPage';
import { WeatherProvider } from './context/WeatherContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { TodoProvider } from './context/TodoContext';
import AchievementNotification from './components/AchievementNotification';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [achievements, setAchievements] = useState<Array<{
    id: number;
    message: string;
    type: 'daily' | 'weekly' | 'milestone';
    icon: string;
  }>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for achievements periodically
  useEffect(() => {
    const checkAchievements = () => {
      const focusSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = focusSessions.filter((s: any) => s.date === today && s.type === 'pomodoro');
      const todayMinutes = todaySessions.reduce((sum: number, s: any) => sum + s.duration, 0);
      
      const newAchievements: Array<{
        id: number;
        message: string;
        type: 'daily' | 'weekly' | 'milestone';
        icon: string;
      }> = [];
      
      // Daily focus achievement
      if (todayMinutes >= 50 && !achievements.find(a => a.message.includes('50 focused minutes'))) {
        newAchievements.push({
          id: Date.now(),
          message: `You've logged ${todayMinutes} focused minutes today. Great job!`,
          type: 'daily' as const,
          icon: '🎯'
        });
      }
      
      // Weekly goal achievement
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      const weekSessions = focusSessions.filter((s: any) => s.date >= weekAgoStr && s.type === 'pomodoro');
      const weekMinutes = weekSessions.reduce((sum: number, s: any) => sum + s.duration, 0);
      
      if (weekMinutes >= 1000 && !achievements.find(a => a.message.includes('weekly goal'))) {
        newAchievements.push({
          id: Date.now() + 1,
          message: `Amazing! You've completed ${Math.round(weekMinutes / 25)} pomodoros this week!`,
          type: 'weekly' as const,
          icon: '🏆'
        });
      }
      
      // Todo completion achievement
      const completedTodos = todos.filter((t: any) => t.completed).length;
      if (completedTodos >= 10 && !achievements.find(a => a.message.includes('completed 10 tasks'))) {
        newAchievements.push({
          id: Date.now() + 2,
          message: `Congratulations! You've completed ${completedTodos} tasks!`,
          type: 'milestone' as const,
          icon: '✅'
        });
      }
      
      if (newAchievements.length > 0) {
        setAchievements(prev => [...prev, ...newAchievements]);
      }
    };
    
    const interval = setInterval(checkAchievements, 30000); // Check every 30 seconds
    checkAchievements(); // Check immediately
    
    return () => clearInterval(interval);
  }, [achievements]);

  const dashboardItems = [
    {
      id: 'todo',
      title: 'Todo List',
      description: 'Manage your daily tasks',
      icon: '📝',
      path: '/todo'
    },
    {
      id: 'planner',
      title: 'Daily Planner',
      description: 'Plan your day effectively',
      icon: '📅',
      path: '/planner'
    },
    {
      id: 'pomodoro',
      title: 'Pomodoro Timer',
      description: 'Stay focused with timed sessions',
      icon: '⏰',
      path: '/pomodoro'
    },
    {
      id: 'quotes',
      title: 'Motivational Quotes',
      description: 'Get inspired daily',
      icon: '💪',
      path: '/quotes'
    },
    {
      id: 'goals',
      title: 'Daily Goals',
      description: 'Track your progress',
      icon: '🎯',
      path: '/goals'
    },
    {
      id: 'habits',
      title: 'Habit Tracker',
      description: 'Track daily habits with streaks',
      icon: '✅',
      path: '/habits'
    }
  ];

  return (
    <DarkModeProvider>
      <WeatherProvider>
        <TodoProvider>
          <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header 
              currentTime={currentTime}
            />
            
            <Routes>
                          <Route path="/" element={
              <main className="container mx-auto px-4 pt-4 pb-8">
                {/* Top Bar with Statistics and Focus History Buttons */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 gap-4">
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Productivity Dashboard</h1>
                    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Manage your tasks, habits, and goals</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 w-full lg:w-auto">
                    <Link 
                      to="/balance-wheel"
                      className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white text-sm lg:text-base font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl flex-1 lg:flex-none justify-center"
                    >
                      <span className="text-base lg:text-lg">🧭</span>
                      <span className="hidden sm:inline">Balance Wheel</span>
                      <span className="sm:hidden">Balance</span>
                    </Link>
                    <Link 
                      to="/focus-history"
                      className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white text-sm lg:text-base font-semibold rounded-lg hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex-1 lg:flex-none justify-center"
                    >
                      <span className="text-base lg:text-lg">📈</span>
                      <span className="hidden sm:inline">Focus History</span>
                      <span className="sm:hidden">Focus</span>
                    </Link>
                    <Link 
                      to="/stats"
                      className="flex items-center gap-1 lg:gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm lg:text-base font-semibold rounded-lg lg:rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex-1 lg:flex-none justify-center"
                    >
                      <span className="text-base lg:text-xl">📊</span>
                      <span className="hidden sm:inline">View Statistics</span>
                      <span className="sm:hidden">Stats</span>
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardItems.map((item) => (
                    <Link to={item.path} key={item.id}>
                      <DashboardCard
                        {...item}
                        onClick={() => {}}
                      />
                    </Link>
                  ))}
                </div>

                {/* Modern Professional Footer */}
                <footer className="mt-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                  <div className="relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
                    </div>

                    <div className="relative px-6 py-8 lg:px-8 lg:py-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-xl font-bold">P</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">Productivity Hub</h3>
                              <p className="text-gray-400 text-sm">Organize • Focus • Achieve</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                            A comprehensive productivity dashboard designed to help you manage tasks, 
                            track habits, and achieve your goals with a balanced approach to life and work.
                          </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/todo" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Todo List
                              </Link>
                            </li>
                            <li>
                              <Link to="/habits" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Habit Tracker
                              </Link>
                            </li>
                            <li>
                              <Link to="/balance-wheel" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Life Balance
                              </Link>
                            </li>
                            <li>
                              <Link to="/stats" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Statistics
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Connect Section */}
                        <div>
                          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
                          <div className="space-y-3">
                            <a 
                              href="https://www.linkedin.com/in/amit-verma-678343281/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </div>
                              <span className="text-sm">LinkedIn</span>
                            </a>
                            
                            <a 
                              href="https://github.com/amitvermaofficial" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                              </div>
                              <span className="text-sm">GitHub</span>
                            </a>
                            
                            <a 
                              href="https://instagram.com/sonarltd" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </div>
                              <span className="text-sm">Instagram</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section */}
                      <div className="mt-8 pt-6 border-t border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>© 2025 Productivity Hub</span>
                            <span>•</span>
                            <span>Built with React & TypeScript</span>
                            <span>•</span>
                            <span>Designed by Amit Verma</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span>Live & Responsive</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </footer>
              </main>
            } />
              <Route path="/todo" element={<TodoPage />} />
              <Route path="/planner" element={<DailyPlanner />} />
              <Route path="/pomodoro" element={<PomodoroTimer />} />
                          <Route path="/quotes" element={<MotivationalQuotes />} />
            <Route path="/goals" element={<DailyGoals />} />
            <Route path="/habits" element={<HabitTracker />} />
            <Route path="/focus-history" element={<FocusHistoryPage />} />
            <Route path="/balance-wheel" element={<LifeBalanceWheelPage />} />
            <Route path="/stats" element={<StatsPage />} />
            </Routes>
            
            <QuickWidgets />
            
            {/* Achievement Notifications */}
            <AchievementNotification 
              achievements={achievements}
              onClose={(id) => setAchievements(prev => prev.filter(a => a.id !== id))}
            />
          </div>
        </Router>
        </TodoProvider>
      </WeatherProvider>
    </DarkModeProvider>
  );
}

export default App; 