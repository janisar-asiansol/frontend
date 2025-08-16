import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for reviews
const mockReviews = [
  {
    id: "1",
    user: {
      name: "Michael Chen",
      avatar: "https://avatars.githubusercontent.com/u/1234567?v=4",
    },
    rating: 5,
    review: "The platform's security measures give me peace of mind. I've been using it for months and never had any issues with transactions or data privacy. The team is constantly improving the features based on user feedback.",
    date: "2023-05-15",
    status: "approved",
  },
  {
    id: "2",
    user: {
      name: "Sarah Johnson",
      avatar: "https://avatars.githubusercontent.com/u/2345678?v=4",
    },
    rating: 4,
    review: "Great features but sometimes the interface feels slow, especially during peak hours. The charting tools are excellent though, and I appreciate the educational resources provided.",
    date: "2023-05-18",
    status: "pending",
  },
  {
    id: "3",
    user: {
      name: "David Wilson",
      avatar: "https://avatars.githubusercontent.com/u/3456789?v=4",
    },
    rating: 3,
    review: "Customer support could be more responsive. I had an issue with a withdrawal that took 3 days to resolve. The platform itself works fine, but the support experience needs improvement.",
    date: "2023-05-20",
    status: "pending",
  },
  {
    id: "4",
    user: {
      name: "Emily Zhang",
      avatar: "https://avatars.githubusercontent.com/u/4567890?v=4",
    },
    rating: 5,
    review: "The best trading platform I've used so far! The mobile app is particularly well-designed and has all the features of the desktop version. Execution speeds are excellent.",
    date: "2023-05-22",
    status: "approved",
  },
  {
    id: "5",
    user: {
      name: "James Rodriguez",
      avatar: "https://avatars.githubusercontent.com/u/5678901?v=4",
    },
    rating: 1,
    review: "Terrible experience, lost money due to platform issues during a market spike. The system froze and I couldn't close my positions. Support was unhelpful and didn't offer any compensation.",
    date: "2023-05-23",
    status: "rejected",
  },
];

const UserReviews = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: "approved" } : review
    ));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: "rejected" } : review
    ));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-500">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleReviewClick = (review: any) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">User Reviews</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage and moderate user reviews</p>
        </div>
      </div>



      {/* Desktop Table */}
      <Card className="hidden sm:block">
        <CardHeader>
          <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review Preview</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{review.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="line-clamp-2">{review.review}</div>
                  </TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleReviewClick(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {review.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => handleApprove(review.id)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => handleReject(review.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        <h2 className="text-lg font-bold">All Reviews ({filteredReviews.length})</h2>
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user.avatar} />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.user.name}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                {getStatusBadge(review.status)}
              </div>

              <div className="mt-3">
                {renderStars(review.rating)}
              </div>

              <div className="mt-3">
                <p className="line-clamp-2 text-sm">{review.review}</p>
              </div>

              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReviewClick(review)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full
                </Button>
                {review.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => handleApprove(review.id)}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => handleReject(review.id)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl w-[90vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedReview.user.avatar} />
                  <AvatarFallback>{selectedReview.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedReview.user.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedReview.date}</p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedReview.status)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Rating</h4>
                {renderStars(selectedReview.rating)}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Review</h4>
                <p className="whitespace-pre-line">{selectedReview.review}</p>
              </div>

              {selectedReview.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedReview.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      handleApprove(selectedReview.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReviews;