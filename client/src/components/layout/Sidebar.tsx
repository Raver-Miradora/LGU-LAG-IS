import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Briefcase,
  GraduationCap,
  HardHat,
  HandCoins,
  Wrench,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  roles?: Role[];
}

const hrNav: NavItem[] = [
  { label: "Employees", to: "/employees", icon: Users, roles: ["SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"] },
  { label: "Service Records", to: "/service-records", icon: FileText, roles: ["SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"] },
];

const pesoNav: NavItem[] = [
  { label: "PESO Dashboard", to: "/peso/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"] },
  { label: "Beneficiaries", to: "/peso/beneficiaries", icon: Briefcase, roles: ["SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"] },
  { label: "SPES", to: "/peso/spes", icon: GraduationCap, roles: ["SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"] },
  { label: "OJT", to: "/peso/ojt", icon: HardHat, roles: ["SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"] },
  { label: "TUPAD", to: "/peso/tupad", icon: Wrench, roles: ["SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"] },
  { label: "Livelihood", to: "/peso/livelihood", icon: HandCoins, roles: ["SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"] },
];

const adminNav: NavItem[] = [
  {
    label: "User Management",
    to: "/users",
    icon: UserCog,
    roles: ["SUPER_ADMIN"],
  },
];

function NavGroup({
  title,
  items,
  collapsed,
  userRole,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  userRole?: string;
}) {
  const filteredItems = items.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole as Role))
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="mb-4">
      {!collapsed && (
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
      )}
      <nav className="space-y-0.5">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]",
                collapsed && "justify-center"
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-[var(--border)] bg-[var(--card)] transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-3">
        <img
          src="/images/lagonoy-logo.jpg"
          alt="LGU Lagonoy"
          className="h-11 w-11 shrink-0 object-contain drop-shadow-sm"
        />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--foreground)]">
              LGU Lagonoy
            </p>
            <p className="text-[10px] text-[var(--muted-foreground)]">
              Information System
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {/* Dashboard */}
        <div className="mb-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]",
                collapsed && "justify-center"
              )
            }
            title={collapsed ? "Dashboard" : undefined}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </div>

        <NavGroup title="HR Module" items={hrNav} collapsed={collapsed} userRole={user?.role} />
        <NavGroup title="PESO Employment" items={pesoNav} collapsed={collapsed} userRole={user?.role} />
        <NavGroup title="Administration" items={adminNav} collapsed={collapsed} userRole={user?.role} />
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] p-2">
        <button
          onClick={onToggle}
          className="mb-1 flex w-full items-center justify-center rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--destructive)] hover:bg-red-50",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
