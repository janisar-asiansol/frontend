import { motion } from "framer-motion";
import { Users, Gift, BarChart2, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReferralProgram = () => {
  const referralStats = [
    { icon: Users, value: "12", label: "Active Referrals", color: "text-primary" },
    { icon: BarChart2, value: "$2,400", label: "Total Earned", color: "text-green-500" },
    { icon: Award, value: "Growth", label: "Your Plan", color: "text-amber-400" },
    { icon: Zap, value: "3%", label: "Bonus Rate", color: "text-purple-400" }
  ];

  return (
    <section id="refer" className="container px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
                <Gift className="w-4 h-4 text-primary" />
                Earn Extra Income
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-gradient">1-3% Referral Bonus</span>{" "}
                for Every Friend
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Invite your friends to invest in gold and earn 1-3% of their investments. 
                The more you refer, the more you earn. Your unique referral link will be available after login.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-4">How It Works:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Share Your Link</h4>
                    <p className="text-sm text-muted-foreground">Get your unique link after logging in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">They Invest</h4>
                    <p className="text-sm text-muted-foreground">Your friend makes their first investment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                  <div className="w-10 h-10 bg-amber-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">You Earn</h4>
                    <p className="text-sm text-muted-foreground">Receive 1-3% of their investment amount</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                  <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Level Up</h4>
                    <p className="text-sm text-muted-foreground">Earn more with tiered referral bonuses</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="button-gradient">
              Login to Get Your Link
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="text-center text-foreground">Referral Rewards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {referralStats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-card rounded-lg border border-border">
                      <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 pt-2">
                  <h4 className="font-medium text-center text-foreground">Tiered Bonus Structure</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Micro Plan</span>
                      <span className="text-sm font-medium">1% bonus</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Saver Plan</span>
                      <span className="text-sm font-medium">2% bonus</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Growth Plan</span>
                      <span className="text-sm font-medium">3% bonus</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-4 border-t border-border">
                  <Button className="w-full button-gradient">
                    Login to Start Referring
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReferralProgram;