'use client';

import { useState, useEffect, useOptimistic, startTransition } from 'react';
import { EnhancedTaskList } from '@/components/tasks/EnhancedTaskList';
import { EnhancedCreateTaskForm } from '@/components/tasks/EnhancedCreateTaskForm';
import { EnhancedEmptyState } from '@/components/tasks/EnhancedEmptyState';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Task } from '@/types/task';
import { getTasks, updateTaskPartial } from '@/lib/api';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, TrendingUp, FileText } from 'lucide-react';

export default function DashboardPage() {
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
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    upcomingTasks: 0
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks();
        if (response.success) {
          const tasksData = response.data || [];
          setTasks(tasksData);

          // Calculate stats
          const completed = tasksData.filter(t => t.completed).length;
          const total = tasksData.length;

          setStats({
            totalTasks: total,
            completedTasks: completed,
            overdueTasks: 0, // Calculate based on due dates if available
            upcomingTasks: total - completed
          });
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

    // Recalculate stats
    setStats(prev => ({
      ...prev,
      totalTasks: prev.totalTasks + 1,
      upcomingTasks: prev.upcomingTasks + 1
    }));
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (deletedTaskId: number) => {
    setTasks(tasks.filter(task => task.id !== deletedTaskId));

    // Recalculate stats
    const deletedTask = tasks.find(task => task.id === deletedTaskId);
    if (deletedTask) {
      setStats(prev => ({
        ...prev,
        totalTasks: prev.totalTasks - 1,
        completedTasks: deletedTask.completed ? prev.completedTasks - 1 : prev.completedTasks,
        upcomingTasks: !deletedTask.completed ? prev.upcomingTasks - 1 : prev.upcomingTasks
      }));
    }
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

        // Recalculate stats
        setStats(prev => ({
          ...prev,
          completedTasks: !task.completed ? prev.completedTasks + 1 : prev.completedTasks - 1,
          upcomingTasks: !task.completed ? prev.upcomingTasks - 1 : prev.upcomingTasks + 1
        }));
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
    <div className="min-h-screen bg-[#0F172A] pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 break-words mb-2">Dashboard</h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed break-words">Manage your tasks efficiently</p>
          </div>
          <button
            onClick={handleCreateTask}
            className="min-w-[160px] bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl flex items-center justify-center gap-2 text-sm"
          >
            <FileText className="h-5 w-5 text-white" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Bento Stats Grid - Responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Tasks Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 flex flex-col items-center justify-center text-center"
          >
            <div className="p-4 bg-indigo-500/20 rounded-2xl mb-3">
              <FileText className="h-7 w-7 text-indigo-300" />
            </div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">Total</h3>
            <p className="text-4xl font-bold text-indigo-400">{stats.totalTasks}</p>
          </motion.div>

          {/* Completed Tasks Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 flex flex-col items-center justify-center text-center"
          >
            <div className="p-4 bg-green-500/20 rounded-2xl mb-3">
              <CheckCircle className="h-7 w-7 text-green-300" />
            </div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">Completed</h3>
            <p className="text-4xl font-bold text-green-400">{stats.completedTasks}</p>
          </motion.div>

          {/* Overdue Tasks Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 flex flex-col items-center justify-center text-center"
          >
            <div className="p-4 bg-red-500/20 rounded-2xl mb-3">
              <Calendar className="h-7 w-7 text-red-300" />
            </div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">Overdue</h3>
            <p className="text-4xl font-bold text-red-400">{stats.overdueTasks}</p>
          </motion.div>

          {/* Upcoming Tasks Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5 flex flex-col items-center justify-center text-center"
          >
            <div className="p-4 bg-blue-500/20 rounded-2xl mb-3">
              <TrendingUp className="h-7 w-7 text-blue-300" />
            </div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">Upcoming</h3>
            <p className="text-4xl font-bold text-blue-400">{stats.upcomingTasks}</p>
          </motion.div>
        </div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5"
        >
          {/* Desktop Create Task Form */}
          {showCreateForm && (
            <div className="glass-card mb-6 p-6">
              <h2 className="text-2xl font-semibold text-slate-100 mb-6 break-words">Create New Task</h2>
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