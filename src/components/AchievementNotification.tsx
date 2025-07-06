import React, { useState, useEffect } from 'react';

interface Achievement {
  id: number;
  message: string;
  type: 'daily' | 'weekly' | 'milestone';
  icon: string;
}

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: (id: number) => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievements, onClose }) => {
  const [visibleAchievements, setVisibleAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Show new achievements with animation
    const newAchievements = achievements.filter(
      achievement => !visibleAchievements.find(v => v.id === achievement.id)
    );

    if (newAchievements.length > 0) {
      setVisibleAchievements(prev => [...prev, ...newAchievements]);
    }
  }, [achievements]);

  const handleClose = (id: number) => {
    setVisibleAchievements(prev => prev.filter(a => a.id !== id));
    onClose(id);
  };

  if (visibleAchievements.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {visibleAchievements.map((achievement, index) => (
        <div
          key={achievement.id}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-2xl border border-green-400 transform transition-all duration-500 animate-slide-in"
          style={{
            animationDelay: `${index * 200}ms`,
            transform: 'translateX(100%)',
            animation: 'slideIn 0.5s ease-out forwards'
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl animate-bounce">
              {achievement.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)} Achievement!
              </p>
              <p className="text-sm opacity-90 mt-1">
                {achievement.message}
              </p>
            </div>
            <button
              onClick={() => handleClose(achievement.id)}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AchievementNotification; 