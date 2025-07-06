import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  isQuickTodo?: boolean;
  timestamp?: number;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  addQuickTodo: (text: string) => void;
  getQuickTodos: () => Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: Omit<Todo, 'id'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now()
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const addQuickTodo = (text: string) => {
    const quickTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      category: 'quick',
      isQuickTodo: true,
      timestamp: Date.now()
    };
    setTodos(prev => [quickTodo, ...prev]);
  };

  const getQuickTodos = () => {
    return todos.filter(todo => todo.isQuickTodo).slice(0, 5);
  };

  const value: TodoContextType = {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    addQuickTodo,
    getQuickTodos
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}; 