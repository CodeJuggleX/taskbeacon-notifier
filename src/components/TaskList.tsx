import { useState } from "react";
import { Task } from "@/types/task";
import { Input } from "@/components/ui/input";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "./EditTaskDialog";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

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

  const getStatusBadgeClass = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "in-progress":
        return "В процессе";
      case "completed":
        return "Завершена";
      default:
        return status;
    }
  };

  const getPriorityText = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "Низкий";
      case "medium":
        return "Средний";
      case "high":
        return "Высокий";
      default:
        return priority;
    }
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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Приоритет</TableHead>
              <TableHead>Исполнитель</TableHead>
              <TableHead>Срок</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="max-w-[200px] truncate">{task.description}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </TableCell>
                <TableCell>{getPriorityText(task.priority)}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{format(new Date(task.deadline), 'dd.MM.yyyy')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditTaskDialog task={task} onTaskUpdate={onEdit} />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};