import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  time: string;
  description: string;
}

const DailyPlanner: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('dailyPlannerEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    description: ''
  });

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title.trim() && newEvent.time) {
      setEvents([
        ...events,
        {
          id: Date.now(),
          ...newEvent
        }
      ]);
      setNewEvent({
        title: '',
        time: '',
        description: ''
      });
    }
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('dailyPlannerEvents', JSON.stringify(events));
  }, [events]);

  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daily Planner</h2>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={addEvent} className="mb-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event title"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder="Event description"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={3}
          />
          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Add Event
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {sortedEvents.map(event => (
          <div
            key={event.id}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {event.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {event.time}
                  </span>
                </div>
                {event.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {event.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No events scheduled for today
        </div>
      )}
    </div>
  );
};

export default DailyPlanner; 