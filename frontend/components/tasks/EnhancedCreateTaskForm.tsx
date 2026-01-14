'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/types/task';
import { createTask } from '@/lib/api';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

// Define the validation schema using Zod
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional().or(z.literal('')),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface EnhancedCreateTaskFormProps {
  onTaskCreated: (task: Task) => void;
  onError: (error: string) => void;
}

export function EnhancedCreateTaskForm({ onTaskCreated, onError }: EnhancedCreateTaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    setIsLoading(true);
    try {
      const result = await createTask(data.title, data.description || undefined);
      if (result.success) {
        if (result.data) {
          onTaskCreated(result.data);
        }
        reset(); // Clear the form after successful submission
      } else {
        onError(result.error || 'Failed to create task');
      }
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.status === 401) {
        onError('You must be logged in to create a task');
      } else {
        onError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
          Title *
        </label>
        <Input
          id="title"
          className={`input-base w-full bg-slate-700 bg-opacity-50 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-slate-400 ${errors.title ? 'border-rose-500' : ''}`}
          disabled={isLoading}
          placeholder="Enter task title..."
          {...register('title')}
        />
        {errors.title && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-1 text-sm text-rose-400 break-words"
          >
            {errors.title.message}
          </motion.p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <Textarea
          id="description"
          className={`input-base w-full bg-slate-700 bg-opacity-50 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-slate-400 ${errors.description ? 'border-rose-500' : ''}`}
          disabled={isLoading}
          placeholder="Enter task description..."
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-1 text-sm text-rose-400 break-words"
          >
            {errors.description.message}
          </motion.p>
        )}
      </div>

      <motion.button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4" />
            <span>Creating task...</span>
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Create Task</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
}