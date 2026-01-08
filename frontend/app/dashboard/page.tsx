'use client';

import { useState, useEffect } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import type { Task } from '@/types/task';
import { getTasks } from '@/lib/api';

export default function DashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks();
        if (response.success) {
          setTasks(response.data || []);
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

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]); // Add new task to the top of the list
    setShowCreateForm(false); // Hide the form after successful creation
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (deletedTaskId: number) => {
    setTasks(tasks.filter(task => task.id !== deletedTaskId));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 break-words">My Tasks</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed break-words">Manage your tasks efficiently</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary min-w-[140px]"
        >
          {showCreateForm ? 'Cancel' : 'Create Task'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 break-words">Create New Task</h2>
            <CreateTaskForm
              onTaskCreated={handleTaskCreated}
              onError={(error) => {
                // Handle error appropriately, maybe show in UI
                console.error('Error creating task:', error);
              }}
            />
          </div>
        </div>
      )}

      <div className="card">
        <div className="p-6 sm:p-8">
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onTaskUpdate={handleTaskUpdated}
            onTaskDelete={handleTaskDeleted}
            onCreateTask={() => setShowCreateForm(true)}
          />
        </div>
      </div>
    </div>
  );
}