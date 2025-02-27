
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TasksApi } from "@/api";
import { TransformedTask } from "@/types/task";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to check authentication
  const checkAuthentication = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему",
        variant: "destructive",
      });
      navigate('/login');
      return false;
    }
    return true;
  };

  // Query for fetching all tasks
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!checkAuthentication()) {
        throw new Error("Authentication required");
      }
      return TasksApi.getAllTasks();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Mutation for creating a task
  const createTaskMutation = useMutation({
    mutationFn: TasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Задача создана",
        description: "Новая задача успешно добавлена",
      });
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать задачу",
        variant: "destructive",
      });
      
      // Check if error is due to authentication
      if (error instanceof Error && error.message.includes("401")) {
        navigate('/login');
      }
    },
  });

  // Mutation for updating a task
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, task }: { taskId: string; task: Partial<TransformedTask> }) =>
      TasksApi.updateTask(taskId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Задача обновлена",
        description: "Изменения успешно сохранены",
      });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить задачу",
        variant: "destructive",
      });
      
      // Check if error is due to authentication
      if (error instanceof Error && error.message.includes("401")) {
        navigate('/login');
      }
    },
  });

  // Mutation for deleting a task
  const deleteTaskMutation = useMutation({
    mutationFn: TasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Задача удалена",
        description: "Задача успешно удалена",
      });
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить задачу",
        variant: "destructive",
      });
      
      // Check if error is due to authentication
      if (error instanceof Error && error.message.includes("401")) {
        navigate('/login');
      }
    },
  });

  // Mutation for marking a task as completed
  const markAsCompletedMutation = useMutation({
    mutationFn: TasksApi.markAsCompleted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Задача завершена",
        description: "Задача отмечена как завершенная",
      });
    },
    onError: (error) => {
      console.error("Error marking task as completed:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось завершить задачу",
        variant: "destructive",
      });
      
      // Check if error is due to authentication
      if (error instanceof Error && error.message.includes("401")) {
        navigate('/login');
      }
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    markAsCompleted: markAsCompletedMutation.mutate,
    refetchTasks: refetch,
  };
};
