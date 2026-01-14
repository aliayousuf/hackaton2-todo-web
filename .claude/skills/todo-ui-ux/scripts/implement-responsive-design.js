#!/usr/bin/env node

/**
 * Script to implement responsive design with mobile bottom sheet
 */

const fs = require('fs');
const path = require('path');

function createResponsiveDesign() {
  // Create responsive sidebar component
  const sidebarComponent = `import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, CheckSquare, Calendar, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export function ResponsiveSidebar({ isOpen, onToggle, isMobile = false }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
    { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const toggleExpand = () => {
    if (isMobile) return; // Don't expand on mobile
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="glass-card p-2 rounded-lg md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
        </motion.button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: '-100%' } : { width: 0 }}
            animate={isMobile ? { x: 0 } : { width: isExpanded ? '240px' : '60px' }}
            exit={isMobile ? { x: '-100%' } : { width: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={\`fixed md:relative z-30 h-[calc(100vh-4rem)] md:h-auto top-16 md:top-0 \${isMobile ? 'left-0 w-64' : ''} glass-sidebar backdrop-blur-md border-r border-white/10 overflow-hidden\`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                {!isMobile && (
                  <motion.button
                    onClick={toggleExpand}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                  >
                    {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </motion.button>
                )}
              </div>

              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    whileHover={{ x: isExpanded ? 5 : 0 }}
                    className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors \${isExpanded ? 'justify-start' : 'justify-center'} hover:bg-white/10\`}
                  >
                    <item.icon className="h-5 w-5 text-indigo-400" />
                    {isExpanded && <span className="text-white">{item.label}</span>}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Moon className="h-5 w-5 text-indigo-400" />
                  {isExpanded && <span className="text-white">Dark Mode</span>}
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}`;

  // Create mobile bottom navigation
  const bottomNavComponent = `import { motion } from 'framer-motion';
import { Home, CheckSquare, Calendar, User, Plus } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateTask: () => void;
}

export function BottomNavigation({ activeTab, onTabChange, onCreateTask }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'add', icon: Plus, label: 'Add' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 glass-card backdrop-blur-md border-t border-white/10 py-2 px-1 md:hidden z-50"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (item.id === 'add') {
                onCreateTask();
              } else {
                onTabChange(item.id);
              }
            }}
            className={\`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors \${activeTab === item.id ? 'text-indigo-400' : 'text-slate-400'}\`}
            aria-label={item.label}
          >
            <item.icon className={\`h-5 w-5 \${activeTab === item.id ? 'text-indigo-400' : 'text-slate-400'}\`} />
            <span className="text-xs mt-1">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}`;

  // Create responsive layout component
  const responsiveLayout = `import { useState, useEffect } from 'react';
import { ResponsiveSidebar } from '@/components/nav/ResponsiveSidebar';
import { BottomNavigation } from '@/components/nav/BottomNavigation';
import { BottomSheet } from '@/components/ui/BottomSheet';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  onCreateTask: () => void;
}

export function ResponsiveLayout({ children, onCreateTask }: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCreateTask = () => {
    if (isMobile) {
      setBottomSheetOpen(true);
    } else {
      onCreateTask();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900">
      <ResponsiveSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />

      <main className={\`flex-1 p-4 md:p-6 transition-all duration-300 \${isMobile ? 'pb-20' : ''}\`}>
        {children}
      </main>

      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
      >
        {children}
      </BottomSheet>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}`;

  // Write the responsive components to files
  const navDir = path.join(process.cwd(), 'frontend', 'components', 'nav');
  if (!fs.existsSync(navDir)) {
    fs.mkdirSync(navDir, { recursive: true });
  }

  fs.writeFileSync(path.join(navDir, 'ResponsiveSidebar.tsx'), sidebarComponent);
  fs.writeFileSync(path.join(navDir, 'BottomNavigation.tsx'), bottomNavComponent);

  const layoutDir = path.join(process.cwd(), 'frontend', 'components', 'layout');
  if (!fs.existsSync(layoutDir)) {
    fs.mkdirSync(layoutDir, { recursive: true });
  }

  fs.writeFileSync(path.join(layoutDir, 'ResponsiveLayout.tsx'), responsiveLayout);

  console.log('✅ Responsive design components created successfully!');
  console.log('- ResponsiveSidebar.tsx');
  console.log('- BottomNavigation.tsx');
  console.log('- ResponsiveLayout.tsx');
}

function updateDashboardPage() {
  const dashboardPagePath = path.join(process.cwd(), 'frontend', 'app', 'dashboard', 'page.tsx');

  if (fs.existsSync(dashboardPagePath)) {
    let dashboardContent = fs.readFileSync(dashboardPagePath, 'utf8');

    // Replace the existing dashboard page with responsive version
    const responsiveDashboard = `import { useState, useEffect } from 'react';
import { EnhancedTaskList } from '@/components/tasks/EnhancedTaskList';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { EnhancedEmptyState } from '@/components/tasks/EnhancedEmptyState';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Task } from '@/types/task';
import { getTasks } from '@/lib/api';

export default function DashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    upcomingTasks: 0
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks();
        if (response.success) {
          const tasksData = response.data || [];
          setTasks(tasksData);

          // Calculate stats
          const completed = tasksData.filter(t => t.completed).length;
          const total = tasksData.length;

          setStats({
            totalTasks: total,
            completedTasks: completed,
            overdueTasks: 0, // Calculate based on due dates if available
            upcomingTasks: total - completed
          });
        } else {
          setError(response.error || 'Failed to load tasks');
        }
      } catch (err) {
        setError('An error occurred while loading tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    setShowCreateForm(false);
    setShowBottomSheet(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (deletedTaskId: number) => {
    setTasks(tasks.filter(task => task.id !== deletedTaskId));
  };

  const handleCreateTask = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setShowBottomSheet(true);
    } else {
      setShowCreateForm(true);
    }
  };

  return (
    <DashboardLayout
      stats={stats}
      onCreateTask={handleCreateTask}
    >
      {/* Desktop Create Task Form */}
      {showCreateForm && (
        <div className="glass-card mb-8 rounded-xl backdrop-blur-md border border-white/10 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 break-words">Create New Task</h2>
          <CreateTaskForm
            onTaskCreated={handleTaskCreated}
            onError={(error) => {
              console.error('Error creating task:', error);
            }}
          />
        </div>
      )}

      <EnhancedTaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onTaskUpdate={handleTaskUpdated}
        onTaskDelete={handleTaskDeleted}
        onCreateTask={handleCreateTask}
      />

      {/* Mobile Bottom Sheet for Task Creation */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
      >
        <CreateTaskForm
          onTaskCreated={handleTaskCreated}
          onError={(error) => {
            console.error('Error creating task:', error);
          }}
        />
      </BottomSheet>
    </DashboardLayout>
  );
}`;

    fs.writeFileSync(dashboardPagePath, responsiveDashboard);
    console.log('✅ Dashboard page updated with responsive design!');
  }
}

// Main execution
function main() {
  console.log('📱 Implementing responsive design with mobile bottom sheet...');

  createResponsiveDesign();
  updateDashboardPage();

  console.log('\\n🎉 Responsive design implementation complete!');
  console.log('\\nFeatures implemented:');
  console.log('1. Responsive sidebar with expand/collapse');
  console.log('2. Mobile bottom navigation');
  console.log('3. Bottom sheet for mobile task creation');
  console.log('4. Responsive layout component');
  console.log('5. Updated dashboard with mobile-first approach');
}

main();