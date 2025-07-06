import React, { useState, useEffect, useRef } from 'react';

interface StickyNote {
  id: number;
  content: string;
  color: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  fontSize: string;
  sizeCategory: 'small' | 'medium' | 'large';
}

const QuickWidgets: React.FC = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(() => {
    const saved = localStorage.getItem('quickStickyNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [draggedNote, setDraggedNote] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isNearEdge, setIsNearEdge] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const colors = [
    { 
      name: 'yellow', 
      bg: 'bg-gradient-to-br from-yellow-200 to-yellow-300', 
      darkBg: 'dark:from-yellow-800 dark:to-yellow-900', 
      text: 'text-yellow-900', 
      darkText: 'dark:text-yellow-100',
      shadow: 'shadow-yellow-200/50',
      darkShadow: 'dark:shadow-yellow-800/30'
    },
    { 
      name: 'pink', 
      bg: 'bg-gradient-to-br from-pink-200 to-pink-300', 
      darkBg: 'dark:from-pink-800 dark:to-pink-900', 
      text: 'text-pink-900', 
      darkText: 'dark:text-pink-100',
      shadow: 'shadow-pink-200/50',
      darkShadow: 'dark:shadow-pink-800/30'
    },
    { 
      name: 'blue', 
      bg: 'bg-gradient-to-br from-blue-200 to-blue-300', 
      darkBg: 'dark:from-blue-800 dark:to-blue-900', 
      text: 'text-blue-900', 
      darkText: 'dark:text-blue-100',
      shadow: 'shadow-blue-200/50',
      darkShadow: 'dark:shadow-blue-800/30'
    },
    { 
      name: 'green', 
      bg: 'bg-gradient-to-br from-green-200 to-green-300', 
      darkBg: 'dark:from-green-800 dark:to-green-900', 
      text: 'text-green-900', 
      darkText: 'dark:text-green-100',
      shadow: 'shadow-green-200/50',
      darkShadow: 'dark:shadow-green-800/30'
    },
    { 
      name: 'purple', 
      bg: 'bg-gradient-to-br from-purple-200 to-purple-300', 
      darkBg: 'dark:from-purple-800 dark:to-purple-900', 
      text: 'text-purple-900', 
      darkText: 'dark:text-purple-100',
      shadow: 'shadow-purple-200/50',
      darkShadow: 'dark:shadow-purple-800/30'
    },
    { 
      name: 'orange', 
      bg: 'bg-gradient-to-br from-orange-200 to-orange-300', 
      darkBg: 'dark:from-orange-800 dark:to-orange-900', 
      text: 'text-orange-900', 
      darkText: 'dark:text-orange-100',
      shadow: 'shadow-orange-200/50',
      darkShadow: 'dark:shadow-orange-800/30'
    }
  ];

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('quickStickyNotes', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  const calculateNoteSize = (content: string) => {
    const lines = content.split('\n');
    const totalLength = content.length;
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const lineCount = lines.length;
    
    // Determine size category based on content
    let sizeCategory: 'small' | 'medium' | 'large';
    
    if (totalLength <= 50 && lineCount <= 2 && maxLineLength <= 30) {
      sizeCategory = 'small';
    } else if (totalLength <= 150 && lineCount <= 4 && maxLineLength <= 50) {
      sizeCategory = 'medium';
    } else {
      sizeCategory = 'large';
    }
    
    // Size configurations
    const sizes = {
      small: { width: 180, height: 120, fontSize: 'text-xs' },
      medium: { width: 280, height: 180, fontSize: 'text-sm' },
      large: { width: 380, height: 280, fontSize: 'text-base' }
    };
    
    return { 
      width: sizes[sizeCategory].width, 
      height: sizes[sizeCategory].height,
      fontSize: sizes[sizeCategory].fontSize,
      sizeCategory
    };
  };

  const addStickyNote = () => {
    if (newNote.trim()) {
      const size = calculateNoteSize(newNote);
      const note: StickyNote = {
        id: Date.now(),
        content: newNote.trim(),
        color: selectedColor,
        position: { 
          x: Math.random() * (window.innerWidth - size.width - 100) + 50, 
          y: Math.random() * (window.innerHeight - size.height - 100) + 50 
        },
        width: size.width,
        height: size.height,
        fontSize: size.fontSize,
        sizeCategory: size.sizeCategory
      };
      setStickyNotes([...stickyNotes, note]);
      setNewNote('');
    }
  };

  const deleteStickyNote = (id: number) => {
    setStickyNotes(stickyNotes.filter(note => note.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent, noteId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const note = stickyNotes.find(n => n.id === noteId);
    if (!note) return;
    
    setDraggedNote(noteId);
    // Calculate offset from mouse to note corner
    setDragOffset({
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedNote) {
      e.preventDefault();
      
      // Calculate new position based on mouse position minus the initial offset
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Get the note being dragged
      const draggedNoteData = stickyNotes.find(note => note.id === draggedNote);
      if (!draggedNoteData) return;
      
      // Check if note is completely outside screen boundaries
      const isCompletelyOutside = 
        newX + draggedNoteData.width < 0 || 
        newY + draggedNoteData.height < 0 || 
        newX > window.innerWidth || 
        newY > window.innerHeight;
      
      if (isCompletelyOutside) {
        // Delete the note if it's completely outside screen
        setStickyNotes(prev => prev.filter(note => note.id !== draggedNote));
        setDraggedNote(null);
        setIsNearEdge(false);
        return;
      }
      
      // Check if note is near screen edge (within 50px) for visual feedback
      const edgeThreshold = 50;
      const isNearEdge = 
        newX < -edgeThreshold || 
        newY < -edgeThreshold || 
        newX + draggedNoteData.width > window.innerWidth + edgeThreshold || 
        newY + draggedNoteData.height > window.innerHeight + edgeThreshold;
      
      setIsNearEdge(isNearEdge);
      
      // Update position immediately to follow mouse exactly
      setStickyNotes(prev => prev.map(note => 
        note.id === draggedNote 
          ? { ...note, position: { x: newX, y: newY } }
          : note
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggedNote) {
      setDraggedNote(null);
      setIsNearEdge(false);
    }
  };

  useEffect(() => {
    if (draggedNote) {
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        // Restore normal cursor and text selection
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [draggedNote, dragOffset]);

  // Keyboard shortcut to toggle widgets (Ctrl/Cmd + Q)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        setIsWidgetOpen(!isWidgetOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isWidgetOpen]);

  const getColorClasses = (colorName: string) => {
    const color = colors.find(c => c.name === colorName);
    return color ? `${color.bg} ${color.darkBg} ${color.text} ${color.darkText} ${color.shadow} ${color.darkShadow}` : colors[0];
  };



  return (
    <>
      {/* Floating Widget Button */}
      <button
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-3xl font-bold backdrop-blur-sm"
        title="Quick Sticky Notes (Ctrl+Q)"
      >
        {isWidgetOpen ? '×' : '📝'}
      </button>

      {/* Widget Panel */}
      {isWidgetOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Quick Sticky Notes
            </h3>
            
            {/* Sticky Notes Creation */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Write your note
                  </label>
                  {newNote.trim() && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      calculateNoteSize(newNote).sizeCategory === 'small' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : calculateNoteSize(newNote).sizeCategory === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {calculateNoteSize(newNote).sizeCategory.toUpperCase()}
                    </span>
                  )}
                </div>
                <textarea
                  ref={textareaRef}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addStickyNote())}
                  placeholder="Type your note here... (Shift+Enter for new line)"
                  rows={4}
                  className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all duration-200"
                />
              </div>
              
              {/* Color Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Choose color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-3 transition-all duration-200 hover:scale-110 ${color.bg} ${color.darkBg} ${
                        selectedColor === color.name 
                          ? 'border-gray-600 dark:border-gray-300 shadow-lg scale-110' 
                          : 'border-transparent hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={addStickyNote}
                disabled={!newNote.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Create Sticky Note
              </button>
              
              {/* Size Guide */}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded"></div>
                  <span>Small: ≤50 chars, ≤2 lines</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
                  <span>Medium: ≤150 chars, ≤4 lines</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-200 dark:bg-red-800 rounded"></div>
                  <span>Large: {'>'}150 chars or {'>'}4 lines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sticky Notes */}
      {stickyNotes.map(note => (
        <div
          key={note.id}
          className={`fixed z-30 rounded-2xl shadow-2xl ${getColorClasses(note.color)} ${
            draggedNote === note.id 
              ? isNearEdge 
                ? 'shadow-red-500/50 dark:shadow-red-400/50 scale-110 rotate-2 border-2 border-red-400 dark:border-red-300 cursor-grabbing' 
                : 'shadow-3xl scale-105 rotate-1 cursor-grabbing'
              : 'hover:scale-102 hover:shadow-3xl cursor-grab transition-all duration-200'
          }`}
          style={{
            left: note.position.x,
            top: note.position.y,
            width: note.width,
            height: note.height,
            userSelect: 'none',
            pointerEvents: 'auto',
            transform: draggedNote === note.id 
              ? isNearEdge 
                ? 'scale(1.1) rotate(2deg)' 
                : 'scale(1.05) rotate(1deg)'
              : 'scale(1) rotate(0deg)'
          }}
          onMouseDown={(e) => handleMouseDown(e, note.id)}
          draggable={false}
        >
                      <div className={`h-full flex flex-col ${note.sizeCategory === 'small' ? 'p-3' : note.sizeCategory === 'medium' ? 'p-4' : 'p-5'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1">
                  <div className={`${note.sizeCategory === 'small' ? 'w-1.5 h-1.5' : note.sizeCategory === 'medium' ? 'w-2 h-2' : 'w-2.5 h-2.5'} bg-black/20 dark:bg-white/20 rounded-full`}></div>
                  {note.sizeCategory === 'large' && (
                    <span className="text-xs font-bold text-black/30 dark:text-white/30 uppercase tracking-wider">
                      {note.sizeCategory}
                    </span>
                  )}
                  {draggedNote === note.id && isNearEdge && (
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 animate-pulse">
                      🗑️
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStickyNote(note.id);
                  }}
                  className={`text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-bold transition-colors duration-200 hover:scale-110 ${
                    note.sizeCategory === 'small' ? 'text-base' : note.sizeCategory === 'medium' ? 'text-lg' : 'text-xl'
                  }`}
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className={`${note.fontSize} leading-relaxed font-medium whitespace-pre-wrap break-words`}>
                  {note.content}
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <div className={`${note.sizeCategory === 'small' ? 'w-1 h-1' : note.sizeCategory === 'medium' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-black/20 dark:bg-white/20 rounded-full`}></div>
              </div>
            </div>
        </div>
      ))}
    </>
  );
};

export default QuickWidgets; 