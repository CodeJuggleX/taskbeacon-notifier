import { useState } from "react";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Input } from "@/components/ui/input";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { useToast } from "@/hooks/use-toast";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  onEdit: (task: Task) => void;
}

export const TaskList = ({ tasks: initialTasks, onStatusChange, onEdit }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Task["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"deadline" | "priority">("deadline");
  const { toast } = useToast();

  const handleCreateTask = async (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      console.log("Creating new task:", newTask);
      
      const completeTask: Task = {
        ...newTask,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setTasks(prevTasks => [...prevTasks, completeTask]);

      toast({
        title: "Задача создана",
        description: "Новая задача успешно добавлена в систему",
      });

      return completeTask;
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать задачу. Попробуйте позже.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteTask = (taskId: string) => {
    console.log("Deleting task:", taskId);
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Задача удалена",
      description: "Задача была успешно удалена из системы",
    });
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Мои задачи</h2>
        <CreateTaskDialog onTaskCreate={handleCreateTask} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="search"
          placeholder="Поиск задач..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Task["status"] | "all")}
          className="px-4 py-2 rounded-md border border-gray-200 bg-white"
        >
          <option value="all">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="in-progress">В процессе</option>
          <option value="completed">Завершена</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "deadline" | "priority")}
          className="px-4 py-2 rounded-md border border-gray-200 bg-white"
        >
          <option value="deadline">Сортировать по сроку</option>
          <option value="priority">Сортировать по приоритету</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};