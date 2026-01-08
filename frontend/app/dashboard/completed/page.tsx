'use client';

import { useState, useEffect } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import type { Task } from '@/types/task';
import { getTasks } from '@/lib/api';

export default function CompletedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks();
        if (response.success) {
          // Filter to show only completed tasks
          const completedTasks = (response.data || []).filter(task => task.completed);
          setTasks(completedTasks);
        } else {
          setError(response.error || 'Failed to load tasks');
        }
      } catch (err) {
        setError('An error occurred while loading tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (deletedTaskId: number) => {
    setTasks(tasks.filter(task => task.id !== deletedTaskId));
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 break-words">Completed Tasks</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed break-words">Tasks you have completed</p>
      </div>

      <div className="card">
        <div className="p-6 sm:p-8">
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onTaskUpdate={handleTaskUpdated}
            onTaskDelete={handleTaskDeleted}
            showOnlyCompleted={true}
            onCreateTask={() => window.location.href = '/dashboard'}
          />
        </div>
      </div>
    </div>
  );
}