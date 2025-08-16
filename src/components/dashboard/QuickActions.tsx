
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ArrowDownToLine, 
  Users, 
  TrendingUp,
  Eye,
  Settings
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "New Investment",
      description: "Start a new investment plan",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/dashboard/investments"
    },
    {
      title: "Withdraw Funds",
      description: "Request a withdrawal",
      icon: ArrowDownToLine,
      color: "bg-green-500 hover:bg-green-600",
      href: "/dashboard/withdraw"
    },
    {
      title: "Refer Friends",
      description: "Share your referral link",
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/dashboard/referrals"
    },
    {
      title: "View Rewards",
      description: "Check your earnings",
      icon: TrendingUp,
      color: "bg-yellow-500 hover:bg-yellow-600",
      href: "/dashboard/rewards"
    },
    {
      title: "Track Performance",
      description: "View detailed analytics",
      icon: Eye,
      color: "bg-indigo-500 hover:bg-indigo-600",
      href: "/dashboard/investments"
    },
    {
      title: "Account Settings",
      description: "Manage your profile",
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
      href: "/dashboard/settings"
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
              asChild
            >
              <a href={action.href}>
                <div className={`p-3 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
