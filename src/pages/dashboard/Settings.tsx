import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Key, Lock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    phone: user?.phone || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Basic validation
      if (!formData.firstname.trim() || !formData.lastname.trim()) {
        throw new Error('First name and last name are required');
      }

      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/info/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          phone: formData.phone.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to update profile');
      }

      // Update user in auth context
      if (updateUser) {
        updateUser({
          ...user,
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          phone: formData.phone.trim()
        });
      }

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile, security, and notification preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-background/50 backdrop-blur-sm border border-border">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Profile Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstname">First Name</Label>
                  <Input 
                    id="firstname" 
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="bg-background focus:bg-background focus:ring-0 focus:ring-offset-0 focus:border-0 border-border/99 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input 
                    id="lastname" 
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="bg-background focus:bg-background focus:ring-0 focus:ring-offset-0 focus:border-0 border-border/99 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background focus:bg-background focus:ring-0 focus:ring-offset-0 focus:border-0 border-border/99 w-full"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSaveProfile} 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md mt-4"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;