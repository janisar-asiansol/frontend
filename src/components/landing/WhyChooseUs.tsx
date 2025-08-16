
import { motion } from "framer-motion";
import { Shield, Users, Headphones, TrendingUp, Zap, Award, Lock, Eye, Clock, DollarSign } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your investments are protected with military-grade encryption and multi-factor authentication",
    highlight: "99.9% Security Rate"
  },
  {
    icon: TrendingUp,
    title: "Guaranteed Returns",
    description: "Enjoy consistent 5% monthly returns with our proven investment strategies and market expertise",
    highlight: "5% Monthly ROI"
  },
  {
    icon: Zap,
    title: "Instant Withdrawals",
    description: "Access your funds immediately with our lightning-fast withdrawal system - no waiting periods",
    highlight: "24/7 Access"
  },
  {
    icon: Users,
    title: "Thriving Community",
    description: "Join 50,000+ successful investors in our global community with exclusive insights and tips",
    highlight: "50K+ Members"
  },
  {
    icon: Award,
    title: "KYC Verified Platform",
    description: "Fully compliant and regulated platform ensuring complete transparency and legal compliance",
    highlight: "Fully Licensed"
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Get instant help from our dedicated support team and AI-powered chatbot whenever you need it",
    highlight: "Always Available"
  }
];

const stats = [
  { icon: DollarSign, label: "Total Investment Volume", value: "$2.5M+" },
  { icon: Users, label: "Active Investors", value: "50K+" },
  { icon: TrendingUp, label: "Average Monthly ROI", value: "5%" },
  { icon: Clock, label: "Years in Operation", value: "3+" }
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background pattern */}
      {/* <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)) 0%, transparent 70%), radial-gradient(circle at 70% 70%, hsl(var(--primary) / 0.5) 0%, transparent 70%)',
          backgroundSize: '600px 600px',
          backgroundPosition: '0 0, 300px 300px'
        }} />
      </div> */}
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-2 rounded-full glass border border-primary/20"
          >
            <span className="text-sm font-medium text-primary">
              Why Choose Our Platform
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            The Smart Choice for 
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gold Investment
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the most secure, profitable, and user-friendly Gold investment platform 
            designed for both beginners and experienced traders
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="relative p-8 h-full rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10">
                  {/* Highlight Badge */}
                  <div className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full border border-primary/20">
                    {feature.highlight}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative p-8 rounded-2xl bg-card border border-border"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-block p-6 rounded-2xl glass border border-primary/20">
            <p className="text-lg text-muted-foreground mb-4">
              Ready to join thousands of successful investors?
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
              Start Investing Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
