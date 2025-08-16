
import { motion } from "framer-motion";
import { UserPlus, CreditCard, TrendingUp, Wallet, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your account with verified KYC documentation for secure transactions"
  },
  {
    icon: CreditCard,
    title: "Buy Plan",
    description: "Choose your investment plan and make secure Gold payments"
  },
  {
    icon: TrendingUp,
    title: "Get Monthly ROI",
    description: "Receive consistent monthly returns directly to your wallet"
  },
  {
    icon: Wallet,
    title: "Withdraw Anytime",
    description: "Access your funds whenever you need them with instant withdrawals"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 bg-background overflow-hidden">
      {/* Background pattern */}
      {/* <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 70%)',
          backgroundSize: '400px 400px',
          backgroundPosition: '0 0, 200px 200px'
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
              Simple Process
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start your Gold investment journey in four simple steps and begin earning 
            <span className="text-primary font-semibold"> consistent monthly returns</span>
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 mb-20 last:mb-0`}
            >
              {/* Step Card */}
              <div className="flex-1 group">
                <div className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/40 rounded-full" />
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <CheckCircle className="w-5 h-5" />
                      <span>Quick & Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Element */}
              <div className="flex-1 flex justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                  className="relative"
                >
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <step.icon className="w-24 h-24 text-primary/60" />
                    </div>
                  </div>
                  
                  {/* Connecting arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-16 transform -translate-y-1/2">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.6, duration: 0.5 }}
                        className="flex items-center gap-2 text-primary/60"
                      >
                        <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-transparent" />
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-block p-6 rounded-2xl glass border border-primary/20">
            <p className="text-lg text-muted-foreground mb-4">
              Ready to start your investment journey?
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
              Get Started Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
