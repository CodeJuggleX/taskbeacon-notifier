import { useState } from "react";
import { Task } from "@/types/task";
import { formatDistanceToNow } from "date-fns";
import { Clock, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onStatusChange, onEdit }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDeadlineStatus = () => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDeadline <= 0) return "danger";
    if (daysUntilDeadline <= 3) return "warning";
    return "safe";
  };

  const getStatusBadgeClass = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "in-progress":
        return "status-in-progress";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "task-card animate-fade-in",
        isHovered && "transform scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`deadline-indicator deadline-${getDeadlineStatus()}`} />

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <EditTaskDialog task={task} onTaskUpdate={onEdit} />
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Flag className={cn("w-4 h-4", getPriorityColor(task.priority))} />
          <span className="text-sm capitalize">{task.priority}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={cn("status-badge", getStatusBadgeClass(task.status))}>
          {task.status.replace("-", " ")}
        </span>

        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as Task["status"])
          }
          className="px-3 py-1 rounded-md text-sm border border-gray-200 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="pending">Ожидает</option>
          <option value="in-progress">В процессе</option>
          <option value="completed">Завершена</option>
        </select>
      </div>
    </div>
  );
};