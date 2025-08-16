
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageCircle,
  LogOut,
  X,
  Shield,
  Star
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: CreditCard, label: "Withdrawals", path: "/admin/withdrawals" },
    { icon: MessageCircle, label: "Chat", path: "/admin/chat" },
    // { icon: Star, label: "User Reviews", path: "/admin/UserReviews" }
  ];

  return (
    <>
      {/* Fixed Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-black/95 backdrop-blur-xl border-r border-white/10 text-white z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl backdrop-blur-sm border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-400">Management Console</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-white hover:bg-white/10 rounded-xl border border-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4 px-3">
            MENU
          </div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden backdrop-blur-sm",
                  isActive 
                    ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10" 
                    : "hover:bg-white/5 text-gray-300 hover:text-white border border-transparent hover:border-white/10"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive ? "text-primary" : "text-gray-400 group-hover:text-white"
                )} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50" />
                )}
              </Link>
            );
          })}
        </nav>

      </div>
    </>
  );
};

export default AdminSidebar;
