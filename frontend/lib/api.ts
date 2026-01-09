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

    // Log response status for debugging
    console.log(`Registration response status: ${response.status}`);

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Registration response data:', data);
    } else {
      // If not JSON, try to get text response for debugging
      try {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);

        // Check if it's an internal server error
        if (textResponse.toLowerCase().includes('internal server error')) {
          return { success: false, error: 'Server error: Backend application is experiencing issues. Please contact administrator.' };
        }

        return { success: false, error: 'Server error: Unexpected response format' };
      } catch (textError) {
        console.error('Error reading text response:', textError);
        return { success: false, error: 'Server error: Unable to read server response' };
      }
    }

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
      return { success: false, error: data.detail || data.message || `Registration failed (${response.status})` };
    }
  } catch (error) {
    console.error('Registration error:', error);

    // Handle network errors specifically
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { success: false, error: 'Network error: Unable to reach the server. Please check your connection.' };
    }

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

    // Log response status for debugging
    console.log(`Login response status: ${response.status}`);

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Login response data:', data);
    } else {
      // If not JSON, try to get text response for debugging
      try {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);

        // Check if it's an internal server error
        if (textResponse.toLowerCase().includes('internal server error')) {
          return { success: false, error: 'Server error: Backend application is experiencing issues. Please contact administrator.' };
        }

        return { success: false, error: 'Server error: Unexpected response format' };
      } catch (textError) {
        console.error('Error reading text response:', textError);
        return { success: false, error: 'Server error: Unable to read server response' };
      }
    }

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
      return { success: false, error: data.detail || data.message || `Login failed (${response.status})` };
    }
  } catch (error) {
    console.error('Login error:', error);

    // Handle network errors specifically
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { success: false, error: 'Network error: Unable to reach the server. Please check your connection.' };
    }

    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Get all tasks for the authenticated user
 */
export async function getTasks(): Promise<{ success: boolean; data?: Task[]; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');

    // Log for debugging
    console.log('Fetching tasks with token:', token ? 'present' : 'missing');
    console.log('Full API URL:', `${API_BASE_URL}/api/tasks/`);
    console.log('Token value:', token);

    if (!token || token.trim() === '') {
      return { success: false, error: 'Authentication required. Please log in first.' };
    }

    // Clean the token by removing any potential whitespace
    const cleanToken = token.trim();

    // Log the actual header being sent
    const headers = {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${cleanToken}`,
    };
    console.log('Request headers:', headers);

    const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
      method: 'GET',
      headers: headers,
    });

    // Log response status for debugging
    console.log(`Get tasks response status: ${response.status}`);
    console.log(`Response redirected: ${response.redirected}`);
    if (response.redirected) {
      console.log(`Redirected to: ${response.url}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);

    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get tasks response data:', data);

      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
    } else {
      // If not JSON, try to get text response for debugging
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);

      // Check if it's an internal server error
      if (textResponse.toLowerCase().includes('internal server error')) {
        return { success: false, error: 'Server error: Backend application is experiencing issues. Please contact administrator.' };
      }

      return { success: false, error: 'Server error: Unexpected response format' };
    }

    if (response.ok) {
      return { success: true, data: data.data || data }; // Handle both formats
    } else {
      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
      return { success: false, error: data.detail || data.message || `Failed to fetch tasks (${response.status})` };
    }
  } catch (error) {
    console.error('Get tasks error details:', error);
    console.error('Error name:', (error as any).name);
    console.error('Error message:', (error as any).message);

    // Handle network errors specifically
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('failed'))) {
      return { success: false, error: `Network error: Unable to reach the server. Backend URL: ${API_BASE_URL}. Please check your connection.` };
    }

    return { success: false, error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.` };
  }
}

/**
 * Create a new task
 */
export async function createTask(title: string, description?: string): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || token.trim() === '') {
      return { success: false, error: 'Authentication required. Please log in first.' };
    }

    // Clean the token by removing any potential whitespace
    const cleanToken = token.trim();

    const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${cleanToken}`,
      },
      body: JSON.stringify({ title, description }),
    });

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();

      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
    } else {
      // If not JSON, try to get text response for debugging
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);

      // Check if it's an internal server error
      if (textResponse.toLowerCase().includes('internal server error')) {
        return { success: false, error: 'Server error: Backend application is experiencing issues. Please contact administrator.' };
      }

      return { success: false, error: 'Server error: Unexpected response format' };
    }

    if (response.ok) {
      return { success: true, data };
    } else {
      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
      return { success: false, error: data.detail || data.message || `Failed to create task (${response.status})` };
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

    if (!token || token.trim() === '') {
      return { success: false, error: 'Authentication required. Please log in first.' };
    }

    // Clean the token by removing any potential whitespace
    const cleanToken = token.trim();

    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT', // Using PUT for full updates
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(updates),
    });

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();

      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
    } else {
      // If not JSON, try to get text response for debugging
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);

      // Check if it's an internal server error
      if (textResponse.toLowerCase().includes('internal server error')) {
        return { success: false, error: 'Server error: Backend application is experiencing issues. Please contact administrator.' };
      }

      return { success: false, error: 'Server error: Unexpected response format' };
    }

    if (response.ok) {
      return { success: true, data };
    } else {
      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
      return { success: false, error: data.detail || data.message || `Failed to update task (${response.status})` };
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

    if (!token || token.trim() === '') {
      return { success: false, error: 'Authentication required. Please log in first.' };
    }

    // Clean the token by removing any potential whitespace
    const cleanToken = token.trim();

    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PATCH', // Using PATCH for partial updates
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(updates),
    });

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();

      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
    } else {
      // If not JSON, try to get text response for debugging
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);

      // Check if it's an internal server error
      if (textResponse.toLowerCase().includes('internal server error')) {
        return { success: false, error: 'Server error: Backend application is experiencing issues. Please contact administrator.' };
      }

      return { success: false, error: 'Server error: Unexpected response format' };
    }

    if (response.ok) {
      return { success: true, data };
    } else {
      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
      return { success: false, error: data.detail || data.message || `Failed to update task (${response.status})` };
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

    if (!token || token.trim() === '') {
      return { success: false, error: 'Authentication required. Please log in first.' };
    }

    // Clean the token by removing any potential whitespace
    const cleanToken = token.trim();

    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
      },
    });

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();

      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
    } else {
      // If not JSON, try to get text response for debugging
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);

      // Check if it's an internal server error
      if (textResponse.toLowerCase().includes('internal server error')) {
        return { success: false, error: 'Server error: Backend application is experiencing issues. Please contact administrator.' };
      }

      return { success: false, error: 'Server error: Unexpected response format' };
    }

    if (response.ok) {
      return { success: true };
    } else {
      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
      return { success: false, error: data.detail || data.message || `Failed to delete task (${response.status})` };
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

    if (!token || token.trim() === '') {
      return { success: false, error: 'Authentication required. Please log in first.' };
    }

    // Clean the token by removing any potential whitespace
    const cleanToken = token.trim();

    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
      },
    });

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();

      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
    } else {
      // If not JSON, try to get text response for debugging
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);

      // Check if it's an internal server error
      if (textResponse.toLowerCase().includes('internal server error')) {
        return { success: false, error: 'Server error: Backend application is experiencing issues. Please contact administrator.' };
      }

      return { success: false, error: 'Server error: Unexpected response format' };
    }

    if (response.ok) {
      return { success: true, data };
    } else {
      // If we get a 401 or 403, it means the token is invalid/expired
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token'); // Clear invalid token
        return { success: false, error: 'Authentication expired. Please log in again.' };
      }
      return { success: false, error: data.detail || data.message || `Failed to fetch task (${response.status})` };
    }
  } catch (error) {
    console.error('Get task error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}