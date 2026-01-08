import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import type { Task } from '@/types/task';
import { getTasks } from '@/lib/api';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the API functions
jest.mock('@/lib/api', () => ({
  getTasks: jest.fn(),
}));

// Mock the TaskList and CreateTaskForm components
jest.mock('@/components/tasks/TaskList', () => ({
  TaskList: ({ tasks, error }: { tasks: Task[]; error?: string | null }) => {
    if (error) {
      return (
        <div data-testid="error-message">
          <h3>{error}</h3>
        </div>
      );
    }
    return (
      <div data-testid="task-list">
        {tasks.map(task => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            {task.title}
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock('@/components/tasks/CreateTaskForm', () => ({
  CreateTaskForm: () => <div data-testid="create-task-form">Create Task Form</div>,
}));

describe('Dashboard Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dashboard with tasks', async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        user_id: 'user-uuid',
        title: 'Test Task 1',
        description: 'Test Description 1',
        completed: false,
        created_at: '2026-01-06T00:00:00Z',
        updated_at: '2026-01-06T00:00:00Z',
      },
      {
        id: 2,
        user_id: 'user-uuid',
        title: 'Test Task 2',
        description: 'Test Description 2',
        completed: true,
        created_at: '2026-01-06T00:00:00Z',
        updated_at: '2026-01-06T00:00:00Z',
      },
    ];

    (getTasks as jest.MockedFunction<typeof getTasks>).mockResolvedValue({
      success: true,
      data: mockTasks,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    render(<DashboardPage />, { wrapper });

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByTestId('task-list')).toBeInTheDocument();
    });

    // Check that tasks are rendered
    expect(screen.getByTestId('task-1')).toHaveTextContent('Test Task 1');
    expect(screen.getByTestId('task-2')).toHaveTextContent('Test Task 2');
  });

  it('should handle error state', async () => {
    (getTasks as jest.MockedFunction<typeof getTasks>).mockResolvedValue({
      success: false,
      error: 'Failed to load tasks',
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    render(<DashboardPage />, { wrapper });

    // Wait for error to be displayed in the TaskList component
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    // Verify that the error message is displayed
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
  });

  it('should render create task form when button is clicked', async () => {
    (getTasks as jest.MockedFunction<typeof getTasks>).mockResolvedValue({
      success: true,
      data: [],
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    render(<DashboardPage />, { wrapper });

    // Wait for initial render to complete
    await waitFor(() => {
      expect(screen.getByText('My Tasks')).toBeInTheDocument();
    });

    // Click the "Create Task" button
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    // Check that the form is now visible
    await waitFor(() => {
      expect(screen.getByTestId('create-task-form')).toBeInTheDocument();
    });
  });
});