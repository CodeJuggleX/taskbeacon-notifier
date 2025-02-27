
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TasksApi } from "@/api";
import { Task } from "@/types/task";
import { useToast } from "./use-toast";

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query for fetching all tasks
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: TasksApi.getAllTasks,
    // Add retry options to make more attempts before failing
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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
    },
  });

  // Mutation for updating a task
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, task }: { taskId: string; task: Partial<Task> }) =>
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
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    refetchTasks: refetch,
  };
};
