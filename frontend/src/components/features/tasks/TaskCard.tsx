'use client';

import type { Task } from '@/types/task';
import { Button } from '@/components/ui/Button';

type TaskCardProps = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
};

export const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mt-2 ml-7">{task.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onEdit(task)} className="text-sm px-3 py-1">
            Editar
          </Button>
          <Button variant="danger" onClick={() => onDelete(task.id)} className="text-sm px-3 py-1">
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};
