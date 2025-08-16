
import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TutorialVideo = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Learn How to Get Started
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Watch our step-by-step tutorial to understand how our platform works and start your investment journey
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-background border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
            <div className="relative aspect-video bg-muted/50 rounded-xl overflow-hidden group cursor-pointer">
              {/* Canvas for video */}
              <canvas 
                id="tutorial-video-canvas"
                className="w-full h-full object-cover"
                width="800"
                height="450"
              />
              
              {/* Video overlay controls */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 sm:w-20 sm:h-20 bg-primary hover:bg-primary/90 text-white shadow-xl"
                  >
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" fill="currentColor" />
                  </Button>
                </div>
              </div>
              
              {/* Video info overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Tutorial Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">HD Quality</span>
                </div>
              </div>
            </div>
            
            {/* Video description */}
            <div className="mt-6 text-center">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                Complete Investment Guide
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Learn everything from account setup to making your first investment in just 5 minutes
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>5 min watch</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Step-by-step guide</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Beginner friendly</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TutorialVideo;