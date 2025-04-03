"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contracts } from "@/lib/mockData";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { ArrowRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function ContractsPage() {
  const t = useTranslations('contracts');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status === statusFilter ? null : status);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === null || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="grid gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === "active" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleStatusFilter("active")}
                >
                  {t('status.active')}
                </Button>
                <Button 
                  variant={statusFilter === "pending" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleStatusFilter("pending")}
                >
                  {t('status.pending')}
                </Button>
                <Button 
                  variant={statusFilter === "expired" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleStatusFilter("expired")}
                >
                  {t('status.expired')}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredContracts.length > 0 ? (
              filteredContracts.map((contract) => (
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
                        {t(`status.${contract.status}`)}
                      </span>
                    </div>
                    <CardDescription>
                      {contract.type} • {t('details.policyValid')} {new Date(contract.startDate).toLocaleDateString()} {t('details.to')} {new Date(contract.endDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('details.annualPremium')}</p>
                        <p className="font-medium">€{contract.premium.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('details.coverageDetails')}</p>
                        <p className="font-medium">{contract.details}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Link 
                        href={`/client-zone/contracts/${contract.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        tabIndex={0}
                        aria-label={`${t('details.viewDetails')} ${contract.title}`}
                      >
                        {t('details.viewDetails')}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('noResults')}</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
