import React, { useState, useEffect } from 'react';
import { Bell, Lock, User, Eye, Loader2 } from 'lucide-react';
import { Button, Input, Switch, Label, Tabs, TabsContent, TabsList, TabsTrigger, MotionDiv } from './products/UIComponents';
import api from './utils/api';
import { toast } from 'react-toastify';

const DEFAULT_SETTINGS = {
  emailNotifications: false,
  pushNotifications: false,
  showInactiveProducts: false,
  twoFactorAuth: false,
};

const SettingsComponent = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const fetchUserSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/user/settings');
      if (response) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...response.data.adminSettings
        });
        setIsAdmin(response.data.isAdmin);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
      toast({
        title: "Error",
        description: "Failed to load settings. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (setting, value) => {
    setIsUpdating(true);
    try {
      await api.patch('/user/settings', {
        [setting]: value
      });
      
      setSettings(prev => ({ ...prev, [setting]: value }));
      toast({
        title: "Success",
        description: "Settings updated successfully.",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchUserSettings}>Retry</Button>
      </div>
    );
  }

  if (!isAdmin) {
    return <div>You do not have access to admin settings.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Settings</h2>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="account">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </div>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </div>
          </TabsTrigger>
          <TabsTrigger value="security">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security
            </div>
          </TabsTrigger>
          <TabsTrigger value="display">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Display
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="admin_user" disabled />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@example.com" disabled />
              </div>
            </div>
          </MotionDiv>
        </TabsContent>

        <TabsContent value="notifications">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email about your account activity</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  disabled={isUpdating}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  disabled={isUpdating}
                />
              </div>
            </div>
          </MotionDiv>
        </TabsContent>

        <TabsContent value="security">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  disabled={isUpdating}
                />
              </div>
            </div>
          </MotionDiv>
        </TabsContent>

        <TabsContent value="display">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4">Display Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-inactive">Show Inactive Products</Label>
                  <p className="text-sm text-gray-500">Display products that are marked as inactive</p>
                </div>
                <Switch
                  id="show-inactive"
                  checked={settings.showInactiveProducts}
                  onCheckedChange={(checked) => handleSettingChange('showInactiveProducts', checked)}
                  disabled={isUpdating}
                />
              </div>
            </div>
          </MotionDiv>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsComponent;