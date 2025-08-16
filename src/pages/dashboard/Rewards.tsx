
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gift, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Clock,
  CheckCircle
} from "lucide-react";

const Rewards = () => {
  const rewardStats = [
    {
      title: "Total Rewards",
      amount: "407.41 USDT",
      icon: Gift,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Monthly Rewards",
      amount: "156.23 USDT",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Referral Rewards",
      amount: "75.18 USDT",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Available to Withdraw",
      amount: "200.00 USDT",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  const rewardHistory = [
    { date: "2024-01-15", type: "Investment ROI", amount: "4.17 USDT", status: "Completed", plan: "Bitcoin Pro Plan" },
    { date: "2024-01-14", type: "Referral Bonus", amount: "2.50 USDT", status: "Completed", plan: "User Registration" },
    { date: "2024-01-14", type: "Investment ROI", amount: "6.67 USDT", status: "Completed", plan: "Ethereum Elite" },
    { date: "2024-01-13", type: "Investment ROI", amount: "4.17 USDT", status: "Completed", plan: "Bitcoin Pro Plan" },
    { date: "2024-01-12", type: "Promotional Bonus", amount: "10.00 USDT", status: "Completed", plan: "Welcome Bonus" }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Investment ROI": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Referral Bonus": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Promotional Bonus": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rewards</h1>
          <p className="text-muted-foreground">Track your earnings and reward history</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Reward Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.amount}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reward Tabs */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Reward History</TabsTrigger>
          <TabsTrigger value="pending">Pending Rewards</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reward History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardHistory.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{reward.type}</p>
                          <Badge variant="secondary" className={getTypeColor(reward.type)}>
                            {reward.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{reward.plan}</p>
                        <p className="text-xs text-muted-foreground">{reward.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">+{reward.amount}</p>
                      <p className="text-xs text-muted-foreground">{reward.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No pending rewards</p>
                <p className="text-muted-foreground">All rewards have been processed</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Reward Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Reward Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Investment ROI</span>
                      <span className="font-medium">332.23 USDT (81.5%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Referral Bonus</span>
                      <span className="font-medium">50.18 USDT (12.3%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Promotional Bonus</span>
                      <span className="font-medium">25.00 USDT (6.2%)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Performance Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Daily ROI</span>
                      <span className="font-medium">12.5 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Day</span>
                      <span className="font-medium">25.0 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Days Active</span>
                      <span className="font-medium">32 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rewards;
