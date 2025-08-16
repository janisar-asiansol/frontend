import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Check, X, Clock, Loader2, CircleDollarSign, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  processed_at: string | null;
  admin_notes: string | null;
  processed_by: string | null;
  fee: number;
  gross_amount: number;
  first_name: string;
  email: string;
}

const safeToFixed = (value: number | null | undefined, decimals = 2): string => {
  return value?.toFixed?.(decimals) || '0.00';
};

const AdminWithdrawals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    const fetchAllWithdrawals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/withdraw/admin", {
          headers: {
            "Authorization": `Bearer ${user?.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch withdrawals");
        }
        
        const data = await response.json();
        setWithdrawals(data.data);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        toast({
          title: "Error",
          description: "Failed to load withdrawal requests",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.access_token) {
      fetchAllWithdrawals();
    }
  }, [user?.access_token, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Check className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (id: string, newStatus: "approved" | "rejected") => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:3000/api/withdraw/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: adminNotes || `Processed by admin`,
          processed_by: user?.user_id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update withdrawal status");
      }

      const updatedWithdrawal = await response.json();

      setWithdrawals(prev =>
        prev.map(w => w.id === id ? {
          ...w,
          status: updatedWithdrawal.data.status,
          processed_at: updatedWithdrawal.data.processed_at,
          admin_notes: updatedWithdrawal.data.admin_notes,
          processed_by: updatedWithdrawal.data.processed_by
        } : w)
      );

      toast({
        title: "Status Updated",
        description: `Withdrawal #${id.slice(0, 8)} has been ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating withdrawal:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update withdrawal status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setAdminNotes("");
    }
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: withdrawals.length,
    pending: withdrawals.filter(w => w.status === "pending").length,
    approved: withdrawals.filter(w => w.status === "approved").length,
    rejected: withdrawals.filter(w => w.status === "rejected").length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Withdrawal Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Review and process all withdrawal requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Requests</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.all}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or wallet address..."
            className="pl-10 w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} 
            Withdrawals ({filteredWithdrawals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{withdrawal.first_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{withdrawal.first_name || `User ${withdrawal.user_id.slice(0, 5)}`}</p>
                          <p className="text-sm text-muted-foreground">{withdrawal.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${safeToFixed(withdrawal.gross_amount)}
                      <p className="text-xs text-muted-foreground">
                        Fee: ${safeToFixed(withdrawal.fee)} 
                        ({withdrawal.fee && withdrawal.gross_amount ? 
                          ((withdrawal.fee / withdrawal.gross_amount) * 100).toFixed(2) : 
                          '0.00'}%)
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{withdrawal.method}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate font-mono text-sm">
                        {withdrawal.address}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(withdrawal.created_at)}
                      {withdrawal.processed_at && (
                        <p className="text-xs text-muted-foreground">
                          Processed: {formatDate(withdrawal.processed_at)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {getStatusIcon(withdrawal.status)}
                        <span className="ml-1 capitalize">{withdrawal.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {withdrawal.status === "pending" ? (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                  <Check className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Approve Withdrawal</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <div className="space-y-4">
                                      <p>Approve this withdrawal for ${safeToFixed(withdrawal.gross_amount)}?</p>
                                      <div className="space-y-2">
                                        <Label>Admin Notes</Label>
                                        <Input
                                          value={adminNotes}
                                          onChange={(e) => setAdminNotes(e.target.value)}
                                          placeholder="Optional notes"
                                        />
                                      </div>
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleStatusUpdate(withdrawal.id, "approved")}
                                    disabled={isUpdating}
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Approve
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Withdrawal</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <div className="space-y-4">
                                      <p>Reject this withdrawal request?</p>
                                      <div className="space-y-2">
                                        <Label>Reason for rejection</Label>
                                        <Input
                                          value={adminNotes}
                                          onChange={(e) => setAdminNotes(e.target.value)}
                                          placeholder="Enter reason"
                                          required
                                        />
                                      </div>
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleStatusUpdate(withdrawal.id, "rejected")}
                                    disabled={isUpdating || !adminNotes}
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-gray-600 hover:text-gray-700"
                            disabled
                          >
                            <Eye className="h-4 w-4" />
                            <span className="ml-1">View</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWithdrawals;