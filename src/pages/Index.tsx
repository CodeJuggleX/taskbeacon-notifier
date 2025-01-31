import { useState } from "react";
import { Task } from "@/types/task";
import { TaskList } from "@/components/TaskList";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete Project Proposal",
    description: "Draft and finalize the project proposal for the new client",
    status: "in-progress",
    priority: "high",
    assignee: "John Doe",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Review Code Changes",
    description: "Review and approve pending pull requests",
    status: "pending",
    priority: "medium",
    assignee: "Jane Smith",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Update Documentation",
    description: "Update the API documentation with recent changes",
    status: "completed",
    priority: "low",
    assignee: "Bob Johnson",
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const { toast } = useToast();

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      )
    );

    toast({
      title: "Task Updated",
      description: "Task status has been successfully updated.",
    });
  };

  const handleEditTask = (task: Task) => {
    // This would typically open a modal or navigate to an edit page
    console.log("Editing task:", task);
    toast({
      title: "Edit Task",
      description: "Task editing functionality coming soon.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage and track your assigned tasks</p>
        </header>

        <TaskList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTask}
        />
      </div>
    </div>
  );
};

export default Index;