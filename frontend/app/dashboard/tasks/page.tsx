'use client';

import { useState, useEffect, useOptimistic, startTransition } from 'react';
import { EnhancedTaskList } from '@/components/tasks/EnhancedTaskList';
import { EnhancedCreateTaskForm } from '@/components/tasks/EnhancedCreateTaskForm';
import { EnhancedEmptyState } from '@/components/tasks/EnhancedEmptyState';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Task } from '@/types/task';
import { getTasks, updateTaskPartial } from '@/lib/api';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TasksPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(tasks, (state, { taskId, completed }) => {
    return state.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks();
        if (response.success) {
          const tasksData = response.data || [];
          setTasks(tasksData.filter(task => !task.completed)); // Only show incomplete tasks
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
    setTasks([newTask, ...tasks]);
    setShowCreateForm(false);
    setShowBottomSheet(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (deletedTaskId: number) => {
    setTasks(tasks.filter(task => task.id !== deletedTaskId));
  };

  const handleTaskToggle = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistic update wrapped in startTransition
    startTransition(() => {
      setOptimisticTasks({ taskId, completed: !task.completed });
    });

    try {
      const response = await updateTaskPartial(taskId, { completed: !task.completed });
      if (response.success && response.data) {
        setTasks(tasks.map(t => t.id === taskId ? response.data! : t));
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // If the API call fails, revert the optimistic update
      startTransition(() => {
        setOptimisticTasks({ taskId, completed: task.completed });
      });
    }
  };

  const handleCreateTask = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setShowBottomSheet(true);
    } else {
      setShowCreateForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        {/* Tasks Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 break-words">My Tasks</h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed break-words">Manage your active tasks efficiently</p>
          </div>
          <button
            onClick={handleCreateTask}
            className="min-w-[140px] bg-indigo-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mx-8"
        >
          {/* Desktop Create Task Form */}
          {showCreateForm && (
            <div className="glass-card mb-6 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-6 break-words">Create New Task</h2>
              <EnhancedCreateTaskForm
                onTaskCreated={handleTaskCreated}
                onError={(error) => {
                  console.error('Error creating task:', error);
                }}
              />
            </div>
          )}

          <EnhancedTaskList
            tasks={optimisticTasks}
            loading={loading}
            error={error}
            onTaskUpdate={handleTaskUpdated}
            onTaskDelete={handleTaskDeleted}
            onTaskToggle={handleTaskToggle}
            onCreateTask={handleCreateTask}
          />

          {/* Mobile Bottom Sheet for Task Creation */}
          <BottomSheet
            isOpen={showBottomSheet}
            onClose={() => setShowBottomSheet(false)}
          >
            <EnhancedCreateTaskForm
              onTaskCreated={handleTaskCreated}
              onError={(error) => {
                console.error('Error creating task:', error);
              }}
            />
          </BottomSheet>
        </motion.div>
      </div>
    </div>
  );
}