'use client';

import type { Task } from '@/types/task';
import { TaskCard } from './TaskCard';

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
};

export const TaskList = ({ tasks, onToggle, onDelete, onEdit }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma tarefa encontrada</p>
        <p className="text-sm text-gray-400 mt-2">Crie sua primeira tarefa acima</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
