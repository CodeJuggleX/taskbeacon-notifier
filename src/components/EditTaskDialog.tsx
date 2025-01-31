import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-gray-500 hover:text-gray-700">
          <span className="sr-only">Edit task</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Название
            </label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Описание
            </label>
            <textarea
              id="description"
              className="w-full min-h-[100px] p-2 border rounded-md"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="assignee" className="text-sm font-medium">
              Исполнитель
            </label>
            <Input
              id="assignee"
              value={editedTask.assignee}
              onChange={(e) =>
                setEditedTask({ ...editedTask, assignee: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="deadline" className="text-sm font-medium">
              Срок выполнения
            </label>
            <Input
              id="deadline"
              type="datetime-local"
              value={new Date(editedTask.deadline).toISOString().slice(0, 16)}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  deadline: new Date(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="priority" className="text-sm font-medium">
              Приоритет
            </label>
            <select
              id="priority"
              className="w-full p-2 border rounded-md"
              value={editedTask.priority}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  priority: e.target.value as Task["priority"],
                })
              }
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};