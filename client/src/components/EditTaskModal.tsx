import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@shared/schema";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [taskText, setTaskText] = useState(task.text);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = () => {
    if (taskText.trim()) {
      onSave({ ...task, text: taskText.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="modal-edit-task"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="border-b border-border">
          <CardTitle>Edit Task</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Task description"
            className="w-full"
            autoFocus
            data-testid="input-edit-task"
          />
        </CardContent>
        <div className="p-6 border-t border-border flex gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            data-testid="button-cancel-edit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!taskText.trim()}
            data-testid="button-save-edit"
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
