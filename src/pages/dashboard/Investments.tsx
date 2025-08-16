import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gem,
  BarChart2,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  CircleDollarSign
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface CurrentPlan {
  type: string;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  monthsRemaining: number;
  monthlyROI: number;
  totalEarned: number;
  principalReturn: number;
  principalReturned: boolean;
  formattedMonthlyROI: string;
}

interface ApiResponse {
  hasPlan: boolean;
  status: 'active' | 'completed';
  currentPlan?: CurrentPlan;
  accountBalance: number;
}

const Investments = () => {
  const [investmentData, setInvestmentData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user?.access_token) return;

      try {
        const response = await fetch("http://localhost:3000/api/plan/my-plan", {
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setInvestmentData(data);
      } catch (error) {
        console.error("Error fetching investment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.access_token, authLoading]);

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-blue-500";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateDurationMonths = (startDateString: string, endDateString: string) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // For Growth Plan (365 days), return 12 months
    if (diffDays === 365) {
      return 12;
    }
    
    // For other plans, calculate months normally
    const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth());
    return diffMonths;
  };

  const calculateDailyROI = (monthlyROI: number) => {
    // Assuming 30 days in a month for calculation
    return monthlyROI / 30 / 100; // Divide by 100 to convert percentage to decimal
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Gem className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">Please log in</h3>
        <p className="text-muted-foreground text-center max-w-md">
          You need to be logged in to view your investment plans.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investment Portfolio</h1>
          <p className="text-muted-foreground">Track your investment performance</p>
        </div>
        {investmentData?.accountBalance && (
          <div className="bg-primary/10 px-4 py-2 rounded-lg">
            <p className="text-sm text-muted-foreground">Account Balance</p>
            <p className="text-xl font-semibold text-primary">
              {formatCurrency(investmentData.accountBalance)}
            </p>
          </div>
        )}
      </div>

      {investmentData?.hasPlan && investmentData.currentPlan ? (
        <div className="grid gap-6">
          <Card className="border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Gem className="w-6 h-6 text-amber-500" />
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {investmentData.currentPlan.name}
                    </CardTitle>
                  </div>
                  <Badge className={`text-white ${getStatusColor(investmentData.status)}`}>
                    {investmentData.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Invested Amount</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(investmentData.currentPlan.amount)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* ROI Rate Card */}
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">ROI Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {investmentData.currentPlan.formattedMonthlyROI}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({(calculateDailyROI(investmentData.currentPlan.monthlyROI) * 100).toFixed(6)}% daily)
                  </p>
                </div>

                {/* Earnings Card */}
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CircleDollarSign className="w-4 h-4" />
                    <span className="text-sm">Earnings</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(investmentData.currentPlan.totalEarned)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Since {formatDate(investmentData.currentPlan.startDate)}
                  </p>
                </div>

                {/* Time Remaining Card */}
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time Remaining</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {calculateDaysRemaining(investmentData.currentPlan.endDate)} days
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Until {formatDate(investmentData.currentPlan.endDate)}
                  </p>
                </div>

                {/* Principal Return Card */}
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Principal Return</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {investmentData.status === 'completed' && investmentData.currentPlan.principalReturned
                      ? formatCurrency(investmentData.currentPlan.principalReturn)
                      : investmentData.status === 'completed'
                        ? 'Pending'
                        : 'At Maturity'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {investmentData.status === 'completed' 
                      ? 'Principal returned to balance'
                      : 'Will be returned after plan ends'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plan Timeline Card */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Plan Timeline
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Date</span>
                      <span>{formatDate(investmentData.currentPlan.startDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Date</span>
                      <span>{formatDate(investmentData.currentPlan.endDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span>
                        {calculateDurationMonths(
                          investmentData.currentPlan.startDate,
                          investmentData.currentPlan.endDate
                        )} month(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Projected Returns Card */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" />
                    Projected Returns
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Earnings</span>
                      <span>
                        {formatCurrency(
                          investmentData.currentPlan.amount * 
                          calculateDailyROI(investmentData.currentPlan.monthlyROI)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Earnings</span>
                      <span>
                        {formatCurrency(
                          investmentData.currentPlan.amount * 
                          (investmentData.currentPlan.monthlyROI / 100)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Projected</span>
                      <span>
                        {formatCurrency(
                          investmentData.currentPlan.amount * 
                          (investmentData.currentPlan.monthlyROI / 100) * 
                          calculateDurationMonths(
                            investmentData.currentPlan.startDate,
                            investmentData.currentPlan.endDate
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Gem className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">No Active Investments</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You currently don't have any active investment plans. Start investing to see your portfolio here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Investments;