
export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface EmployeePosition {
  id: number;
  title: string;
}

export interface EmployeeInfo {
  id: number;
  surname: string;
  name: string;
  last_name: string;
  image: string;
  full_path_image: string;
  work_phone_num: string;
  personal_phone_num: string;
  email: string;
  position: EmployeePosition;
  department: string;
  room_number: string;
  full_name: string;
  order: number;
}

export interface Task {
  id: string;
  parent_task?: number;
  employee_info?: EmployeeInfo;
  task_name: string;
  description: string;
  comment?: string;
  task_status: string;
  task_priority: string;
  deadline: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// For backward compatibility with existing code
export interface TransformedTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}
