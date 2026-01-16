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

// Define the validation schema using Zod
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional().or(z.literal('')),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskFormProps {
  onTaskCreated: (task: Task) => void;
  onError: (error: string) => void;
}

export function CreateTaskForm({ onTaskCreated, onError }: CreateTaskFormProps) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-blue-700 mb-2">
          Title *
        </label>
        <Input
          id="title"
          className={`input-base ${errors.title ? 'input-error' : ''}`}
          disabled={isLoading}
          placeholder="Enter task title..."
          {...register('title')}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 break-words">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-blue-700 mb-2">
          Description
        </label>
        <Textarea
          id="description"
          className={`input-base ${errors.description ? 'input-error' : ''}`}
          disabled={isLoading}
          placeholder="Enter task description..."
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 break-words">{errors.description.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating task...
          </span>
        ) : (
          'Create Task'
        )}
      </Button>
    </form>
  );
}