
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, Shield, ArrowRight, Star } from "lucide-react";

const PromotionalBanner = () => {
  const promotions = [
    {
      icon: Users,
      title: "Referral Bonus",
      description: "Refer 3 friends, earn 1.5% bonus",
      badge: "Limited Time",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      action: "Invite Friends",
    },
    {
      icon: Shield,
      title: "KYC Verification",
      description: "KYC verified users get faster withdrawals",
      badge: "Recommended",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      action: "Complete KYC",
    },
    {
      icon: Star,
      title: "Premium Plan",
      description: "Upgrade to premium for 2x rewards",
      badge: "Premium",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      action: "Upgrade Now",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Promotions & Alerts</h3>
      
      {promotions.map((promo, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${promo.bgColor}`}>
                  <promo.icon className={`h-5 w-5 ${promo.color}`} />
                </div>
                <CardTitle className="text-base">{promo.title}</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                {promo.badge}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              {promo.description}
            </p>
            <Button size="sm" className="w-full">
              {promo.action}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
      
      {/* Achievement Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-primary">Achievement Unlocked!</h4>
              <p className="text-sm text-muted-foreground">
                You've earned over 400 USDT in rewards
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionalBanner;
