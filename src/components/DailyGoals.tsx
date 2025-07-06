import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Goal {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const DailyGoals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('dailyGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [newGoal, setNewGoal] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      setGoals([
        ...goals,
        {
          id: Date.now(),
          text: newGoal.trim(),
          completed: false,
          priority
        }
      ]);
      setNewGoal('');
      setPriority('medium');
    }
  };

  const toggleGoal = (id: number) => {
    setGoals(
      goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('dailyGoals', JSON.stringify(goals));
  }, [goals]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daily Goals</h2>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={addGoal} className="mb-6">
        <div className="space-y-4">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new goal..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="flex items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              Add Goal
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
              />
              <div>
                <span
                  className={`${
                    goal.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'
                  }`}
                >
                  {goal.text}
                </span>
                <span className={`ml-2 ${getPriorityColor(goal.priority)}`}>
                  • {goal.priority}
                </span>
              </div>
            </div>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Progress</h3>
        <div className="text-gray-600 dark:text-gray-300">
          {goals.length > 0 ? (
            <p>
              Completed: {goals.filter(g => g.completed).length} / {goals.length} goals
            </p>
          ) : (
            <p>No goals set for today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyGoals; 