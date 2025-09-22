import { useState } from "react";
import { format, isToday } from "date-fns";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const formatSelectedDate = () => {
    if (isToday(selectedDate)) {
      return "Today, " + format(selectedDate, "MMMM d");
    }
    return format(selectedDate, "EEEE, MMMM d");
  };

  return (
    <>
      <title>Daily Tasks - Task Management Dashboard</title>
      <meta name="description" content="Organize your daily tasks with our intuitive calendar-based task management system. Add, edit, and track your todos with ease." />
      
      {/* Mobile Header */}
      {isMobile && (
        <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Daily Tasks</h1>
          <button 
            onClick={toggleMobileMenu} 
            className="p-2 hover:bg-accent rounded-md"
            data-testid="button-mobile-menu-toggle"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex h-screen lg:h-screen">
        {/* Sidebar */}
        <div 
          className={`sidebar fixed lg:relative z-50 lg:z-auto w-80 bg-card border-r border-border flex flex-col h-full lg:h-auto ${
            isMobileMenuOpen ? 'open' : ''
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground hidden lg:block">Daily Tasks</h1>
              {isMobile && (
                <button 
                  onClick={closeMobileMenu} 
                  className="lg:hidden p-2 hover:bg-accent rounded-md"
                  data-testid="button-close-mobile-menu"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1 hidden lg:block">
              Stay organized, stay productive
            </p>
          </div>

          <Sidebar 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate}
            onMobileMenuClose={closeMobileMenu}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Header */}
          <div className="bg-card border-b border-border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground" data-testid="text-selected-date">
                  {formatSelectedDate()}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  <span data-testid="text-day-of-week">{format(selectedDate, "EEEE")}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Task List */}
          <TaskList selectedDate={selectedDate} />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          data-testid="overlay-mobile-menu"
        />
      )}
    </>
  );
}
