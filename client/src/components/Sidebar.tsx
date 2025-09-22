import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "@shared/schema";

interface SidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMobileMenuClose: () => void;
}

export default function Sidebar({ selectedDate, onDateSelect, onMobileMenuClose }: SidebarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: allTasks = [] } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Get tasks for today to show in stats
  const todayTasks = allTasks.filter(task => 
    task.date === format(new Date(), 'yyyy-MM-dd')
  );

  const completedTasks = todayTasks.filter(task => task.completed);
  const pendingTasks = todayTasks.filter(task => !task.completed);

  // Get dates that have tasks
  const datesWithTasks = new Set(allTasks.map(task => task.date));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty cells for days before the month starts
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array(firstDayOfWeek).fill(null);

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const selectDate = (date: Date) => {
    onDateSelect(date);
    onMobileMenuClose();
  };

  return (
    <div className="p-6 flex-1">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-current-month">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <div className="flex gap-1">
            <button 
              onClick={previousMonth}
              className="p-2 hover:bg-accent rounded-md"
              data-testid="button-previous-month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-accent rounded-md"
              data-testid="button-next-month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {/* Day Headers */}
          <div className="text-muted-foreground font-medium p-2">Sun</div>
          <div className="text-muted-foreground font-medium p-2">Mon</div>
          <div className="text-muted-foreground font-medium p-2">Tue</div>
          <div className="text-muted-foreground font-medium p-2">Wed</div>
          <div className="text-muted-foreground font-medium p-2">Thu</div>
          <div className="text-muted-foreground font-medium p-2">Fri</div>
          <div className="text-muted-foreground font-medium p-2">Sat</div>
          
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={index} className="p-2" />
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((date) => {
            const dateString = format(date, 'yyyy-MM-dd');
            const hasThisTask = datesWithTasks.has(dateString);
            const isSelected = isSameDay(date, selectedDate);
            
            return (
              <button
                key={dateString}
                onClick={() => selectDate(date)}
                className={`calendar-day p-2 rounded-md text-sm hover:bg-accent transition-all ${
                  hasThisTask ? 'has-tasks' : ''
                } ${isSelected ? 'selected' : ''}`}
                data-testid={`calendar-day-${dateString}`}
              >
                {format(date, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-accent p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Today's Progress</h4>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground" data-testid="text-completed-tasks">
                {completedTasks.length}
              </span> completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-border rounded-full"></div>
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground" data-testid="text-pending-tasks">
                {pendingTasks.length}
              </span> pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
