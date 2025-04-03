"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, Send, FileText, HelpCircle, MessageSquare, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    topic: "",
    policyNumber: "",
    subject: "",
    message: "",
    name: "",
    email: "",
    phone: "",
    preferredContact: "email",
    files: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = useTranslations('contact');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, topic: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, preferredContact: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        topic: "",
        policyNumber: "",
        subject: "",
        message: "",
        name: "",
        email: "",
        phone: "",
        preferredContact: "email",
        files: []
      });
    }, 1500);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('subtitle')}
          </p>
          
          {isSubmitted ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <Send className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{t('success')}</h2>
                  <Button onClick={() => setIsSubmitted(false)} className="mt-4">
                    {t('tryAgain')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="contactForm">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contactForm">{t('tabs.contactForm')}</TabsTrigger>
                <TabsTrigger value="faq">{t('tabs.faq')}</TabsTrigger>
                <TabsTrigger value="contactInfo">{t('tabs.contactInfo')}</TabsTrigger>
              </TabsList>

              <TabsContent value="contactForm">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('contactFormTitle')}</CardTitle>
                    <CardDescription>{t('contactFormDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="topic">{t('topicLabel')}</Label>
                          <Select value={formData.topic} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('topicPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">{t('generalInquiry')}</SelectItem>
                              <SelectItem value="technical">{t('technicalSupport')}</SelectItem>
                              <SelectItem value="claims">{t('claimsInquiry')}</SelectItem>
                              <SelectItem value="billing">{t('billingInquiry')}</SelectItem>
                              <SelectItem value="other">{t('otherInquiry')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="policyNumber">{t('policyNumberLabel')}</Label>
                          <Input
                            id="policyNumber"
                            name="policyNumber"
                            placeholder={t('policyNumberPlaceholder')}
                            value={formData.policyNumber}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <Label htmlFor="subject">{t('subjectLabel')}</Label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder={t('subjectPlaceholder')}
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="message">{t('messageLabel')}</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder={t('messagePlaceholder')}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={5}
                          />
                        </div>

                        <div>
                          <Label htmlFor="name">{t('nameLabel')}</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder={t('namePlaceholder')}
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">{t('emailLabel')}</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder={t('emailPlaceholder')}
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">{t('phoneLabel')}</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder={t('phonePlaceholder')}
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>{t('preferredContactLabel')}</Label>
                          <RadioGroup
                            value={formData.preferredContact}
                            onValueChange={handleRadioChange}
                            className="flex space-x-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="email" id="email" />
                              <Label htmlFor="email">{t('preferEmail')}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="phone" id="phone" />
                              <Label htmlFor="phone">{t('preferPhone')}</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <Label>{t('fileUploadLabel')}</Label>
                          <div className="mt-2">
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                              <Input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                              />
                              <Label htmlFor="file-upload" className="cursor-pointer">
                                <Button type="button" variant="outline" className="mb-2">
                                  {t('fileUploadButton')}
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                  {t('fileUploadDragAndDrop')}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t('fileUploadFormats')}
                                </p>
                              </Label>
                            </div>
                            {formData.files.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {formData.files.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-2" />
                                      <span className="text-sm">{file.name}</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(index)}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? t('sending') : t('submit')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('faqTitle')}</CardTitle>
                    <CardDescription>{t('faqDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                          {t('faq1Question')}
                        </h3>
                        <p className="text-muted-foreground pl-7">{t('faq1Answer')}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                          {t('faq2Question')}
                        </h3>
                        <p className="text-muted-foreground pl-7">{t('faq2Answer')}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                          {t('faq3Question')}
                        </h3>
                        <p className="text-muted-foreground pl-7">{t('faq3Answer')}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                          {t('faq4Question')}
                        </h3>
                        <p className="text-muted-foreground pl-7">{t('faq4Answer')}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                          {t('faq5Question')}
                        </h3>
                        <p className="text-muted-foreground pl-7">{t('faq5Answer')}</p>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex">
                          <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-800">{t('faqAlertTitle')}</h4>
                            <p className="text-sm text-blue-700 mt-1">{t('faqAlertMessage')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contactInfo">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('contactInfoTitle')}</CardTitle>
                    <CardDescription>{t('contactInfoDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="for-clients" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="for-clients">{t('contactInfoTabs.clients')}</TabsTrigger>
                        <TabsTrigger value="for-intermediaries">{t('contactInfoTabs.intermediaries')}</TabsTrigger>
                        <TabsTrigger value="for-media">{t('contactInfoTabs.media')}</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="for-clients">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                            <div className="rounded-full bg-blue-100 p-3 mb-4">
                              <Phone className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">{t('contactInfoClientsPhoneTitle')}</h3>
                            <p className="text-muted-foreground mb-4">{t('contactInfoClientsPhoneDescription')}</p>
                            <p className="font-medium">{t('contactInfoClientsPhone')}</p>
                            <p className="text-sm text-muted-foreground mt-2">{t('contactInfoClientsPhoneName')}</p>
                            <p className="text-sm text-muted-foreground mt-1">{t('contactInfoClientsPhonePosition')}</p>
                          </div>
                          
                          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                            <div className="rounded-full bg-blue-100 p-3 mb-4">
                              <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">{t('contactInfoClientsEmailTitle')}</h3>
                            <p className="text-muted-foreground mb-4">{t('contactInfoClientsEmailDescription')}</p>
                            <p className="font-medium">{t('contactInfoClientsEmail')}</p>
                            <p className="text-sm text-muted-foreground mt-2">{t('contactInfoClientsEmailName')}</p>
                          </div>
                          
                          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                            <div className="rounded-full bg-blue-100 p-3 mb-4">
                              <MessageSquare className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">{t('contactInfoClientsMessageTitle')}</h3>
                            <p className="text-muted-foreground mb-4">{t('contactInfoClientsMessageDescription')}</p>
                            <p className="font-medium">{t('contactInfoClientsMessage')}</p>
                            <p className="text-sm text-muted-foreground mt-2">{t('contactInfoClientsMessageName')}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex">
                            <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-blue-800">{t('contactInfoClientsAlertTitle')}</h4>
                              <p className="text-sm text-blue-700 mt-1">{t('contactInfoClientsAlertMessage')}</p>
                              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                                <li><span className="font-medium">{t('contactInfoClientsAlertName1')}:</span> {t('contactInfoClientsAlertPhone1')}</li>
                                <li><span className="font-medium">{t('contactInfoClientsAlertName2')}:</span> {t('contactInfoClientsAlertPhone2')}</li>
                                <li><span className="font-medium">{t('contactInfoClientsAlertName3')}:</span> {t('contactInfoClientsAlertPhone3')}</li>
                                <li><span className="font-medium">{t('contactInfoClientsAlertName4')}:</span> {t('contactInfoClientsAlertPhone4')}</li>
                                <li><span className="font-medium">{t('contactInfoClientsAlertName5')}:</span> {t('contactInfoClientsAlertEmail')}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="for-intermediaries">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                            <div className="rounded-full bg-blue-100 p-3 mb-4">
                              <Phone className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">{t('contactInfoIntermediariesPhoneTitle')}</h3>
                            <p className="text-muted-foreground mb-4">{t('contactInfoIntermediariesPhoneDescription')}</p>
                            <p className="font-medium">{t('contactInfoIntermediariesPhone')}</p>
                            <p className="text-sm text-muted-foreground mt-2">{t('contactInfoIntermediariesPhoneName')}</p>
                            <p className="text-sm text-muted-foreground mt-1">{t('contactInfoIntermediariesPhonePosition')}</p>
                          </div>
                          
                          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                            <div className="rounded-full bg-blue-100 p-3 mb-4">
                              <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">{t('contactInfoIntermediariesEmailTitle')}</h3>
                            <p className="text-muted-foreground mb-4">{t('contactInfoIntermediariesEmailDescription')}</p>
                            <p className="font-medium">{t('contactInfoIntermediariesEmail')}</p>
                            <p className="text-sm text-muted-foreground mt-2">{t('contactInfoIntermediariesEmailName')}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex">
                            <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-blue-800">{t('contactInfoIntermediariesAlertTitle')}</h4>
                              <p className="text-sm text-blue-700 mt-1">{t('contactInfoIntermediariesAlertMessage')}</p>
                              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                                <li><span className="font-medium">{t('contactInfoIntermediariesAlertName')}:</span> {t('contactInfoIntermediariesAlertPhone')}</li>
                                <li><span className="font-medium">{t('contactInfoIntermediariesAlertEmail')}:</span> {t('contactInfoIntermediariesAlertEmailValue')}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="for-media">
                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg max-w-md mx-auto">
                          <div className="rounded-full bg-blue-100 p-3 mb-4">
                            <Mail className="h-6 w-6 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">{t('contactInfoMediaTitle')}</h3>
                          <p className="text-muted-foreground mb-4">{t('contactInfoMediaDescription')}</p>
                          <p className="font-medium">{t('contactInfoMediaPhone')}</p>
                          <p className="text-sm text-muted-foreground mt-2">{t('contactInfoMediaEmail')}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
