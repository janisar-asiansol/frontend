"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Quote, Star, StarHalf } from "lucide-react";

interface Review {
  id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  username: string;
}

interface ApiResponse {
  success: boolean;
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/review/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        } else {
          setError("Failed to fetch reviews");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (!isHovered && reviews.length > 0) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    } else {
      controls.stop();
    }
  }, [isHovered, controls, reviews]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className="w-4 h-4 fill-yellow-400 text-yellow-400" 
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half" 
          className="w-4 h-4 fill-yellow-400 text-yellow-400" 
        />
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="w-4 h-4 text-yellow-400/30" 
        />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p>No testimonials available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-px bg-primary mr-4" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Testimonials
            </span>
            <div className="w-12 h-px bg-primary ml-4" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied traders who have transformed their trading experience
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-r from-background via-background/0 to-background [background-size:200%_100%] [background-position:center]" />

          <motion.div
            className="flex min-w-[200%] space-x-4 py-6"
            animate={controls}
          >
            {[...reviews, ...reviews].map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="w-[320px] flex-shrink-0 px-2"
                onMouseEnter={() => {
                  setIsHovered(true);
                  setActiveIndex(index % reviews.length);
                }}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Card className="h-full p-6 bg-card/60 border border-border/20 rounded-2xl backdrop-blur-md hover:border-primary/30 hover:shadow-lg transition-all group">
                  <Quote className="w-6 h-6 text-primary opacity-40 mb-4 group-hover:opacity-70 transition-opacity" />
                  <p className="text-foreground/90 mb-6 leading-relaxed text-sm group-hover:text-foreground transition-colors whitespace-pre-line">
                    {review.comment}
                  </p>
                  
                  {/* Star Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <Avatar className="h-12 w-12 border-2 border-primary/30 group-hover:border-primary/50 transition-colors">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {review.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {review.username}
                      </h4>
                      <p className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors">
                        Gold Investor
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;