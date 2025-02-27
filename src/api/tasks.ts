
import { Task, TransformedTask } from "@/types/task";

// API endpoints for tasks
const API_BASE_URL = "http://192.168.38.236:8000/api/v1"; 

export const TasksApi = {
  // Get all tasks
  getAllTasks: async (): Promise<TransformedTask[]> => {
    console.log("Fetching all tasks");
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/`, {
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
      console.log("API response data:", data);
      
      // Transform API data to match our Task interface
      return data.map((item: any) => ({
        id: item.id ? item.id.toString() : crypto.randomUUID(),
        title: item.task_name,
        description: item.description || "",
        status: mapStatusFromApi(item.task_status),
        priority: mapPriorityFromApi(item.task_priority),
        assignee: item.employee_info ? item.employee_info.full_name : "Не назначено",
        deadline: new Date(item.deadline),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  // Create a new task
  createTask: async (task: Omit<TransformedTask, "id" | "createdAt" | "updatedAt">): Promise<TransformedTask> => {
    console.log("Creating new task:", task);
    
    // Transform our task to match API expectations
    const apiTask = {
      task_name: task.title,
      description: task.description,
      task_status: mapStatusToApi(task.status),
      task_priority: mapPriorityToApi(task.priority),
      comment: "",
      deadline: task.deadline.toISOString(),
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(apiTask),
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Task created successfully:", data);
      
      // Transform the API response to our TransformedTask format
      return {
        id: data.id ? data.id.toString() : crypto.randomUUID(),
        title: data.task_name,
        description: data.description || "",
        status: mapStatusFromApi(data.task_status),
        priority: mapPriorityFromApi(data.task_priority),
        assignee: data.employee_info ? data.employee_info.full_name : "Не назначено",
        deadline: new Date(data.deadline),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  // Update an existing task
  updateTask: async (taskId: string, task: Partial<TransformedTask>): Promise<TransformedTask> => {
    console.log("Updating task:", taskId, task);
    
    // Transform our task update to match API expectations
    const apiTaskUpdate: any = {};
    
    if (task.title !== undefined) apiTaskUpdate.task_name = task.title;
    if (task.description !== undefined) apiTaskUpdate.description = task.description;
    if (task.status !== undefined) apiTaskUpdate.task_status = mapStatusToApi(task.status);
    if (task.priority !== undefined) apiTaskUpdate.task_priority = mapPriorityToApi(task.priority);
    if (task.deadline !== undefined) apiTaskUpdate.deadline = task.deadline.toISOString();
    
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/${taskId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(apiTaskUpdate),
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Task updated successfully:", data);
      
      // Transform the API response to our TransformedTask format
      return {
        id: data.id ? data.id.toString() : taskId,
        title: data.task_name,
        description: data.description || "",
        status: mapStatusFromApi(data.task_status),
        priority: mapPriorityFromApi(data.task_priority),
        assignee: data.employee_info ? data.employee_info.full_name : "Не назначено",
        deadline: new Date(data.deadline),
        createdAt: new Date(),
        updatedAt: new Date(),
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
        headers: {
          "Accept": "application/json",
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

  // Mark a task as completed
  markAsCompleted: async (taskId: string): Promise<TransformedTask> => {
    console.log("Marking task as completed:", taskId);
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/${taskId}/mark_as_completed/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Task marked as completed:", data);
      
      // Transform the API response to our TransformedTask format
      return {
        id: data.id ? data.id.toString() : taskId,
        title: data.task_name,
        description: data.description || "",
        status: "completed", // Always completed since this endpoint marks it as completed
        priority: mapPriorityFromApi(data.task_priority),
        assignee: data.employee_info ? data.employee_info.full_name : "Не назначено",
        deadline: new Date(data.deadline),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error marking task as completed:", error);
      throw new Error(`Failed to mark task as completed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

// Helper functions to map between our app's status/priority and the API's
function mapStatusFromApi(apiStatus: string): TransformedTask["status"] {
  switch (apiStatus?.toLowerCase()) {
    case "завершена":
    case "completed":
    case "done":
      return "completed";
    case "в процессе":
    case "in progress":
      return "in-progress";
    case "ожидает":
    case "pending":
    case "new":
    default:
      return "pending";
  }
}

function mapStatusToApi(status: TransformedTask["status"]): string {
  switch (status) {
    case "completed":
      return "Завершена";
    case "in-progress":
      return "В процессе";
    case "pending":
    default:
      return "Ожидает";
  }
}

function mapPriorityFromApi(apiPriority: string): TransformedTask["priority"] {
  switch (apiPriority?.toLowerCase()) {
    case "низкий":
    case "low":
      return "low";
    case "высокий":
    case "high":
    case "urgent":
      return "high";
    case "средний":
    case "medium":
    case "normal":
    default:
      return "medium";
  }
}

function mapPriorityToApi(priority: TransformedTask["priority"]): string {
  switch (priority) {
    case "low":
      return "Низкий";
    case "high":
      return "Высокий";
    case "medium":
    default:
      return "Средний";
  }
}
