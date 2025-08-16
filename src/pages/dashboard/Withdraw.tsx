import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wallet, 
  ArrowDownToLine, 
  CheckCircle,
  AlertCircle,
  CreditCard,
  BadgeInfo,
  Banknote, 
  CircleDollarSign,
  Bitcoin,
  Loader2,
  RefreshCw,
  Zap,
  Hexagon,
  Activity,
  MountainSnow,
  Dog,
  Diamond,
  Dot,
  Layers,
  Star,
  Cpu,
  Sun,
  Atom,
  Sparkles,
  Coins
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Withdraw = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const minimumWithdraw = 50.00;
  const WITHDRAWAL_FEE_PERCENT = 2.5;

  // Fetch account balance
  const fetchBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/info/account-balance", {
        headers: {
          "Authorization": `Bearer ${user?.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }

      const data = await response.json();
      setAvailableBalance(data.data.balance || 0);
    } catch (error) {
      console.error("Balance fetch error:", error);
      toast({
        title: "Balance Error",
        description: error instanceof Error ? error.message : "Failed to fetch balance",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Load balance on mount and when token changes
  useEffect(() => {
    if (user?.access_token) {
      fetchBalance();
    }
  }, [user?.access_token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "amount") {
      // Remove any non-numeric characters except decimal point
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      
      // Prevent multiple decimal points
      const decimalCount = sanitizedValue.split('.').length - 1;
      const validValue = decimalCount > 1 ? 
        sanitizedValue.substring(0, sanitizedValue.lastIndexOf('.')) : 
        sanitizedValue;
      
      // If there's a value, parse it and validate
      if (validValue) {
        const amount = parseFloat(validValue);
        
        // Prevent negative values
        if (amount < 0) {
          toast({
            title: "Invalid Amount",
            description: "Amount cannot be negative",
            variant: "destructive",
          });
          return;
        }
        
        // Cap at available balance
        if (amount > availableBalance) {
          toast({
            title: "Amount Exceeds Balance",
            description: `Maximum withdrawal amount is ${availableBalance.toFixed(2)} USDT`,
            variant: "destructive",
          });
          setFormData(prev => ({
            ...prev,
            [name]: availableBalance.toString()
          }));
          return;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: validValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    if (amount < minimumWithdraw) {
      toast({
        title: "Invalid Amount",
        description: `Minimum withdrawal amount is ${minimumWithdraw} USDT`,
        variant: "destructive",
      });
      return;
    }
    
    if (amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.method) {
      toast({
        title: "Select Payment Method",
        description: "Please select a withdrawal method",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.address) {
      toast({
        title: "Wallet Address Required",
        description: "Please enter your wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({
          amount: amount,
          method: formData.method.toUpperCase(),
          address: formData.address
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Withdrawal failed");
      }

      toast({
        title: "Withdrawal Submitted",
        description: data.message || "Your withdrawal request has been submitted for processing",
      });

      // Reset form and refresh balance
      setFormData({
        amount: "",
        method: "",
        address: ""
      });
      await fetchBalance();

    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Withdrawal Failed",
        description: error instanceof Error ? error.message : "An error occurred during withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const withdrawalStats = [
    {
      title: "Available Balance",
      amount: isLoadingBalance ? (
        <Loader2 className="h-5 w-5 animate-spin inline" />
      ) : (
        `${availableBalance.toFixed(2)} USDT`
      ),
      icon: Wallet,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      action: (
        <button 
          onClick={fetchBalance}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
          disabled={isLoadingBalance}
        >
          <RefreshCw className={`h-3 w-3 inline mr-1 ${isLoadingBalance ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Withdraw Funds</h1>
          <p className="text-muted-foreground mt-2">
            Transfer your earnings to your preferred payment method
          </p>
        </div>
      </div>

      {/* Withdrawal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {withdrawalStats.map((stat, index) => (
          <Card 
            key={index} 
            className={`bg-card/50 backdrop-blur-sm border ${stat.borderColor} hover:border-primary/50 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.amount}</div>
              <div className="mt-2">{stat.action}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-primary" />
            Withdrawal Request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BadgeInfo className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-blue-400">Important Information</h3>
            </div>
            <ul className="text-sm text-blue-400 space-y-1">
              <li>• Minimum withdrawal amount: {minimumWithdraw} USDT</li>
              <li>• Processing fee: {WITHDRAWAL_FEE_PERCENT}% of withdrawal amount</li>
              <li>• Processing time: 24-48 hours</li>
              <li>• KYC verification required for withdrawals</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Withdrawal Amount (USDT)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      if (value < minimumWithdraw) {
                        setFormData(prev => ({
                          ...prev,
                          amount: minimumWithdraw.toString()
                        }));
                        toast({
                          title: "Minimum Amount",
                          description: `Amount adjusted to minimum ${minimumWithdraw} USDT`,
                        });
                      } else if (value > availableBalance) {
                        setFormData(prev => ({
                          ...prev,
                          amount: availableBalance.toString()
                        }));
                      }
                    }
                  }}
                  className="bg-background/90 hover:bg-background focus:bg-background focus:ring-0 focus:ring-offset-0 focus:border-0 border-border/99"
                  min={minimumWithdraw}
                  max={availableBalance}
                  disabled={isLoadingBalance}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Available: {isLoadingBalance ? (
                    <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
                  ) : (
                    `${availableBalance.toFixed(2)} USDT`
                  )}
                </p>
              </div>

              <div>
                <Label htmlFor="method">Withdrawal Method</Label>
                <Select 
                  value={formData.method}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}
                  disabled={isLoadingBalance}
                >
                  <SelectTrigger className="bg-background/90 hover:bg-background focus:bg-background focus:ring-0 focus:ring-offset-0 focus:border-0 border-border/99">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT-TRC20">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-green-500" /> USDT (TRC20)
                      </div>
                    </SelectItem>
                    <SelectItem value="USDT-ERC20">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-blue-500" /> USDT (ERC20)
                      </div>
                    </SelectItem>
                    <SelectItem value="BTC">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="h-4 w-4 text-yellow-500" /> Bitcoin (BTC)
                      </div>
                    </SelectItem>
                    <SelectItem value="ETH">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-500" /> Ethereum (ETH)
                      </div>
                    </SelectItem>
                    <SelectItem value="BNB-BEP20">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-orange-500" /> BNB (BEP20)
                      </div>
                    </SelectItem>
                    <SelectItem value="BTC-LN">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-300" /> Bitcoin Lightning Network
                      </div>
                    </SelectItem>
                    <SelectItem value="TRX">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-red-500" /> TRON (TRX)
                      </div>
                    </SelectItem>
                    <SelectItem value="MATIC">
                      <div className="flex items-center gap-2">
                        <Hexagon className="h-4 w-4 text-purple-400" /> Polygon (MATIC)
                      </div>
                    </SelectItem>
                    <SelectItem value="SOL">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-400" /> Solana (SOL)
                      </div>
                    </SelectItem>
                    <SelectItem value="AVAX">
                      <div className="flex items-center gap-2">
                        <MountainSnow className="h-4 w-4 text-red-400" /> Avalanche (AVAX)
                      </div>
                    </SelectItem>
                    <SelectItem value="DOGE">
                      <div className="flex items-center gap-2">
                        <Dog className="h-4 w-4 text-yellow-600" /> Dogecoin (DOGE)
                      </div>
                    </SelectItem>
                    <SelectItem value="ADA">
                      <div className="flex items-center gap-2">
                        <Diamond className="h-4 w-4 text-blue-400" /> Cardano (ADA)
                      </div>
                    </SelectItem>
                    <SelectItem value="DOT">
                      <div className="flex items-center gap-2">
                        <Dot className="h-4 w-4 text-pink-500" /> Polkadot (DOT)
                      </div>
                    </SelectItem>
                    <SelectItem value="ARB">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-300" /> Arbitrum (ARB)
                      </div>
                    </SelectItem>
                    <SelectItem value="XLM">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-400" /> Stellar (XLM)
                      </div>
                    </SelectItem>
                    <SelectItem value="ALGO">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-black" /> Algorand (ALGO)
                      </div>
                    </SelectItem>
                    <SelectItem value="XRP">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-blue-600" /> Ripple (XRP)
                      </div>
                    </SelectItem>
                    <SelectItem value="OP">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-400" /> Optimism (OP)
                      </div>
                    </SelectItem>
                    <SelectItem value="ATOM">
                      <div className="flex items-center gap-2">
                        <Atom className="h-4 w-4 text-purple-600" /> Cosmos (ATOM)
                      </div>
                    </SelectItem>
                    <SelectItem value="KSM">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-pink-400" /> Kusama (KSM)
                      </div>
                    </SelectItem>
                    <SelectItem value="LTC">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-gray-500" /> Litecoin (LTC)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Wallet Address / Account Details</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter wallet address or account details"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-background/90 hover:bg-background focus:bg-background focus:ring-0 focus:ring-offset-0 focus:border-0 border-border/99"
                  disabled={isLoadingBalance}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  Withdrawal Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Withdrawal Amount:</span>
                    <span className="font-medium">
                      {formData.amount ? parseFloat(formData.amount).toFixed(2) : "0.00"} USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Fee ({WITHDRAWAL_FEE_PERCENT}%):</span>
                    <span className="font-medium">
                      {formData.amount ? (parseFloat(formData.amount) * WITHDRAWAL_FEE_PERCENT / 100).toFixed(2) : "0.00"} USDT
                    </span>
                  </div>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <div className="flex justify-between font-semibold">
                    <span>You'll Receive:</span>
                    <span className="text-emerald-400">
                      {formData.amount ? (parseFloat(formData.amount) * (1 - WITHDRAWAL_FEE_PERCENT / 100)).toFixed(2) : "0.00"} USDT
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleWithdraw} 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                size="lg"
                disabled={isSubmitting || isLoadingBalance}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Request Withdrawal"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdraw;