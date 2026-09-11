import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  BarChart3,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/toast/useToast";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Subjects", to: "/subjects", icon: BookOpen },
  { label: "Timetable", to: "/timetable", icon: Calendar },
  { label: "Attendance", to: "/attendance", icon: CheckCircle },
  { label: "To-Do List", to: "/todos", icon: ClipboardList },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
];



interface SidebarProps {
  /** Called after a nav link is chosen — used to close the mobile drawer. */
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    showToast("You've been logged out.", "info");
    navigate("/", { replace: true });
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-cream font-display text-sm">
          A
        </span>
        <span className="font-display text-lg text-forest-dark">Attendly</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-light-green text-forest-dark"
                  : "text-muted hover:bg-light-green/60 hover:text-forest-dark"
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

      </nav>

      <div className="border-t border-border px-3 py-4">
        <div className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-light-green font-display text-sm text-forest">
            {user?.name?.charAt(0).toUpperCase() ?? "A"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-forest-dark">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>

        <NavLink to="/profile" onClick={onNavigate} className={({isActive})=>cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",isActive?"bg-light-green text-forest-dark":"text-muted hover:bg-light-green/60")}><User size={18}/>Profile</NavLink>
        <NavLink to="/settings" onClick={onNavigate} className={({isActive})=>cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",isActive?"bg-light-green text-forest-dark":"text-muted hover:bg-light-green/60")}><Settings size={18}/>Settings</NavLink>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isSubmitting}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-light-green/60 hover:text-forest-dark disabled:opacity-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
