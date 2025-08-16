import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminTopBarProps {
  onMenuClick: () => void;
}

interface AdminProfile {
  email: string;
  role: string;
}

const AdminTopBar = ({ onMenuClick }: AdminTopBarProps) => {
  const { user, logout } = useAuth();
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/info/admin/profile', {
          headers: {
            'Authorization': `Bearer ${user?.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch admin profile');
        }

        const data = await response.json();
        if (data.success && data.data.profile) {
          setAdminProfile(data.data.profile);
        }
      } catch (error) {
        console.error('Admin profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.access_token) {
      fetchAdminProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    // You might want to add a toast notification here
  };

  const getInitials = (email: string) => {
    if (!email) return "AD";
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
      {/* Left side - Menu button (mobile) */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-white/10 rounded-xl border border-white/10"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right side Profile */}
      <div className="flex items-center space-x-4">
        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
              <Avatar className="h-10 w-10 ring-2 ring-primary/30 ring-offset-2 ring-offset-black">
                <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold border border-primary/20">
                  {loading ? <Shield className="h-4 w-4" /> : getInitials(adminProfile?.email || '')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-black/95 backdrop-blur-xl border-white/10" align="end">
            <div className="flex items-center justify-start gap-3 p-3 border-b border-white/10">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/20">
                  {loading ? <Shield className="h-4 w-4" /> : getInitials(adminProfile?.email || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">
                  {loading ? 'Loading...' : adminProfile?.role || 'Admin'}
                </p>
                <p className="text-xs text-gray-400">
                  {loading ? 'loading...' : adminProfile?.email || ''}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminTopBar;