"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/authContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Save, Bell, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: "client@example.com", // Mock data
    phone: "+420 123 456 789", // Mock data
    address: "123 Main St, Prague, Czech Republic", // Mock data
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t('security.validation.passwordMismatch'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert(t('security.validation.passwordLength'));
      return;
    }

    // In a real application, this would send data to the server
    alert(t('security.validation.success'));

    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSave = () => {
    // In a real application, this would send data to the server
    // For now, we'll just toggle the editing state
    setIsEditing(false);

    // Show a success message (in a real app, this would be a toast notification)
    alert(t('personalInfo.success'));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="grid gap-6">
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('personalInfo.title')}</CardTitle>
                <CardDescription>
                  {t('personalInfo.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">{user?.name}</h3>
                <p className="text-sm text-gray-500">{t('personalInfo.clientId')}: {user?.id || "1"}</p>
                <p className="text-sm text-gray-500 mt-1">Email: {user?.email}</p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={toggleEdit}
                  aria-label={isEditing ? t('personalInfo.cancel') : t('personalInfo.editProfile')}
                >
                  {isEditing ? t('personalInfo.cancel') : t('personalInfo.editProfile')}
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('contactDetails.title')}</CardTitle>
                <CardDescription>
                  {t('contactDetails.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contactDetails.fullName')}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contactDetails.emailAddress')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('contactDetails.phoneNumber')}</Label>
                        <p className="text-sm text-gray-700 py-2">{formData.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">{t('contactDetails.address')}</Label>
                        <p className="text-sm text-gray-700 py-2">{formData.address}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        {t('contactDetails.saveChanges')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('contactDetails.fullName')}</p>
                        <p className="font-medium">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('contactDetails.emailAddress')}</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('contactDetails.phoneNumber')}</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('contactDetails.address')}</p>
                        <p className="font-medium">{formData.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-500" />
                  <div>
                    <CardTitle>{t('security.title')}</CardTitle>
                    <CardDescription>
                      {t('security.description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">{t('security.currentPassword')}</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={toggleShowPassword}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">{t('security.newPassword')}</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">{t('security.confirmPassword')}</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {t('security.updatePassword')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <div>
                    <CardTitle>{t('notifications.title')}</CardTitle>
                    <CardDescription>
                      {t('notifications.description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">{t('notifications.email.title')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="contractUpdates"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="contractUpdates">{t('notifications.email.contractUpdates')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="paymentReminders"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="paymentReminders">{t('notifications.email.paymentReminders')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="newDocuments"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="newDocuments">{t('notifications.email.newDocuments')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="policyChanges"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="policyChanges">{t('notifications.email.policyChanges')}</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">{t('notifications.sms.title')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="smsPaymentReminders"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="smsPaymentReminders">{t('notifications.sms.paymentReminders')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="smsImportantUpdates"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="smsImportantUpdates">{t('notifications.sms.importantUpdates')}</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      {t('notifications.savePreferences')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
