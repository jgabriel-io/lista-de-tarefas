'use client';

import { useEffect, useState } from 'react';
import type { Task } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type TaskFormProps = {
  task?: Task;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  onCancel?: () => void;
};

export const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({ title, description: description || undefined });
      if (!task) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isLoading}
        placeholder="Digite o título da tarefa"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição (opcional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          placeholder="Digite uma descrição"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {task ? 'Atualizar' : 'Criar Tarefa'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};
