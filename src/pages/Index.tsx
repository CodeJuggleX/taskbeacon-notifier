import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";
import { TaskList } from "@/components/TaskList";
import { useToast } from "@/hooks/use-toast";
import { taskService } from "@/services/taskService";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Задача создана",
        description: "Новая задача успешно добавлена",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать задачу",
        variant: "destructive",
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: taskService.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Задача обновлена",
        description: "Изменения успешно сохранены",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить задачу",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTaskMutation.mutate({
        ...task,
        status: newStatus,
        updatedAt: new Date(),
      });
    }
  };

  const handleEditTask = (updatedTask: Task) => {
    updateTaskMutation.mutate(updatedTask);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Ошибка загрузки задач</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
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