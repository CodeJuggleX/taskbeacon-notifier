
import { Task } from "@/types/task";

// API base URL from the provided backend
const API_BASE_URL = "http://192.168.38.236:8000/api/v1";

export const TasksApi = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    console.log("Fetching all tasks from API");
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/`, {
        // Adding CORS mode to try to resolve cross-origin issues
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Successfully fetched tasks:", data);
      
      // Transform API data to match our Task interface
      return data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        description: item.description || "",
        status: mapStatusFromApi(item.status),
        priority: mapPriorityFromApi(item.priority),
        assignee: item.assignee || "Не назначено",
        deadline: new Date(item.due_date || Date.now()),
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  // Create a new task
  createTask: async (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    console.log("Creating new task:", task);
    
    // Transform our task to match API expectations
    const apiTask = {
      title: task.title,
      description: task.description,
      status: mapStatusToApi(task.status),
      priority: mapPriorityToApi(task.priority),
      assignee: task.assignee,
      due_date: task.deadline.toISOString(),
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/`, {
        method: "POST",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiTask),
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Task created successfully:", data);
      
      // Transform response back to our Task interface
      return {
        id: data.id.toString(),
        title: data.title,
        description: data.description || "",
        status: mapStatusFromApi(data.status),
        priority: mapPriorityFromApi(data.priority),
        assignee: data.assignee || "Не назначено",
        deadline: new Date(data.due_date || Date.now()),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  // Update an existing task
  updateTask: async (taskId: string, task: Partial<Task>): Promise<Task> => {
    console.log("Updating task:", taskId, task);
    
    // Transform our task update to match API expectations
    const apiTaskUpdate: any = {};
    
    if (task.title !== undefined) apiTaskUpdate.title = task.title;
    if (task.description !== undefined) apiTaskUpdate.description = task.description;
    if (task.status !== undefined) apiTaskUpdate.status = mapStatusToApi(task.status);
    if (task.priority !== undefined) apiTaskUpdate.priority = mapPriorityToApi(task.priority);
    if (task.assignee !== undefined) apiTaskUpdate.assignee = task.assignee;
    if (task.deadline !== undefined) apiTaskUpdate.due_date = task.deadline.toISOString();
    
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/${taskId}/`, {
        method: "PATCH",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiTaskUpdate),
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Task updated successfully:", data);
      
      // Transform response back to our Task interface
      return {
        id: data.id.toString(),
        title: data.title,
        description: data.description || "",
        status: mapStatusFromApi(data.status),
        priority: mapPriorityFromApi(data.priority),
        assignee: data.assignee || "Не назначено",
        deadline: new Date(data.due_date || Date.now()),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error(`Failed to update task: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    console.log("Deleting task:", taskId);
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/${taskId}/`, {
        method: "DELETE",
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

// Helper functions to map between our app's status/priority and the API's
function mapStatusFromApi(apiStatus: string): Task["status"] {
  switch (apiStatus.toLowerCase()) {
    case "pending":
    case "new":
      return "pending";
    case "in_progress":
    case "in progress":
      return "in-progress";
    case "completed":
    case "done":
      return "completed";
    default:
      return "pending";
  }
}

function mapStatusToApi(status: Task["status"]): string {
  switch (status) {
    case "pending":
      return "PENDING";
    case "in-progress":
      return "IN_PROGRESS";
    case "completed":
      return "COMPLETED";
    default:
      return "PENDING";
  }
}

function mapPriorityFromApi(apiPriority: string): Task["priority"] {
  switch (apiPriority?.toLowerCase()) {
    case "low":
      return "low";
    case "medium":
    case "normal":
      return "medium";
    case "high":
    case "urgent":
      return "high";
    default:
      return "medium";
  }
}

function mapPriorityToApi(priority: Task["priority"]): string {
  switch (priority) {
    case "low":
      return "LOW";
    case "medium":
      return "MEDIUM";
    case "high":
      return "HIGH";
    default:
      return "MEDIUM";
  }
}
