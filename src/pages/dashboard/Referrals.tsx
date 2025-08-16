import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, DollarSign, Copy, Gift, Sparkles, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface ReferralData {
  code: string;
  earnings: number;
  referrals: number;
  totalEarnings: number;
}

const Referrals = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        // console.log("[DEBUG] Starting referral data fetch...");
        const response = await fetch('http://localhost:3000/api/info/referral-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user?.access_token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        // console.log("[DEBUG] Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        // console.log("[DEBUG] Full API response:", result);

        if (result?.success && result?.data?.code) {
          // console.log("[DEBUG] Valid referral data received:", result.data);
          setReferralData({
            code: result.data.code,
            earnings: result.data.earnings,
            referrals: result.data.referrals,
            totalEarnings: result.data.totalEarnings
          });
        } else {
          // console.warn("[DEBUG] API response missing expected data");
          toast({
            title: "Data Error",
            description: "Referral code not found in response",
            variant: "destructive"
          });
        }
      } catch (error) {
        // console.error("[DEBUG] Fetch error:", error);
        toast({
          title: "Network Error",
          description: error instanceof Error ? error.message : "Failed to fetch referral data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.access_token) {
      fetchReferralData();
    } else {
      // console.log("[DEBUG] No access token available");
      toast({
        title: "Authentication Required",
        description: "Please login to view referral information",
        variant: "destructive"
      });
      setLoading(false);
    }
  }, [user, toast]);

  const referralStats = [
    {
      title: "Total Referrals",
      value: referralData?.referrals ?? 0,
      icon: Users,
      color: "text-sky-400",
      bgColor: "bg-sky-500/10"
    },
    {
      title: "Referral Earnings",
      value: referralData?.earnings ?? 0,
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    }
  ];

  const handleCopyCode = async () => {
    if (!referralData?.code) return;
    
    try {
      await navigator.clipboard.writeText(referralData.code);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy referral code",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
          <p className="text-muted-foreground mt-2">
            Invite friends and earn <span className="font-semibold text-emerald-400">1-3% commission</span> on their investments
          </p>
        </div>
        <Sparkles className="h-8 w-8 text-amber-400" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {referralStats.map((stat, index) => (
          <Card key={index} className={`bg-card/50 backdrop-blur-sm border ${stat.bgColor.replace('bg', 'border')}/20`}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.title.includes('Earnings') 
                  ? `$${stat.value.toFixed(2)}` 
                  : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral Code Card */}
      <Card className="bg-amber-500/10 border border-amber-500/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-400" />
            Your Referral Code
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={referralData?.code || "No referral code available"}
                readOnly
                className="font-mono border-2 border-primary/20 bg-background/50 h-12"
              />
            </div>
            <Button
              onClick={handleCopyCode}
              disabled={!referralData?.code}
              className="h-12 px-6 bg-primary hover:bg-primary/90"
            >
              <Copy className="h-4 w-4 mr-2" />
              {referralData?.code ? "Copy Code" : "No Code"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works Section */}
      <Card className="bg-card/50 border border-sky-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: 1,
                title: "Share Your Code",
                description: "Share your unique referral link with friends",
                color: "sky"
              },
              {
                step: 2,
                title: "They Sign Up",
                description: "Friends use your code when registering",
                color: "emerald"
              },
              {
                step: 3,
                title: "You Earn Rewards",
                description: "Get commission on their investments",
                color: "amber"
              }
            ].map((item) => (
              <div 
                key={item.step}
                className={`p-4 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/20`}
              >
                <div className={`w-10 h-10 bg-${item.color}-500/20 rounded-full flex items-center justify-center mb-3`}>
                  <span className={`text-lg font-bold text-${item.color}-400`}>
                    {item.step}
                  </span>
                </div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Referrals;