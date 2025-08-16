import { motion } from "framer-motion";
import { Check, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Micro Plan",
    planType: "Micro Plan",
    minInvestment: "$100",
    maxInvestment: "$4,999",
    roi: "4%",
    period: "Monthly",
    features: [
      "4% Monthly ROI",
      "Minimum $100 investment",
      "Basic support",
      "Referral bonus eligible"
    ],
    popular: false
  },
  {
    name: "Saver Plan",
    planType: "Saver Plan",
    minInvestment: "$1,000",
    maxInvestment: "$9,999",
    roi: "4.5%",
    period: "Monthly",
    features: [
      "4.5% Monthly ROI",
      "Minimum $1,000 investment",
      "Priority support",
      "Higher referral bonus",
      "Advanced analytics"
    ],
    popular: true
  },
  {
    name: "Growth Plan",
    planType: "Growth Plan",
    minInvestment: "$10,000",
    maxInvestment: "$50,000+",
    roi: "5.15%",
    period: "Monthly",
    features: [
      "5.15% Monthly ROI",
      "Minimum $10,000 investment",
      "VIP support",
      "Maximum referral bonus",
      "Personal advisor",
      "Early access to new features"
    ],
    popular: false
  }
];

const InvestmentPlans = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBuyPlan = async (planType: string) => {
    if (!user) {
      toast.error("Please login to purchase a plan");
      navigate("/login");
      return;
    }

    try {
      // Use the access_token from auth context instead of localStorage
      if (!user.access_token) {
        toast.error("Authentication required. Please login again.");
        logout();
        navigate("/login");
        return;
      }

      toast.loading("Processing your request...");

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/api/plan/buy",
        { planType },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.dismiss();
      
      if (response.data?.paymentLink) {
        window.location.href = response.data.paymentLink;
      } else {
        throw new Error("No payment link received");
      }

    } catch (error) {
      toast.dismiss();
      
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          logout();
          navigate("/login");
        } else if (error.response?.status === 400 && error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Payment processing failed");
        }
      } else {
        toast.error("Failed to process plan purchase");
        console.error("Error:", error);
      }
    }
  };

  return (
    <section id="plans" className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-bold mb-6"
        >
          Choose Your{" "}
          <span className="text-gradient">Investment Plan</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-gray-400"
        >
          Select the perfect plan that matches your investment goals and risk tolerance
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
          >
            <Card className={`relative h-full glass ${plan.popular ? 'border-primary scale-105' : 'border-white/10'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">{plan.roi}</div>
                  <div className="text-sm text-gray-400">{plan.period} Returns</div>
                  <div className="text-lg font-semibold">
                    {plan.minInvestment}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full button-gradient"
                  onClick={() => handleBuyPlan(plan.planType)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default InvestmentPlans;