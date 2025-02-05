import { Task } from "@/types/task";

// API endpoints for tasks
const API_BASE_URL = "/api"; // Replace with your actual API base URL

export const TasksApi = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    console.log("Fetching all tasks");
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return response.json();
  },

  // Create a new task
  createTask: async (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    console.log("Creating new task:", task);
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    return response.json();
  },

  // Update an existing task
  updateTask: async (taskId: string, task: Partial<Task>): Promise<Task> => {
    console.log("Updating task:", taskId, task);
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    return response.json();
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    console.log("Deleting task:", taskId);
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  },
};