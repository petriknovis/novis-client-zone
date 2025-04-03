"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/authContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Save, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations('profile');
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

  const handleSave = () => {
    // In a real application, this would send data to the server
    // For now, we'll just toggle the editing state
    setIsEditing(false);
    
    // Show a success message (in a real app, this would be a toast notification)
    alert(t('notifications.success'));
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
            <Card className="md:col-span-1">
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
                <p className="text-sm text-gray-500 mt-1">{t('contactDetails.emailAddress')}: {user?.email}</p>
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
                          value={formData.email} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('contactDetails.phoneNumber')}</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">{t('contactDetails.address')}</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSave}
                        aria-label={t('contactDetails.saveChanges')}
                      >
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
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
