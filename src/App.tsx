import { useState, useEffect } from 'react';
import { PlusCircle, Search, ListTodo, Calendar, Clock } from 'lucide-react';
import type { Todo } from './types';
import { TodoItem } from './components/TodoItem';

type FilterType = 'all' | 'pending' | 'completed';
type PendingFilterType = 'all' | 'overdue' | 'upcoming';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [inputValue, setInputValue] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [pendingFilter, setPendingFilter] = useState<PendingFilterType>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
      targetDate: targetDate || undefined,
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
    setTargetDate('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const isCompleting = !todo.completed;
        return {
          ...todo,
          completed: isCompleting,
          completedAt: isCompleting ? Date.now() : undefined
        };
      }
      return todo;
    }));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') {
      if (todo.completed) return false;

      if (pendingFilter !== 'all') {
        const todayStr = getTodayString();
        const isOverdue = todo.targetDate ? todo.targetDate < todayStr : false;

        if (pendingFilter === 'overdue' && !isOverdue) return false;
        if (pendingFilter === 'upcoming' && isOverdue) return false;
      }
      return true;
    }
    if (filter === 'completed') return todo.completed;
    return true; // filter === 'all'
  });

  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

        {/* Header content */}
        <div className="bg-indigo-600 px-8 py-10 text-white shadow-inner">
          <div className="flex items-center gap-3 mb-2">
            <ListTodo size={32} />
            <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          </div>
          <p className="text-indigo-100 mt-2">Você tem {pendingCount} {pendingCount === 1 ? 'tarefa pendente' : 'tarefas pendentes'}</p>
        </div>

        <div className="px-8 py-6">
          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="relative mb-8 group">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Adicionar nova tarefa..."
                  className="w-full pl-5 pr-14 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400 text-lg shadow-sm group-hover:border-slate-300"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-300 disabled:hover:bg-slate-300 shadow-sm"
                  aria-label="Add todo"
                >
                  <PlusCircle size={24} />
                </button>
              </div>
              <div className="flex items-center gap-2 px-1 text-slate-500 text-sm">
                <label htmlFor="target-date" className="font-medium">Data Alvo (Opcional):</label>
                <input
                  id="target-date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none px-2 py-1 text-slate-600"
                />
              </div>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg shrink-0 overflow-x-auto hide-scrollbar">
              {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${filter === f
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                  {f === 'all' && 'Todas'}
                  {f === 'pending' && 'Pendentes'}
                  {f === 'completed' && 'Concluídas'}
                </button>
              ))}
            </div>

            {/* Sub-filters for Pending */}
            {filter === 'pending' && (
              <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-lg shrink-0 overflow-x-auto hide-scrollbar">
                {(['all', 'overdue', 'upcoming'] as PendingFilterType[]).map((pf) => (
                  <button
                    key={pf}
                    onClick={() => setPendingFilter(pf)}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all border ${pendingFilter === pf
                        ? 'bg-white text-indigo-600 border-slate-200 shadow-sm'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                      }`}
                  >
                    {pf === 'all' && 'Todas Pendentes'}
                    {pf === 'overdue' && 'Vencidas'}
                    {pf === 'upcoming' && 'À Vencer'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Todo List Header and List */}
          <div className="mb-4">
            {filteredTodos.length > 0 && (
              <div className="hidden sm:flex items-center gap-4 px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-6 shrink-0"></div>
                  <span>Nome da Tarefa</span>
                </div>
                <div className="flex items-center justify-end gap-4 shrink-0">
                  <div className="w-24 shrink-0 text-center flex items-center justify-center gap-1"><Calendar size={12} /> Data Alvo</div>
                  <div className="w-24 shrink-0 text-center flex items-center justify-center gap-1"><Clock size={12} /> Data Conclusão</div>
                  {/* Fake delete button area for spacing to match item */}
                  <div className="w-[34px] shrink-0"></div>
                </div>
              </div>
            )}
            <ul className="space-y-1">
              {filteredTodos.length > 0 ? (
                filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <Search size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">Nenhuma tarefa encontrada</h3>
                  <p className="text-slate-500">
                    {filter === 'all' ? 'Comece adicionando uma nova tarefa acima.' : 'Tente alterar os filtros para ver suas tarefas.'}
                  </p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
