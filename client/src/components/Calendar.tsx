import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate: Date;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  datesWithTasks: Set<string>;
}

export default function Calendar({ 
  selectedDate, 
  currentMonth, 
  onDateSelect, 
  onMonthChange, 
  datesWithTasks 
}: CalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty cells for days before the month starts
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array(firstDayOfWeek).fill(null);

  const previousMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const nextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  return (
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
              onClick={() => onDateSelect(date)}
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
  );
}
