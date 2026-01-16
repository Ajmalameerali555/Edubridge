import * as React from "react";
import { Link, useLocation } from "wouter";
import { useAuth, getRedirectPath } from "@/contexts/AuthContext";
import { UserRole, getNotificationsByRole } from "@/lib/datastore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Zap,
  Inbox,
  UserCheck,
  AlertTriangle,
  Shield,
  User,
  GraduationCap,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

const studentNavItems: NavItem[] = [
  { label: "Home", path: "/dashboard", icon: Home },
  { label: "Sprint", path: "/dashboard/sprint", icon: Zap },
  { label: "Sessions", path: "/dashboard/sessions", icon: Calendar },
  { label: "Homework", path: "/dashboard/homework", icon: BookOpen },
  { label: "Reports", path: "/dashboard/reports", icon: BarChart3 },
  { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
];

const tutorNavItems: NavItem[] = [
  { label: "Today", path: "/tutor", icon: Home },
  { label: "My Students", path: "/tutor/students", icon: Users },
  { label: "Sessions", path: "/tutor/sessions", icon: Calendar },
  { label: "Homework", path: "/tutor/homework", icon: BookOpen },
  { label: "Messages", path: "/tutor/messages", icon: MessageSquare },
];

const adminNavItems: NavItem[] = [
  { label: "Command Center", path: "/admin", icon: Home },
  { label: "Inbox", path: "/admin/inbox", icon: Inbox },
  { label: "Students", path: "/admin/students", icon: GraduationCap },
  { label: "Tutors", path: "/admin/tutors", icon: UserCheck },
  { label: "Matching", path: "/admin/matching", icon: Users },
  { label: "Sessions", path: "/admin/sessions", icon: Calendar },
  { label: "Incidents", path: "/admin/incidents", icon: AlertTriangle },
  { label: "Notifications", path: "/admin/notifications", icon: Bell },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const parentNavItems: NavItem[] = [
  { label: "Home", path: "/parent", icon: Home },
  { label: "My Child", path: "/parent/child", icon: User },
  { label: "Sessions", path: "/parent/sessions", icon: Calendar },
  { label: "Reports", path: "/parent/reports", icon: BarChart3 },
  { label: "Messages", path: "/parent/messages", icon: MessageSquare },
];

function getNavItemsForRole(role: UserRole): NavItem[] {
  switch (role) {
    case "admin":
      return adminNavItems;
    case "tutor":
      return tutorNavItems;
    case "parent":
      return parentNavItems;
    case "student":
    default:
      return studentNavItems;
  }
}

function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "tutor":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "parent":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "student":
    default:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  }
}

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = user ? getNavItemsForRole(user.role) : [];
  const notifications = user ? getNotificationsByRole(user.role) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/tutor" || path === "/admin" || path === "/parent") {
      return location === path;
    }
    return location.startsWith(path);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />
      
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-3 h-16 px-4 border-b">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg">EduBridge</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
            data-testid="toggle-sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "hover-elevate text-muted-foreground hover:text-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover-elevate",
                  collapsed ? "justify-center" : ""
                )}
                data-testid="user-menu-trigger"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{user.firstName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <span>{user.firstName} {user.lastName}</span>
                  <Badge className={cn("text-xs", getRoleBadgeColor(user.role))}>
                    {user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-normal mt-1">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} data-testid="logout-menu-item">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center gap-4 px-4 lg:px-6 bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            data-testid="mobile-menu-trigger"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" data-testid="notifications-trigger">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No notifications
                </div>
              ) : (
                notifications.slice(0, 5).map((notif) => (
                  <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3">
                    <div className="flex items-center gap-2">
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                      <span className="font-medium text-sm capitalize">
                        {notif.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-[1120px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
