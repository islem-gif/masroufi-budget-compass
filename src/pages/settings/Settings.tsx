
import { useState } from 'react';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Globe, Moon, Sun, Bell, Lock, User, CreditCard, UserCog, HelpCircle } from 'lucide-react';

const Settings = () => {
  const { user, toggleDarkMode, changeLanguage, changeCurrency, updateUserProfile } = useMasroufi();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    language: user?.language || "fr",
    currency: user?.currency || "TND",
    darkMode: user?.darkMode || false,
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      weeklyReports: true,
      dealAlerts: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      showBalance: true
    }
  });
  
  // Update handler for general user info
  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone
      });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handler for language change
  const handleLanguageChange = (value: string) => {
    setUserData({ ...userData, language: value as 'fr' | 'en' });
    changeLanguage(value as 'fr' | 'en');
    toast({
      title: "Language Changed",
      description: value === 'fr' ? "La langue a été changée en français" : "Language has been changed to English"
    });
  };
  
  // Handler for currency change
  const handleCurrencyChange = (value: string) => {
    setUserData({ ...userData, currency: value });
    changeCurrency(value);
    toast({
      title: "Currency Changed",
      description: `Your currency has been updated to ${value}`
    });
  };
  
  // Handler for dark mode toggle
  const handleDarkModeToggle = () => {
    const newDarkModeValue = !userData.darkMode;
    setUserData({ ...userData, darkMode: newDarkModeValue });
    toggleDarkMode();
  };
  
  // Password change handler
  const handleChangePassword = () => {
    // In a real app, this would validate and send to backend
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully"
    });
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={userData.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={userData.currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TND">Tunisian Dinar (TND)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how Masroufi looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {userData.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                </div>
                <Switch
                  checked={userData.darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <div>
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                  </div>
                </div>
                <Select value={userData.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose when and how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={userData.notifications.email}
                  onCheckedChange={(checked) => 
                    setUserData({ 
                      ...userData, 
                      notifications: { ...userData.notifications, email: checked } 
                    })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch
                  checked={userData.notifications.push}
                  onCheckedChange={(checked) => 
                    setUserData({ 
                      ...userData, 
                      notifications: { ...userData.notifications, push: checked } 
                    })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when approaching budget limits</p>
                </div>
                <Switch
                  checked={userData.notifications.budgetAlerts}
                  onCheckedChange={(checked) => 
                    setUserData({ 
                      ...userData, 
                      notifications: { ...userData.notifications, budgetAlerts: checked } 
                    })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Send weekly spending reports</p>
                </div>
                <Switch
                  checked={userData.notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setUserData({ 
                      ...userData, 
                      notifications: { ...userData.notifications, weeklyReports: checked } 
                    })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Deal Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify about new deals and discounts</p>
                </div>
                <Switch
                  checked={userData.notifications.dealAlerts}
                  onCheckedChange={(checked) => 
                    setUserData({ 
                      ...userData, 
                      notifications: { ...userData.notifications, dealAlerts: checked } 
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={() => toast({ title: "Notification preferences saved" })}>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Password</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button onClick={handleChangePassword}>Change Password</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Options</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={userData.security.twoFactor}
                    onCheckedChange={(checked) => 
                      setUserData({ 
                        ...userData, 
                        security: { ...userData.security, twoFactor: checked } 
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for any new login to your account</p>
                  </div>
                  <Switch
                    checked={userData.security.loginAlerts}
                    onCheckedChange={(checked) => 
                      setUserData({ 
                        ...userData, 
                        security: { ...userData.security, loginAlerts: checked } 
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Balance</Label>
                    <p className="text-sm text-muted-foreground">Display your account balance on the dashboard</p>
                  </div>
                  <Switch
                    checked={userData.security.showBalance}
                    onCheckedChange={(checked) => 
                      setUserData({ 
                        ...userData, 
                        security: { ...userData.security, showBalance: checked } 
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={() => toast({ title: "Security settings saved" })}>
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
