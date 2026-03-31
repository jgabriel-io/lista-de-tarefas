'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Task } from '@/types/task';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Header } from '@/components/layout/Header';
import { Spinner } from '@/components/ui/Spinner';
import { TaskForm } from '@/components/features/tasks/TaskForm';
import { TaskList } from '@/components/features/tasks/TaskList';

export default function DashboardPage() {
  const { isAuthenticated, accessToken, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchTasks();
  }, [isAuthenticated, router]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiFetch<{ data: Task[] }>('/api/tasks', {
        token: accessToken!,
      });
      setTasks(response.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar tarefas';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: { title: string; description?: string }) => {
    try {
      const response = await apiFetch<{ data: Task }>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
        token: accessToken!,
      });
      setTasks([response.data, ...tasks]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar tarefa';
      setError(message);
    }
  };

  const handleUpdate = async (data: { title: string; description?: string }) => {
    if (!editingTask) return;

    try {
      const response = await apiFetch<{ data: Task }>(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token: accessToken!,
      });
      setTasks(tasks.map((t) => (t.id === editingTask.id ? response.data : t)));
      setEditingTask(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar tarefa';
      setError(message);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const response = await apiFetch<{ data: Task }>(`/api/tasks/${id}/toggle`, {
        method: 'PATCH',
        token: accessToken!,
      });
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar tarefa';
      setError(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      await apiFetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        token: accessToken!,
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir tarefa';
      setError(message);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <TaskForm
              task={editingTask || undefined}
              onSubmit={editingTask ? handleUpdate : handleCreate}
              onCancel={editingTask ? () => setEditingTask(null) : undefined}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h2>
            <span className="text-sm text-gray-600">
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
            </span>
          </div>

          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

          {isLoading ? (
            <Spinner />
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={setEditingTask}
            />
          )}
        </div>
      </main>
    </div>
  );
}
