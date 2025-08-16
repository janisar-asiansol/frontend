
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  TrendingUp,
  Gift,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  X,
  Twitter,
  Globe,
  MessageCircle,
  ShieldCheck,
  Star // Add this import
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: TrendingUp, label: "My Investments", path: "/dashboard/investments" },
    { icon: ShoppingBag, label: "Buy Plan", path: "/dashboard/investmentplans" },
    { icon: Users, label: "Referrals", path: "/dashboard/referrals" },
    { icon: CreditCard, label: "Withdraw", path: "/dashboard/withdraw" },
    { icon: ShieldCheck, label: "KYC Verification", path: "/dashboard/kyc" },
    { icon: MessageCircle, label: "Chat with Admin", path: "/dashboard/chat" },
    { icon: Settings, label: "Profile", path: "/dashboard/settings" },
    { icon: Star, label: "Give Review", path: "/dashboard/review" }, // Add this line
  ];

  const socialLinks = [
    { icon: Twitter, label: "Twitter", url: "https://twitter.com" },
    { icon: MessageCircle, label: "Discord", url: "https://discord.com" },
    { icon: Globe, label: "Website", url: "/" },
  ];

  return (
    <>
      {/* Fixed Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl border-r border-border text-foreground z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              CryptoROI
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Investment Dashboard</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden hover:bg-accent rounded-xl"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4 px-3">
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
                    : "hover:bg-accent text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Theme</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Social Links */}
        <div className="px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Connect with us</p>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl hover:bg-accent transition-all duration-200 hover:scale-110 border border-border backdrop-blur-sm"
              >
                <link.icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
