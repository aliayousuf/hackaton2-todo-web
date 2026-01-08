import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api';

// Mock the fetch API
global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  describe('getTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        {
          id: 1,
          user_id: 'user-uuid',
          title: 'Test Task',
          description: 'Test Description',
          completed: false,
          created_at: '2026-01-06T00:00:00Z',
          updated_at: '2026-01-06T00:00:00Z',
        }
      ];

      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTasks }),
      } as Response);

      const result = await getTasks();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTasks);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tasks'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
          }),
        })
      );
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Network error'));

      const result = await getTasks();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error. Please try again.');
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const newTask = {
        id: 2,
        user_id: 'user-uuid',
        title: 'New Task',
        description: 'New Description',
        completed: false,
        created_at: '2026-01-06T00:00:00Z',
        updated_at: '2026-01-06T00:00:00Z',
      };

      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => newTask,
      } as Response);

      const result = await createTask('New Task', 'New Description');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(newTask);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tasks'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'New Task', description: 'New Description' }),
        })
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updatedTask = {
        id: 1,
        user_id: 'user-uuid',
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
        created_at: '2026-01-06T00:00:00Z',
        updated_at: '2026-01-06T00:00:00Z',
      };

      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTask,
      } as Response);

      const result = await updateTask(1, { title: 'Updated Task', completed: true });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const result = await deleteTask(1);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tasks/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});