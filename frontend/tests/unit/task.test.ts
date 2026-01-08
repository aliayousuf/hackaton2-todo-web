import type { Task } from '@/types/task';

describe('Task Type', () => {
  it('should have the correct properties', () => {
    const task: Task = {
      id: 1,
      user_id: 'user-uuid',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      created_at: '2026-01-06T00:00:00Z',
      updated_at: '2026-01-06T00:00:00Z',
    };

    expect(task.id).toBe(1);
    expect(task.user_id).toBe('user-uuid');
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Test Description');
    expect(task.completed).toBe(false);
    expect(task.created_at).toBe('2026-01-06T00:00:00Z');
    expect(task.updated_at).toBe('2026-01-06T00:00:00Z');
  });

  it('should allow optional description', () => {
    const task: Task = {
      id: 1,
      user_id: 'user-uuid',
      title: 'Test Task',
      completed: true,
      created_at: '2026-01-06T00:00:00Z',
      updated_at: '2026-01-06T00:00:00Z',
    };

    expect(task.description).toBeUndefined();
    expect(task.completed).toBe(true);
  });
});