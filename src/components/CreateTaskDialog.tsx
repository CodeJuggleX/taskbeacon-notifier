import { useState } from "react";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";

interface CreateTaskDialogProps {
  onTaskCreate: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
}

export const CreateTaskDialog = ({ onTaskCreate }: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !assignee || !deadline) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      const newTask = {
        title,
        description,
        assignee,
        deadline: new Date(deadline),
        status,
        priority,
      };

      await onTaskCreate(newTask);
      setOpen(false);
      resetForm();

      console.log("Task created successfully:", newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать задачу. Попробуйте позже.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignee("");
    setDeadline("");
    setStatus("pending");
    setPriority("medium");
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        endIcon={<PersonIcon />}
        onClick={() => setOpen(true)}
      >
        Создать задачу
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создать новую задачу</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'grid',
              gap: 2,
              pt: 2,
            }}
          >
            <TextField
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              required
            />

            <TextField
              label="Исполнитель"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Срок выполнения"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={status}
                  label="Статус"
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  <MenuItem value="pending">Ожидает</MenuItem>
                  <MenuItem value="in-progress">В процессе</MenuItem>
                  <MenuItem value="completed">Завершена</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Приоритет</InputLabel>
                <Select
                  value={priority}
                  label="Приоритет"
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <MenuItem value="low">Низкий</MenuItem>
                  <MenuItem value="medium">Средний</MenuItem>
                  <MenuItem value="high">Высокий</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Создать задачу
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};