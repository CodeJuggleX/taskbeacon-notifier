
import { useTasks } from "@/hooks/useTasks";
import { TaskList } from "@/components/TaskList";
import { useToast } from "@/hooks/use-toast";
import { Container, CircularProgress, Alert, Button, Box, Typography } from "@mui/material";
import { TransformedTask } from "@/types/task";
import { useEffect } from "react";
import { UserProfile } from "@/components/UserProfile";

const Index = () => {
  const { toast } = useToast();
  const { 
    tasks, 
    isLoading, 
    error, 
    updateTask, 
    deleteTask, 
    markAsCompleted,
    refetchTasks 
  } = useTasks();

  useEffect(() => {
    if (error) {
      toast({
        title: "Ошибка соединения",
        description: String(error),
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleStatusChange = (taskId: string, newStatus: TransformedTask["status"]) => {
    updateTask({ 
      taskId, 
      task: { status: newStatus } 
    });
    
    // If status changed to completed, also call the markAsCompleted endpoint
    if (newStatus === "completed") {
      markAsCompleted(taskId);
    }
  };

  const handleEditTask = (updatedTask: TransformedTask) => {
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
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetchTasks()}>
              Повторить
            </Button>
          }
        >
          <Typography fontWeight="bold">Ошибка при загрузке задач:</Typography> 
          <Typography>{String(error)}</Typography>
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            onClick={() => refetchTasks()}
            size="large"
          >
            Повторить запрос
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <UserProfile />
      <TaskList
        tasks={tasks || []}
        onStatusChange={handleStatusChange}
        onEdit={handleEditTask}
      />
    </Container>
  );
};

export default Index;
