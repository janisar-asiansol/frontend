
import { motion } from "framer-motion";
import { Users, TrendingUp, Shield, Award } from "lucide-react";

const stats = [{
  icon: Users,
  number: "50,000+",
  label: "Active Investors",
  description: "Trusted worldwide"
}, {
  icon: TrendingUp,
  number: "$2.5M+",
  label: "Total Invested",
  description: "Growing daily"
}, {
  icon: Shield,
  number: "99.9%",
  label: "Security Rate",
  description: "Bank-level protection"
}, {
  icon: Award,
  number: "4.9/5",
  label: "User Rating",
  description: "Excellent reviews"
}];

const TrustedByTraders = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of successful investors who trust our platform
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustedByTraders;
