import { motion } from 'framer-motion';
import { Plus, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { useReducedMotion } from '@/lib/accessibility';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
}

interface DashboardLayoutProps {
  stats: DashboardStats;
  children: React.ReactNode;
  onCreateTask: () => void;
}

export function DashboardLayout({ stats, children, onCreateTask }: DashboardLayoutProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6"
      role="main"
      aria-label="Task dashboard"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words"
              id="dashboard-title"
            >
              My Tasks
            </h1>
            <p
              className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed break-words"
              id="dashboard-description"
            >
              Manage your tasks efficiently
            </p>
          </div>
          <motion.button
            whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
            whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            onClick={onCreateTask}
            className="btn-primary min-w-[140px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-describedby="dashboard-description"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </motion.button>
        </motion.div>

        {/* Bento Grid Layout */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          role="region"
          aria-labelledby="stats-heading"
        >
          <h2 id="stats-heading" className="sr-only">Task Statistics</h2>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={!prefersReducedMotion ? { delay: 0.1 } : {}}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white border-opacity-10 flex flex-col"
            role="article"
            aria-labelledby="total-tasks-label"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500 bg-opacity-20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-indigo-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white"
                id="total-tasks-label"
              >
                Total Tasks
              </h3>
            </div>
            <p className="text-3xl font-bold text-indigo-400" aria-label="Total tasks count">
              {stats.totalTasks}
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={!prefersReducedMotion ? { delay: 0.2 } : {}}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white border-opacity-10 flex flex-col"
            role="article"
            aria-labelledby="completed-label"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white"
                id="completed-label"
              >
                Completed
              </h3>
            </div>
            <p className="text-3xl font-bold text-green-400" aria-label="Completed tasks count">
              {stats.completedTasks}
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={!prefersReducedMotion ? { delay: 0.3 } : {}}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white border-opacity-10 flex flex-col"
            role="article"
            aria-labelledby="overdue-label"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white"
                id="overdue-label"
              >
                Overdue
              </h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400" aria-label="Overdue tasks count">
              {stats.overdueTasks}
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={!prefersReducedMotion ? { delay: 0.4 } : {}}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white border-opacity-10 flex flex-col"
            role="article"
            aria-labelledby="upcoming-label"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white"
                id="upcoming-label"
              >
                Upcoming
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-400" aria-label="Upcoming tasks count">
              {stats.upcomingTasks}
            </p>
          </motion.div>
        </div>

        {/* Task List Container */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={!prefersReducedMotion ? { delay: 0.5 } : {}}
          className="glass-card rounded-xl backdrop-blur-md border border-white border-opacity-10 p-1"
          role="region"
          aria-labelledby="task-list-heading"
        >
          <h2 id="task-list-heading" className="sr-only">Task List</h2>
          {children}
        </motion.div>
      </div>
    </div>
  );
}