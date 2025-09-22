import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Clock, CheckCircle, Edit, Trash2, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Task } from "@shared/schema";
import EditTaskModal from "./EditTaskModal";

interface TaskListProps {
  selectedDate: Date;
}

export default function TaskList({ selectedDate }: TaskListProps) {
  const [taskInput, setTaskInput] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const dateString = format(selectedDate, 'yyyy-MM-dd');

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks', dateString],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/tasks', {
        text,
        date: dateString,
        completed: false,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setTaskInput("");
      toast({
        title: "Task added",
        description: "Your task has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const response = await apiRequest('PATCH', `/api/tasks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task deleted",
        description: "Your task has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addTask = () => {
    if (!taskInput.trim()) return;
    createTaskMutation.mutate(taskInput.trim());
  };

  const toggleTask = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { completed: !task.completed }
    });
  };

  const deleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(id);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        {/* Task Input Section */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Add New Task</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What do you need to do today?"
              className="flex-1"
              data-testid="input-new-task"
            />
            <Button 
              onClick={addTask}
              disabled={createTaskMutation.isPending}
              className="whitespace-nowrap"
              data-testid="button-add-task"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12" data-testid="empty-state">
              <ClipboardCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks for this day</h3>
              <p className="text-muted-foreground mb-4">Add your first task to get started</p>
              <Button 
                onClick={() => document.querySelector<HTMLInputElement>('[data-testid="input-new-task"]')?.focus()}
                data-testid="button-focus-input"
              >
                Add Task
              </Button>
            </div>
          ) : (
            <>
              {/* Incomplete Tasks */}
              {incompleteTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Pending Tasks
                  </h3>
                  
                  {incompleteTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="task-item bg-card border border-border rounded-lg p-4 mb-3 hover:bg-accent transition-colors"
                      data-testid={`task-item-${task.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => toggleTask(task)}
                          className="mt-1 w-5 h-5 border-2 border-border rounded hover:border-primary transition-colors"
                          disabled={updateTaskMutation.isPending}
                          data-testid={`button-toggle-${task.id}`}
                        />
                        <div className="flex-1">
                          <p className="task-text text-foreground font-medium" data-testid={`text-task-${task.id}`}>
                            {task.text}
                          </p>
                          <p className="text-muted-foreground text-sm mt-1">
                            Added {format(task.createdAt, 'h:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditingTask(task)}
                            className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            data-testid={`button-edit-${task.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                            disabled={deleteTaskMutation.isPending}
                            data-testid={`button-delete-${task.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Completed Tasks
                  </h3>
                  
                  {completedTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="task-item task-completed bg-card border border-border rounded-lg p-4 mb-3 hover:bg-accent transition-colors"
                      data-testid={`task-item-${task.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => toggleTask(task)}
                          className="mt-1 w-5 h-5 bg-primary border-2 border-primary rounded flex items-center justify-center"
                          disabled={updateTaskMutation.isPending}
                          data-testid={`button-toggle-${task.id}`}
                        >
                          <CheckCircle className="h-3 w-3 text-primary-foreground" />
                        </button>
                        <div className="flex-1">
                          <p className="task-text text-foreground font-medium" data-testid={`text-task-${task.id}`}>
                            {task.text}
                          </p>
                          <p className="text-muted-foreground text-sm mt-1">
                            Completed {format(task.createdAt, 'h:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditingTask(task)}
                            className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            data-testid={`button-edit-${task.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                            disabled={deleteTaskMutation.isPending}
                            data-testid={`button-delete-${task.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updatedTask: Task) => {
            updateTaskMutation.mutate({
              id: updatedTask.id,
              updates: { text: updatedTask.text }
            });
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}
