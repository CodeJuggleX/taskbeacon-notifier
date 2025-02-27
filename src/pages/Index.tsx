
import { useTasks } from "@/hooks/useTasks";
import { TaskList } from "@/components/TaskList";
import { useToast } from "@/hooks/use-toast";
import { Container, CircularProgress, Alert } from "@mui/material";
import { Task } from "@/types/task";

const Index = () => {
  const { toast } = useToast();
  const { tasks, isLoading, error, updateTask, deleteTask } = useTasks();

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    updateTask({ 
      taskId, 
      task: { status: newStatus } 
    });
    
    toast({
      title: "Статус обновлен",
      description: "Статус задачи успешно изменен",
    });
  };

  const handleEditTask = (updatedTask: Task) => {
    updateTask({ 
      taskId: updatedTask.id, 
      task: updatedTask 
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          Ошибка при загрузке задач: {(error as Error).message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <TaskList
        tasks={tasks || []}
        onStatusChange={handleStatusChange}
        onEdit={handleEditTask}
      />
    </Container>
  );
};

export default Index;
