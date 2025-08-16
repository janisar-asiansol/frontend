
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  ArrowDownToLine,
  Clock,
  CheckCircle
} from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "ROI Earned",
      description: "Daily ROI from Bitcoin Pro Plan",
      amount: "+4.17 USDT",
      time: "2 hours ago",
      status: "completed",
      icon: TrendingUp
    },
    {
      id: 2,
      type: "Referral Bonus",
      description: "Commission from John Smith",
      amount: "+2.50 USDT",
      time: "5 hours ago",
      status: "completed",
      icon: Users
    },
    {
      id: 3,
      type: "Investment",
      description: "New investment in Ethereum Elite",
      amount: "-1000 USDT",
      time: "1 day ago",
      status: "completed",
      icon: TrendingUp
    },
    {
      id: 4,
      type: "Withdrawal",
      description: "Withdrawal to USDT wallet",
      amount: "-150 USDT",
      time: "2 days ago",
      status: "completed",
      icon: ArrowDownToLine
    },
    {
      id: 5,
      type: "ROI Earned",
      description: "Daily ROI from Ethereum Elite",
      amount: "+6.67 USDT",
      time: "1 day ago",
      status: "completed",
      icon: TrendingUp
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getAmountColor = (amount: string) => {
    return amount.startsWith('+') ? 'text-green-500' : 'text-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className={`font-semibold ${getAmountColor(activity.amount)}`}>
                  {activity.amount}
                </p>
                <Badge variant="secondary" className={getStatusColor(activity.status)}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {activity.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
