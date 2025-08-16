import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardCards from "@/components/dashboard/DashboardCards";

interface ApiData {
  roiEarnings?: {
    earnings: number;
    currency: string;
    formatted: string;
  };
  activePlan?: {
    planActive: boolean;
    hasPlan: boolean;
    message?: string;
    planDetails?: {
      name: string;
      amount: number;
      monthlyROI: number;
      totalEarned: number;
      daysRemaining?: number;
    };
    accountBalance?: number;
  };
  accountBalance?: {
    balance: number;
  };
  kycStatus?: {
    kycStatus: boolean;
    verified: boolean;
  };
}

const DashboardOverview = () => {
  const { user, isLoading } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [apiData, setApiData] = useState<ApiData>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<{message: string; details?: string} | null>(null);

  const fetchAllData = async () => {
    if (!user) return;

    try {
      setDataLoading(true);
      setError(null);

      const [roiRes, activePlanRes, balanceRes, kycRes] = await Promise.all([
        fetch('http://localhost:3000/api/info/roi-earnings', {
          headers: { 'Authorization': `Bearer ${user.access_token}` }
        }),
        fetch('http://localhost:3000/api/info/active-plan', {
          headers: { 'Authorization': `Bearer ${user.access_token}` }
        }),
        fetch('http://localhost:3000/api/info/account-balance', {
          headers: { 'Authorization': `Bearer ${user.access_token}` }
        }),
        fetch('http://localhost:3000/api/info/kyc-status', {
          headers: { 'Authorization': `Bearer ${user.access_token}` }
        })
      ]);

      // First check for HTTP errors
      if (!roiRes.ok || !activePlanRes.ok || !balanceRes.ok || !kycRes.ok) {
        throw new Error('One or more API requests failed');
      }

      const responses = await Promise.all([
        roiRes.json(),
        activePlanRes.json(),
        balanceRes.json(),
        kycRes.json()
      ]);

      // Check for API response errors
      const failedResponses = responses.filter(response => !response?.success);
      if (failedResponses.length > 0) {
        const errorMessages = failedResponses
          .map(r => r?.error?.message || 'Unknown error')
          .join('; ');
        throw new Error(`API errors: ${errorMessages}`);
      }

      // Transform data to match frontend expectations
      setApiData({
        roiEarnings: responses[0].data,
        activePlan: {
          planActive: responses[1].data?.planActive || false,
          hasPlan: responses[1].data?.hasPlan || false,
          message: responses[1].data?.message,
          planDetails: responses[1].data?.planDetails,
          accountBalance: responses[1].data?.accountBalance
        },
        accountBalance: responses[2].data,
        kycStatus: responses[3].data
      });

    } catch (err) {
      setError({
        message: 'Failed to load dashboard data',
        details: err instanceof Error ? err.message : 'Please try again later'
      });
      console.error('Error fetching dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  if (isLoading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Please log in to view the dashboard</h2>
      </div>
    );
  }

  const displayName = `${user.firstname || ''}${user.lastname ? ' ' + user.lastname : ''}`.trim() || 'User';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">👋</div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              {greeting}, {displayName}!
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your investments today.
            </p>
          </div>
        </div>
      </div>

      <DashboardCards 
        apiData={apiData} 
        loading={dataLoading} 
        error={error}
        retry={() => {
          setError(null);
          setDataLoading(true);
          setTimeout(() => fetchAllData(), 500);
        }}
      />
    </div>
  );
};

export default DashboardOverview;