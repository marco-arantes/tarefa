import { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Pencil } from 'lucide-react';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };
  const formatTargetDate = (dateString?: string) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    console.log('oi')
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <li className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 mb-2 rounded-lg border transition-all duration-200 ${todo.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>

      {/* Left section: Check + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => onToggle(todo.id)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-400'
            }`}
        >
          {todo.completed && <Check size={14} className="text-white" strokeWidth={3} />}
        </button>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm md:text-base border outline-none border-indigo-300 rounded px-2 py-1 shadow-sm font-medium text-slate-700 bg-white"
          />
        ) : (
          <span className={`text-sm md:text-base truncate transition-all duration-200 ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
            {todo.text}
          </span>
        )}
      </div>

      {/* Right section: Dates + Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 pl-9 sm:pl-0 sm:shrink-0">
        <div className="w-24 shrink-0 text-center text-xs text-slate-500">
          <span className="sm:hidden text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Data Alvo</span>
          {todo.targetDate ? formatTargetDate(todo.targetDate) : <span className="text-slate-300">-</span>}
        </div>

        <div className="w-24 shrink-0 text-center text-xs text-slate-500">
          <span className="sm:hidden text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Data Conclusão</span>
          {todo.completedAt ? (
            <span className="text-emerald-600 font-medium">{formatTimestamp(todo.completedAt)}</span>
          ) : <span className="text-slate-300">-</span>}
        </div>

        {!todo.completed && !isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="shrink-0 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            aria-label="Edit todo"
          >
            <Pencil size={18} />
          </button>
        ) : (
          <div className="w-[34px] shrink-0"></div>
        )}

        <button
          onClick={() => onDelete(todo.id)}
          className="shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          aria-label="Delete todo"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
