import { test, expect } from '@playwright/test';

test.describe('Todo App End-to-End Tests', () => {
  test('should allow a user to register, login, create, update, and delete tasks', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');

    // Navigate to registration page
    await page.getByRole('link', { name: 'Register' }).click();

    // Fill in registration form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify registration success and redirect to login
    await expect(page).toHaveURL(/.*login/);

    // Login with the new account
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify login and redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText('My Tasks')).toBeVisible();

    // Create a new task
    await page.getByRole('button', { name: 'Create Task' }).click();
    await page.getByLabel('Title *').fill('Test Task');
    await page.getByLabel('Description').fill('This is a test task');
    await page.getByRole('button', { name: 'Create Task' }).click();

    // Verify task was created
    await expect(page.getByText('Test Task')).toBeVisible();

    // Update the task (mark as complete)
    const taskCheckbox = page.locator('input[type="checkbox"]').first();
    await taskCheckbox.check();

    // Verify task is marked as complete
    await expect(page.getByText('Test Task')).toHaveClass(/line-through/);

    // Delete the task
    const deleteButton = page.locator('button').filter({ hasText: 'Delete' }).first();
    await deleteButton.click();

    // Confirm deletion
    await page.on('dialog', dialog => dialog.accept());

    // Verify task is deleted
    await expect(page.getByText('Test Task')).not.toBeVisible();
  });
});