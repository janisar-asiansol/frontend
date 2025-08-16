import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Eye, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  kyc_status: boolean;
  account_balance: number;
  no_of_users_referred: number;
  plan_bought: string | null;
}

const AdminUsers = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/info/admin/users', {
          headers: {
            'Authorization': `Bearer ${user?.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          throw new Error(data.error?.message || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-500" : "bg-yellow-500";
  };

  const getStatusText = (status: boolean) => {
    return status ? "Verified" : "Pending";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPlanText = (plan: string | null | undefined) => {
    if (plan === null || plan === undefined || plan === 'NULL' || plan === 'null' || plan.trim() === '') {
      return "NO Plan Purchased";
    }
    return plan;
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const phone = user.phone ? user.phone.toLowerCase() : '';
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery.toLowerCase())
    );
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage and monitor all users</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name, email or phone..."
          className="pl-10 w-full"
        />
      </div>

      <Card className="hidden sm:block">
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Invested</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.firstname} {user.lastname}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.phone || 'Not provided'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.kyc_status)}>
                        {getStatusText(user.kyc_status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getPlanText(user.plan_bought)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(user.account_balance)}
                    </TableCell>
                    <TableCell>{user.no_of_users_referred}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleUserClick(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="sm:hidden space-y-4">
        <h2 className="text-lg font-bold">All Users ({filteredUsers.length})</h2>
        {filteredUsers.map((user) => (
          <Card key={user.user_id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.firstname} {user.lastname}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(user.kyc_status)}>
                  {getStatusText(user.kyc_status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Invested</p>
                  <p className="font-medium">{getPlanText(user.plan_bought)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Balance</p>
                  <p className="font-medium text-green-600">
                    {formatCurrency(user.account_balance)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Referrals</p>
                  <p className="font-medium">{user.no_of_users_referred}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleUserClick(user)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl w-[90vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>
              User Details - {selectedUser?.firstname} {selectedUser?.lastname}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Name:</span> {selectedUser.firstname} {selectedUser.lastname}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedUser.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {selectedUser.phone || 'Not provided'}</p>
                    <p><span className="text-muted-foreground">KYC Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedUser.kyc_status)}`}>
                        {getStatusText(selectedUser.kyc_status)}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Financial Information</h4>
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Account Balance:</span> 
                      {formatCurrency(selectedUser.account_balance)}
                    </p>
                    <p><span className="text-muted-foreground">Active Plan:</span> 
                      {getPlanText(selectedUser.plan_bought)}
                    </p>
                    <p><span className="text-muted-foreground">Referrals:</span> 
                      {selectedUser.no_of_users_referred}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;