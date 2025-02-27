
import { useState } from "react";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { format } from "date-fns";
import { useTasks } from "@/hooks/useTasks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Typography,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  onEdit: (task: Task) => void;
}

export const TaskList = ({ tasks: initialTasks, onStatusChange, onEdit }: TaskListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Task["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"deadline" | "priority">("deadline");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { createTask, deleteTask } = useTasks();

  const handleCreateTask = async (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      console.log("Creating new task:", newTask);
      await createTask(newTask);
      return newTask as Task;
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
    deleteTask(taskId);
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in-progress":
        return "info";
      case "completed":
        return "success";
      default:
        return "default";
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

  const filteredAndSortedTasks = initialTasks
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
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">Мои задачи</Typography>
        <CreateTaskDialog onTaskCreate={handleCreateTask} />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Поиск задач..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={(e) => setStatusFilter(e.target.value as Task["status"] | "all")}
          >
            <MenuItem value="all">Все статусы</MenuItem>
            <MenuItem value="pending">Ожидает</MenuItem>
            <MenuItem value="in-progress">В процессе</MenuItem>
            <MenuItem value="completed">Завершена</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortBy}
            label="Сортировка"
            onChange={(e) => setSortBy(e.target.value as "deadline" | "priority")}
          >
            <MenuItem value="deadline">По сроку</MenuItem>
            <MenuItem value="priority">По приоритету</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Приоритет</TableCell>
              <TableCell>Исполнитель</TableCell>
              <TableCell>Срок</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTasks.map((task) => (
              <TableRow
                key={task.id}
                hover
                onClick={() => handleRowClick(task)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{task.title}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.description}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(task.status)}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{getPriorityText(task.priority)}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{format(new Date(task.deadline), 'dd.MM.yyyy')}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <EditTaskDialog task={task} onTaskUpdate={onEdit} />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedTask?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">Описание</Typography>
            <Typography>{selectedTask?.description}</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Статус</Typography>
                {selectedTask && (
                  <Chip
                    label={getStatusText(selectedTask.status)}
                    color={getStatusColor(selectedTask.status)}
                    size="small"
                  />
                )}
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Приоритет</Typography>
                <Typography>{selectedTask && getPriorityText(selectedTask.priority)}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Исполнитель</Typography>
                <Typography>{selectedTask?.assignee}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Срок</Typography>
                <Typography>
                  {selectedTask && format(new Date(selectedTask.deadline), 'dd.MM.yyyy')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
