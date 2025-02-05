import { useState } from "react";
import { Task } from "@/types/task";
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
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface EditTaskDialogProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
}

export const EditTaskDialog = ({ task, onTaskUpdate }: EditTaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedTask = {
      ...editedTask,
      updatedAt: new Date(),
    };
    
    onTaskUpdate(updatedTask);
    setIsOpen(false);
    
    toast({
      title: "Задача обновлена",
      description: "Изменения успешно сохранены",
    });
  };

  return (
    <>
      <IconButton
        size="small"
        color="primary"
        onClick={() => setIsOpen(true)}
      >
        <EditIcon />
      </IconButton>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Редактировать задачу</DialogTitle>
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
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Описание"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />

            <TextField
              label="Исполнитель"
              value={editedTask.assignee}
              onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Срок выполнения"
              type="datetime-local"
              value={new Date(editedTask.deadline).toISOString().slice(0, 16)}
              onChange={(e) => setEditedTask({
                ...editedTask,
                deadline: new Date(e.target.value)
              })}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Приоритет</InputLabel>
              <Select
                value={editedTask.priority}
                label="Приоритет"
                onChange={(e) => setEditedTask({
                  ...editedTask,
                  priority: e.target.value as Task["priority"]
                })}
              >
                <MenuItem value="low">Низкий</MenuItem>
                <MenuItem value="medium">Средний</MenuItem>
                <MenuItem value="high">Высокий</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setIsOpen(false)}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
              >
                Сохранить
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};