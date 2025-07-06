import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';

interface Habit {
  id: number;
  name: string;
  description: string;
  streak: number;
  totalDays: number;
  completedToday: boolean;
  reminder: boolean;
  category: string;
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [
      {
        id: 1,
        name: 'Morning Exercise',
        description: '30 minutes of physical activity',
        streak: 5,
        totalDays: 12,
        completedToday: false,
        reminder: true,
        category: 'health'
      },
      {
        id: 2,
        name: 'Read Books',
        description: 'Read for 20 minutes',
        streak: 8,
        totalDays: 15,
        completedToday: true,
        reminder: false,
        category: 'learning'
      },
      {
        id: 3,
        name: 'Drink Water',
        description: '8 glasses of water daily',
        streak: 3,
        totalDays: 7,
        completedToday: false,
        reminder: true,
        category: 'health'
      }
    ];
  });

  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'health',
    reminder: false
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const completedToday = !habit.completedToday;
        const streak = completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        const totalDays = completedToday ? habit.totalDays + 1 : habit.totalDays;
        return { ...habit, completedToday, streak, totalDays };
      }
      return habit;
    }));
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.name.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now(),
          name: newHabit.name.trim(),
          description: newHabit.description.trim(),
          streak: 0,
          totalDays: 0,
          completedToday: false,
          reminder: newHabit.reminder,
          category: newHabit.category
        }
      ]);
      setNewHabit({ name: '', description: '', category: 'health', reminder: false });
    }
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const categories = ['health', 'learning', 'productivity', 'mindfulness'];

  const getProgressPercentage = (habit: Habit) => {
    return Math.min(100, (habit.streak / 30) * 100);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === new Date().getDate() && 
                     selectedMonth.getMonth() === new Date().getMonth() &&
                     selectedMonth.getFullYear() === new Date().getFullYear();
      
      days.push(
        <div
          key={day}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors ${
            isToday 
              ? 'bg-blue-500 text-white font-semibold' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <PageLayout title="Habit Tracker">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Add New Habit */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add New Habit</h2>
            <form onSubmit={addHabit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="e.g., Morning Exercise"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Describe your habit..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={newHabit.reminder}
                  onChange={(e) => setNewHabit({ ...newHabit, reminder: e.target.checked })}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <label htmlFor="reminder" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable reminders
                </label>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Habit
              </button>
            </form>
          </div>

          {/* Monthly Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Monthly View</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                  className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                >
                  ←
                </button>
                <span className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400">
                  {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                  className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                >
                  →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays()}
            </div>
          </div>
        </div>

        {/* Right Column - Habits List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Habits</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {habits.filter(h => h.completedToday).length} of {habits.length} completed today
              </div>
            </div>

            <div className="space-y-6">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={habit.completedToday}
                        onChange={() => toggleHabit(habit.id)}
                        className="w-6 h-6 text-blue-500 rounded focus:ring-blue-500"
                      />
                      {habit.reminder && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {habit.name}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {habit.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {habit.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-600 dark:text-green-400">
                          🔥 {habit.streak} day streak
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          📅 {habit.totalDays} total days
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Progress Ring */}
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="100, 100"
                          className="text-gray-200 dark:text-gray-600"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${getProgressPercentage(habit)}, 100`}
                          className="text-blue-500 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {Math.round(getProgressPercentage(habit))}%
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete habit"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {habits.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No habits yet. Add one to start tracking!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HabitTracker; 