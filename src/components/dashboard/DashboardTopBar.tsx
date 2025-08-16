import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface DashboardTopBarProps {
  onMenuClick: () => void;
}

interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
}

const DashboardTopBar = ({ onMenuClick }: DashboardTopBarProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/info/profile', {
          headers: {
            'Authorization': `Bearer ${user?.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        if (data.success && data.data.profile) {
          setProfile(data.data.profile);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.access_token) {
      fetchProfile();
    }
  }, [user, toast]);

  const handleProfileClick = () => {
    navigate("/dashboard/settings");
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const getInitials = () => {
    if (!profile) return "US";
    return `${profile.firstname.charAt(0)}${profile.lastname.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-gradient-to-r from-background via-background/95 to-background/90 backdrop-blur-xl border-b border-border p-4 flex items-center justify-between">
      {/* Left side - Menu button (mobile) */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-accent rounded-xl"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right side - Profile dropdown */}
      <div className="flex items-center ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold border border-primary/20">
                  {loading ? "..." : getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-border" align="end">
            <div className="flex items-center justify-start gap-2 p-2 border-b border-border">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-foreground">
                  {loading ? "Loading..." : `${profile?.firstname} ${profile?.lastname}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {loading ? "loading@example.com" : profile?.email}
                </p>
              </div>
            </div>
            <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-accent cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardTopBar;