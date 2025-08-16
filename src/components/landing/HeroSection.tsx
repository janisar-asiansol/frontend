import { motion } from "framer-motion";
import { ArrowRight, Shield, Users, TrendingUp, Star, Sparkles, ChevronDown, TrendingUpIcon, DollarSign, BarChart3, Bitcoin, Zap, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-background pt-20 md:pt-0">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 bg-primary/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Minimal Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${25 + Math.random() * 50}%`,
          }}
          variants={floatingVariants}
          animate="animate"
          transition={{
            delay: i * 1.5,
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
          }}
        >
          <div className="w-1 h-1 bg-primary/20 rounded-full" />
        </motion.div>
      ))}

      <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left w-full flex flex-col items-center lg:items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 mb-4 sm:mb-6 w-full"
            >
              {[
                { icon: Shield, text: "SEC Regulated" },
                { icon: TrendingUp, text: "5% Monthly ROI" },
                { icon: Users, text: "12K+ Investors" }
              ].map((badge, index) => (
                <motion.div
                  key={badge.text}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full glass border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer flex-shrink-0"
                >
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <badge.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary flex-shrink-0" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {badge.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8 w-full">
              {/* Subtle Badge */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 py-1.5 rounded-full glass border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-primary">The Future of Gold Investment</span>
              </motion.div>

              {/* Main Heading */}
              <div className="mb-4 sm:mb-6">
                <motion.h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="block text-foreground mb-1 sm:mb-2"
                  >
                    Grow Your
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                  >
                    Gold Wealth
                  </motion.div>
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-6 sm:mb-8 text-center lg:text-left"
              >
                Join thousands of smart investors earning{" "}
                <span className="text-primary font-semibold">guaranteed monthly returns</span>{" "}
                with our secure, regulated Gold investment platform.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8 w-full"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild size="lg" className="button-gradient text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                  <Link to="/signup">
                    <span className="flex items-center gap-2">
                      Start Investing Now
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild size="lg" variant="outline" className="text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto">
                  <Link to="#plans">
                    View Investment Plans
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trusted by section */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 text-muted-foreground w-full"
            >
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/20 border border-background flex items-center justify-center"
                  >
                    <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-primary fill-current" />
                  </motion.div>
                ))}
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium ml-0 sm:ml-2 text-center lg:text-left">
                Trusted by 12,000+ investors
              </span>
            </motion.div>
          </motion.div>

         {/* Green Investment Visualization */}
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, delay: 0.5 }}
  className="hidden lg:flex items-center justify-center relative"
>
  <div className="relative w-[500px] h-[500px]">
    {/* Central investment element with green design */}
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative">
        <div className="w-32 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-md shadow-2xl shadow-green-500/30 flex items-center justify-center border border-green-300/40">
          <div className="text-4xl font-bold text-green-100 drop-shadow-lg">₲</div>
        </div>
        {/* Pulsing glow around central element */}
        <div className="absolute inset-0 rounded-md border border-green-400/30 animate-ping"></div>
        <div className="absolute inset-[-10px] rounded-md border border-green-300/20 animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>
    </motion.div>

    {/* Orbiting investment elements */}
    {[
      { icon: "₲", delay: 0, radius: 140, duration: 15, color: "from-green-400/20 to-green-600/40" },
      { icon: BarChart3, delay: 5, radius: 180, duration: 18, color: "from-green-300/20 to-green-500/40" },
      { icon: "₲", delay: 10, radius: 110, duration: 12, color: "from-green-500/20 to-green-700/40" },
      { icon: TrendingUp, delay: 3, radius: 160, duration: 16, color: "from-green-200/20 to-green-400/40" },
      { icon: "₲", delay: 8, radius: 200, duration: 22, color: "from-green-600/20 to-green-800/40" },
      { icon: Shield, delay: 12, radius: 120, duration: 14, color: "from-green-400/20 to-green-600/40" }
    ].map((orbit, index) => (
      <motion.div
        key={index}
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: orbit.duration,
          repeat: Infinity,
          ease: "linear",
          delay: orbit.delay,
        }}
      >
        <motion.div
          className={`absolute w-16 h-16 rounded-full bg-gradient-to-br ${orbit.color} backdrop-blur-xl border border-green-400/30 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
          style={{
            transform: `translateX(${orbit.radius}px)`,
          }}
          whileHover={{ scale: 1.3, rotateZ: 360 }}
          transition={{ duration: 0.3 }}
        >
          {typeof orbit.icon === 'string' ? (
            <div className="text-2xl font-bold text-green-100">{orbit.icon}</div>
          ) : (
            <orbit.icon className="w-8 h-8 text-green-100 drop-shadow-md" />
          )}
        </motion.div>
      </motion.div>
    ))}

    {/* Particle effects */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute bg-green-400/40 rounded-full ${i % 3 === 0 ? 'w-3 h-3' : i % 3 === 1 ? 'w-2 h-2' : 'w-1 h-1'}`}
        style={{
          left: `${15 + Math.random() * 70}%`,
          top: `${15 + Math.random() * 70}%`,
        }}
        animate={{
          y: [-15, 15, -15],
          opacity: [0.2, 0.8, 0.2],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 4 + Math.random() * 3,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}

    {/* Green-themed connection lines */}
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 500 500"
    >
      <defs>
        <linearGradient id="greenGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#4ade80" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="greenGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[...Array(8)].map((_, i) => (
        <motion.line
          key={i}
          x1={250}
          y1={250}
          x2={100 + Math.random() * 300}
          y2={100 + Math.random() * 300}
          stroke={i % 2 === 0 ? "url(#greenGradient1)" : "url(#greenGradient2)"}
          strokeWidth={Math.random() * 2 + 0.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 0], 
            opacity: [0, 0.6, 0] 
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}
    </svg>

    {/* Ambient glow effect */}
    <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>
  </div>
</motion.div>
        </div>
      </div>
      {/* Minimal Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <div className="w-4 h-6 sm:w-5 sm:h-8 border border-border rounded-full flex justify-center relative">
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-0.5 h-1.5 sm:h-2 bg-primary rounded-full mt-1 sm:mt-1.5"
            />
          </div>
          <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;