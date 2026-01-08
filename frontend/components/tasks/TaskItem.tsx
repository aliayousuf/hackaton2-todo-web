'use client';

import { useState } from 'react';
import type { Task } from '@/types/task';
import { updateTaskPartial, deleteTask } from '@/lib/api';
import { TrashIcon, PencilIcon, CheckIcon, XCircleIcon } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);

  const toggleCompletion = async () => {
    setLoading(true);
    try {
      const result = await updateTaskPartial(task.id, {
        completed: !task.completed,
      });
      if (result.success && result.data) {
        onUpdate(result.data);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const result = await updateTaskPartial(task.id, {
        title: editTitle,
        description: editDescription,
      });
      if (result.success && result.data) {
        onUpdate(result.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteTask(task.id);
      if (result.success) {
        onDelete(task.id);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className={`${task.completed ? 'bg-pink-50 text-pink-600' : 'bg-white'} rounded-2xl shadow-sm border border-slate-100 p-6 mb-4 hover:border-pink-200`}>
      {task.completed && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-700">
            Completed
          </span>
        </div>
      )}

      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={toggleCompletion}
            disabled={loading}
            className="h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
          />
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-base w-full text-lg font-medium"
                placeholder="Task title..."
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-base w-full"
                rows={3}
                placeholder="Task description..."
              />
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className={`text-lg font-medium break-words ${task.completed ? 'text-indigo-600 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-base break-words ${task.completed ? 'text-indigo-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span className="font-normal">Created:</span>
              <span>{new Date(task.created_at).toLocaleDateString()}</span>
            </div>
            {task.updated_at !== task.created_at && (
              <div className="flex items-center gap-1">
                <span className="font-normal">Updated:</span>
                <span>{new Date(task.updated_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              disabled={loading}
              className="btn-primary flex items-center gap-1 px-3 py-1.5 text-sm"
            >
              <CheckIcon className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditTitle(task.title);
                setEditDescription(task.description || '');
              }}
              disabled={loading}
              className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-sm"
            >
              <XCircleIcon className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-sm"
              title="Edit task"
            >
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Edit</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || isDeleting}
              className="btn-destructive flex items-center gap-1 px-3 py-1.5 text-sm"
              title="Delete task"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}