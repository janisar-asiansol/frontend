import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, 
  CheckCircle,
  AlertCircle,
  Clock,
  MessageCircle,
  ExternalLink,
  User,
  FileText
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const KYCVerification = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<'not_started' | 'pending' | 'approved' | 'rejected'>('not_started');
  const [isLoading, setIsLoading] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const handleStartKYC = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      toast({
        title: "Starting KYC Verification",
        description: "Preparing your verification session...",
      });

      const response = await fetch('http://localhost:3000/api/kyc/start-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({ 
          user_id: user.user_id, 
          email: user.email 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to start KYC process');
      }

      if (data.success && data.data?.url) {
        setKycStatus('pending');
        setCompletionPercentage(100);
        
        // Open KYC in a new tab
        window.open(data.data.url, '_blank', 'noopener,noreferrer');
        
        toast({
          title: "KYC Started",
          description: "Please complete verification in the new window",
        });
      } else {
        throw new Error('Invalid response from KYC service');
      }
    } catch (error) {
      console.error('KYC Error:', error);
      toast({
        title: "KYC Failed",
        description: error.message || "Could not start verification process",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (kycStatus) {
      case 'not_started':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Not Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">In Progress</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (kycStatus) {
      case 'not_started':
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-amber-500" />;
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case 'rejected':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Identity Verification
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete KYC to unlock full account features and higher limits
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Verification Card */}
      <Card className="bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-300">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border ${kycStatus === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-primary/10 border-primary/20'} hover:border-primary/50 transition-all duration-300`}>
              {getStatusIcon()}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl flex items-center gap-2">
                Verification Status
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {kycStatus === 'not_started' && "Verify your identity to access all platform features"}
                {kycStatus === 'pending' && "Your verification is being processed (usually takes 1-3 days)"}
                {kycStatus === 'approved' && "Your identity has been successfully verified"}
                {kycStatus === 'rejected' && "Please review and resubmit your documents"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {kycStatus === 'not_started' && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-200">Secure Verification Process</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      We partner with trusted identity verification providers to ensure your data security
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleStartKYC}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md transition-all duration-300"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Preparing Verification...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Start Identity Verification
                  </>
                )}
              </Button>
            </div>
          )}

          {kycStatus === 'pending' && (
            <div className="space-y-4">
              <Progress value={completionPercentage} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Verification Progress</span>
                <span>{completionPercentage}%</span>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-200">Verification in Progress</h3>
                    <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                      Your documents are under review. You'll receive an email when complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {kycStatus === 'approved' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <div>
                  <h3 className="font-medium text-emerald-800 dark:text-emerald-200">Verification Complete</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                    Thank you for completing KYC. Your account now has full access.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold">Higher Limits</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300">
              <User className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Increased deposit and withdrawal limits after verification
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold">Full Access</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
              <FileText className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Unlock all platform features and investment opportunities
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold">Enhanced Security</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
              <ShieldCheck className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Additional security layers to protect your account and assets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Need Help With Verification?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Our support team is available 24/7 to assist with any verification questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="border-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat Support
            </Button>
            <Button 
              variant="outline" 
              className="border-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Verification Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCVerification;