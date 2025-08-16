import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, CreditCard, Eye, MessageCircle, ArrowUpRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface StatsData {
  totalUsers?: number;
  totalInvestment?: number;
  activePlanCount?: number;
  currency?: string;
}

const AdminOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statsData, setStatsData] = useState<StatsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculatingROI, setCalculatingROI] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total users
      const usersResponse = await fetch('http://localhost:3000/api/info/stats/total-users', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`
        }
      });
      const usersData = await usersResponse.json();
      
      // Fetch active plans data (now returns totalUsers and activePlanCount)
      const activePlansResponse = await fetch('http://localhost:3000/api/info/stats/active-plans', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`
        }
      });
      const activePlansData = await activePlansResponse.json();
      
      if (usersData.success && activePlansData.success) {
        setStatsData({
          totalUsers: activePlansData.data.totalUsers || usersData.data.totalUsers,
          totalInvestment: activePlansData.data.totalInvestment,
          activePlanCount: activePlansData.data.activePlanCount,
          currency: "USD"
        });
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = async () => {
    try {
      setCalculatingROI(true);
      const response = await fetch('http://localhost:3000/api/plan/calculate-roi', {
        method: 'GET',  // Changed to POST as it's more appropriate for this action
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message || "ROI calculated successfully");
        await fetchStats(); // Refresh stats after calculation
      } else {
        toast.error(data.message || "Failed to calculate ROI");
      }
    } catch (err) {
      console.error('Error calculating ROI:', err);
      toast.error("An error occurred while calculating ROI");
    } finally {
      setCalculatingROI(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const stats = [
    {
      title: "Total Users",
      value: loading ? "Loading..." : error ? "Error" : statsData.totalUsers?.toLocaleString() || "0",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Active Investments",
      value: loading ? "Loading..." : error ? "Error" : `${statsData.currency || "$"}${statsData.totalInvestment?.toLocaleString() || "0"}`,
      subtitle: loading ? "" : error ? "" : `${statsData.activePlanCount || 0} active plans (of ${statsData.totalUsers || 0} users)`,
      change: "+8%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    }
  ];

  const quickActions = [
    {
      title: "View Users",
      icon: Eye,
      color: "text-blue-400",
      path: "/admin/users"
    },
    {
      title: "Withdrawals",
      icon: CreditCard,
      color: "text-orange-400",
      path: "/admin/withdrawals"
    },
    {
      title: "Messages",
      icon: MessageCircle,
      color: "text-purple-400",
      path: "/admin/chat"
    }
  ];

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section with Calculate ROI button */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm rounded-2xl p-6 relative">
        <div className="flex items-center gap-3">
          <div className="text-2xl">👋</div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Overview of your platform's performance
            </p>
          </div>
        </div>
        <Button 
          onClick={calculateROI}
          disabled={calculatingROI}
          className="absolute right-6 top-6 flex items-center gap-2"
          variant="outline"
        >
          {calculatingROI ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Calculate ROI
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`bg-black/40 backdrop-blur-xl border ${stat.borderColor} hover:bg-black/60 transition-all duration-300 group`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              {stat.subtitle && (
                <div className="text-sm text-gray-400 mb-2">
                  {stat.subtitle}
                </div>
              )}
              <div className="flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  {stat.change}
                </span>
                <span className="text-sm text-gray-400">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="h-24 flex flex-col space-y-3 bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm rounded-xl"
                onClick={() => handleQuickAction(action.path)}
              >
                <action.icon className={`h-6 w-6 ${action.color}`} />
                <span className="text-sm font-medium">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;