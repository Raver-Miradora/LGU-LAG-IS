import { Bell, Search, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getInitials, ROLE_LABELS } from "@/lib/utils";

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6">
      {/* Search */}
      <div className="flex max-w-md flex-1 items-center gap-2 rounded-md border border-[var(--input)] px-3 py-1.5">
        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 hover:bg-[var(--accent)]">
          <Bell className="h-5 w-5 text-[var(--muted-foreground)]" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--primary-foreground)]">
            {user ? getInitials(user.fullName) : <UserIcon className="h-4 w-4" />}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.fullName ?? "User"}</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">
              {user ? ROLE_LABELS[user.role] : ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
