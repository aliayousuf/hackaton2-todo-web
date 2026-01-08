/**
 * API client for the Todo application.
 * Provides functions to interact with the backend API endpoints.
 */

import type { Task } from '@/types/task';
import type { User } from '@/types/user';

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Default headers for API requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Register a new user
 */
export async function registerUser(email: string, password: string): Promise<{ success: boolean; data?: User | undefined; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the access token in localStorage if provided (some APIs return token after registration)
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      // Ensure the user data matches the User interface
      if (data && data.id && data.email) {
        const userData: User = {
          id: data.id || '',
          email: data.email || '',
          created_at: data.created_at || '',
          updated_at: data.updated_at || '',
        };
        return { success: true, data: userData };
      } else {
        return { success: true, data: undefined };
      }
    } else {
      return { success: false, error: data.detail || 'Registration failed' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<{ success: boolean; access_token?: string; user?: User | undefined; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the access token in localStorage for future API calls
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      // Ensure the user data matches the User interface
      if (data.user && data.user.id && data.user.email) {
        const user: User = {
          id: data.user.id || '',
          email: data.user.email || '',
          created_at: data.user.created_at || '',
          updated_at: data.user.updated_at || '',
        };
        return { success: true, access_token: data.access_token, user };
      } else {
        return { success: true, access_token: data.access_token, user: undefined };
      }
    } else {
      return { success: false, error: data.detail || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Get all tasks for the authenticated user
 */
export async function getTasks(): Promise<{ success: boolean; data?: Task[]; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'GET',
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data.data || data }; // Handle both formats
    } else {
      return { success: false, error: data.detail || 'Failed to fetch tasks' };
    }
  } catch (error) {
    console.error('Get tasks error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Create a new task
 */
export async function createTask(title: string, description?: string): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.detail || 'Failed to create task' };
    }
  } catch (error) {
    console.error('Create task error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Update a task
 */
export async function updateTask(taskId: number, updates: Partial<Task>): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT', // Using PUT for full updates
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.detail || 'Failed to update task' };
    }
  } catch (error) {
    console.error('Update task error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Update a task partially (for toggling completion)
 */
export async function updateTaskPartial(taskId: number, updates: Partial<Task>): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PATCH', // Using PATCH for partial updates
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.detail || 'Failed to update task' };
    }
  } catch (error) {
    console.error('Update task error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.detail || 'Failed to delete task' };
    }
  } catch (error) {
    console.error('Delete task error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Get a specific task
 */
export async function getTask(taskId: number): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.detail || 'Failed to fetch task' };
    }
  } catch (error) {
    console.error('Get task error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}