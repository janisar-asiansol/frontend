import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, isLoading } = useAuth(); // Destructure user directly from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!user?.access_token) { // Check for access_token instead of isAuthenticated
      setError("You need to be logged in to submit a review");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/review/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.access_token}` // Use user.access_token
        },
        body: JSON.stringify({
          rating,
          comment: reviewText,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }
        throw new Error("Your review already exists.");
      }

      const data = await response.json();
      console.log("Review submitted successfully:", data);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        navigate("/dashboard", { state: { reviewSubmitted: true } });
      }, 1500);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error instanceof Error ? error.message : "There was an error submitting your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!user) { // Check for user instead of authState.isAuthenticated
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-4">You need to be logged in to submit a review.</p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitSuccess ? (
            <div className="text-center p-6">
              <div className="text-green-500 text-2xl font-bold mb-4">
                Thank You!
              </div>
              <p className="text-lg">
                Your review has been submitted successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">
                  How would you rate your experience?
                </h3>
                <div className="flex justify-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {(hoverRating || rating) >= star ? (
                        <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="w-10 h-10 text-yellow-400/30" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {rating === 0
                    ? "Select your rating"
                    : `You rated ${rating} star${rating > 1 ? "s" : ""}`}
                </p>
              </div>

              {/* Review Text */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Tell us more about your experience
                </h3>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like about our platform? What could be improved?"
                  className="min-h-[150px]"
                  required
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-500 text-center">{error}</div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-6 text-lg"
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPage;