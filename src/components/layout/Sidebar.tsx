import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Bot, label: "Agent Builder", to: "/agent-builder" },
  { icon: MessageSquare, label: "Sessions", to: "/sessions" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-[#22242A] border-r border-border transition-all duration-300 flex flex-col z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between h-16 border-b border-border/10">
        {!collapsed && <span className="font-bold text-xl text-primary truncate">AgentForms</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-muted-foreground hover:text-primary"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-2 px-2">
        {!collapsed && (
           <div className="px-2 mb-4">
              <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                <Plus className="h-4 w-4" />
                Create Agent
              </Button>
           </div>
        )}
        {collapsed && (
            <div className="px-2 mb-4 flex justify-center">
                 <Button size="icon" className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-5 w-5" />
                 </Button>
            </div>
        )}

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  collapsed && "justify-center px-2"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border/10">
        <Button variant="ghost" className={cn("w-full justify-start gap-3 text-muted-foreground hover:text-foreground", collapsed && "justify-center px-0")}>
            <LogOut className="h-5 w-5" />
            {!collapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
}
