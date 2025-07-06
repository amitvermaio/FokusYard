import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useWeather } from '../context/WeatherContext';
import { useTodo } from '../context/TodoContext';



const TodoPage: React.FC = () => {
  const { weather } = useWeather();
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodo();
  const [newTodo, setNewTodo] = useState({
    text: '',
    category: 'personal',
    dueDate: ''
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.text.trim()) {
      addTodo({
        text: newTodo.text.trim(),
        completed: false,
        category: newTodo.category,
        dueDate: newTodo.dueDate
      });
      setNewTodo({
        text: '',
        category: 'personal',
        dueDate: ''
      });
    }
  };

  const categories = ['personal', 'work', 'shopping', 'health'];

  return (
    <PageLayout title="Todo List">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            {weather && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Current Weather</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {weather.temperature}°C {weather.weatherIcon}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{weather.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{weather.location}</p>
                  </div>
                </div>
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add New Task</h2>
            <form onSubmit={handleAddTodo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Description
                </label>
                <input
                  type="text"
                  value={newTodo.text}
                  onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newTodo.category}
                  onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Tasks</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {todos.filter(t => t.completed).length} of {todos.length} completed
              </div>
            </div>

            <div className="space-y-4">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span
                        className={`block ${
                          todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {todo.category}
                        </span>
                        {todo.dueDate && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}

              {todos.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No tasks yet. Add one to get started!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TodoPage; 