import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface EmptyStateProps {
  onCreateTask?: () => void;
}

export function EnhancedEmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 bg-opacity-20 mb-4"
      >
        <CheckCircle className="h-8 w-8 text-indigo-400" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-2 text-xl sm:text-2xl font-bold text-white break-words"
      >
        All Caught Up!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-2 text-slate-400 max-w-md mx-auto leading-relaxed break-words"
      >
        You have completed all your tasks. Take a moment to celebrate your productivity!
      </motion.p>

      {onCreateTask && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateTask}
            className="btn-primary mx-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-6 rounded-lg text-sm font-medium transition-colors"
          >
            Create New Task
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}