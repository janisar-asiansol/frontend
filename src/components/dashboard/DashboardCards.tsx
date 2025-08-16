import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, Shield, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface DashboardCardsProps {
  apiData: {
    roiEarnings?: {
      earnings: number;
      formatted: string;
    };
    activePlan?: {
      planActive: boolean;
      hasPlan: boolean;
      message?: string;
      planDetails?: {
        name: string;
        amount: number;
        monthlyROI: number;
        totalEarned: number;
        daysRemaining?: number;
      };
      accountBalance?: number;
    };
    accountBalance?: {
      balance: number;
    };
    kycStatus?: {
      verified: boolean;
    };
  };
  loading: boolean;
  error: {message: string; details?: string} | null;
  retry: () => void;
}

const DashboardCards = ({ apiData, loading, error, retry }: DashboardCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border border-muted/20 h-full animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold h-6 w-24 bg-muted/20 rounded"></CardTitle>
              <div className="p-3 rounded-xl bg-muted/20 border border-muted/20">
                <div className="h-6 w-6 bg-muted/20 rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-8 w-32 bg-muted/20 rounded"></div>
              <div className="h-4 w-40 bg-muted/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-medium text-red-500">{error.message}</h3>
        </div>
        <p className="text-red-400">{error.details}</p>
        <Button 
          variant="outline" 
          className="border-red-500/30 text-red-500 hover:bg-red-500/10"
          onClick={retry}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const cards = [
    {
      title: "ROI Earnings",
      amount: apiData.roiEarnings ? formatCurrency(apiData.roiEarnings.earnings) : formatCurrency(0),
      subtitle: "Total earnings from your investment",
      icon: TrendingUp,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Account Balance",
      amount: apiData.accountBalance ? formatCurrency(apiData.accountBalance.balance) : 
             apiData.activePlan?.accountBalance ? formatCurrency(apiData.activePlan.accountBalance) : 
             formatCurrency(0),
      subtitle: "Available for withdrawal",
      icon: Wallet,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Active Plan",
      amount: apiData.activePlan?.hasPlan 
        ? apiData.activePlan.planDetails?.name || "Active Plan"
        : "No active plan",
      subtitle: apiData.activePlan?.hasPlan 
        ? `${((apiData.activePlan.planDetails?.monthlyROI || 0.04) * 100).toFixed(2)}% Monthly ROI` + 
          (apiData.activePlan.planDetails?.daysRemaining 
            ? ` • ${apiData.activePlan.planDetails.daysRemaining} days remaining` 
            : '')
        : apiData.activePlan?.message || "",
      icon: Gem,
      color: apiData.activePlan?.planActive ? "text-blue-400" : "text-gray-400",
      bgColor: apiData.activePlan?.planActive ? "bg-blue-500/10" : "bg-gray-500/10",
      borderColor: apiData.activePlan?.planActive ? "border-blue-500/20" : "border-gray-500/20",
      badge: apiData.activePlan?.planActive ? "Active" : undefined,
    },
    {
      title: "KYC Status",
      amount: apiData.kycStatus?.verified ? "Verified" : "Not Verified",
      subtitle: apiData.kycStatus?.verified ? "Identity confirmed" : "Verification needed",
      icon: Shield,
      color: apiData.kycStatus?.verified ? "text-green-400" : "text-red-400",
      bgColor: apiData.kycStatus?.verified ? "bg-green-500/10" : "bg-red-500/10",
      borderColor: apiData.kycStatus?.verified ? "border-green-500/20" : "border-red-500/20",
      badge: apiData.kycStatus?.verified ? "Verified" : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className={`bg-card/50 backdrop-blur-sm border ${card.borderColor} hover:border-primary/50 transition-all duration-300 h-full flex flex-col`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-3 rounded-xl ${card.bgColor} ${card.borderColor} border`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <div className={`text-3xl font-bold ${card.color}`}>
                  {card.amount}
                </div>
                {card.badge && (
                  <Badge className={`${card.bgColor} ${card.color} border${card.borderColor}`}>
                    {card.badge}
                  </Badge>
                )}
              </div>
              {card.subtitle && (
                <p className="text-sm text-muted-foreground">
                  {card.subtitle}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;