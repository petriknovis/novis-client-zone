'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { contracts, documents } from "@/lib/mockData";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { ArrowRight, FileText, Folder, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tc = useTranslations('contracts');
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState<{[key: string]: boolean} | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setShowDetails({
      contractHolder: false,
      insuredPerson: false,
      beneficiary: false,
    });

    if (!isAuthenticated) {
      router.push('/login');
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Check if there's a stored redirect path
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      // Clear the stored path
      sessionStorage.removeItem('redirectPath');
      // Get the current locale from the URL
      const locale = window.location.pathname.split('/')[1];
      // Construct the new path with the current locale
      const newPath = redirectPath.replace(/^\/(en|sk)/, `/${locale}`);
      // Navigate to the stored path
      router.push(newPath);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  if (!showDetails) {
    return null; 
  }

  const activeContracts = contracts.filter(contract => contract.status === "active").length;
  
  // Count documents
  const totalDocuments = documents.length;
  
  // Calculate total premium
  const totalPremium = contracts
    .filter(contract => contract.status === "active")
    .reduce((sum, contract) => sum + contract.premium, 0);

    

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="grid gap-6">
          {/* Overview section */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">{t('overview')}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t('activeContracts')}</CardTitle>
                  <FileText className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeContracts}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('totalContracts', { count: contracts.length })}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t('totalDocuments')}</CardTitle>
                  <Folder className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDocuments}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('documentsAvailable')}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t('annualPremium')}</CardTitle>
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{totalPremium.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('nextPayment')}: {new Date().toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">{t('recentContracts')}</h2>
              <Link 
                href="/client-zone/contracts" 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                tabIndex={0}
                aria-label={t('viewAll')}
              >
                {t('viewAll')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4">
              {mounted && contracts.slice(0, 3).map((contract) => (
                <Card key={contract.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{contract.title}</CardTitle>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        contract.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : contract.status === "pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>
                      {contract.type} • {tc('policy', { id: contract.id })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">{t('annualPremium')}</p>
                        <p className="font-medium">€{contract.premium.toLocaleString()}</p>
                      </div>
                      <Link 
                        href={`/client-zone/contracts/${contract.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        tabIndex={0}
                        aria-label={`${t('viewDetails')} ${contract.title}`}
                      >
                        {t('viewDetails')}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Recent documents section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">{t('recentDocuments')}</h2>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {mounted && documents.slice(0, 5).map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">{document.title}</p>
                          <p className="text-sm text-gray-500">{document.type} • {new Date(document.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Link 
                        href={document.fileUrl}
                        className="text-sm text-blue-600 hover:text-blue-800"
                        tabIndex={0}
                        aria-label={`${t('view')} ${document.title}`}
                      >
                        {t('view')}
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
