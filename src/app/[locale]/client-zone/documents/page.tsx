"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documents, contracts } from "@/lib/mockData";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Search, FileText, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from 'next-intl';

export default function DocumentsPage() {
  const t = useTranslations('documents');
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (type: string | null) => {
    setTypeFilter(type === typeFilter ? null : type);
  };

  // Get unique document types
  const documentTypes = Array.from(new Set(documents.map(doc => doc.type)));

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === null || document.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Helper function to get contract title
  const getContractTitle = (contractId?: string) => {
    if (!contractId) return t('table.general');
    const contract = contracts.find(c => c.id === contractId);
    return contract ? contract.title : t('table.unknownContract');
  };

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
                  placeholder={t('search.placeholder')}
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={typeFilter === null ? "default" : "outline"} 
              size="sm"
              onClick={() => handleTypeFilter(null)}
            >
              {t('filters.all')}
            </Button>
            {documentTypes.map(type => (
              <Button 
                key={type}
                variant={typeFilter === type ? "default" : "outline"} 
                size="sm"
                onClick={() => handleTypeFilter(type)}
              >
                {t(`filters.types.${type.toLowerCase()}`)}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('table.header.document')}</TableHead>
                      <TableHead>{t('table.header.type')}</TableHead>
                      <TableHead>{t('table.header.date')}</TableHead>
                      <TableHead>{t('table.header.relatedTo')}</TableHead>
                      <TableHead className="text-right">{t('table.header.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            {document.title}
                          </div>
                        </TableCell>
                        <TableCell>{t(`filters.types.${document.type.toLowerCase()}`)}</TableCell>
                        <TableCell>{new Date(document.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {document.contractId ? (
                            <Link 
                              href={`/client-zone/contracts/${document.contractId}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {getContractTitle(document.contractId)}
                            </Link>
                          ) : (
                            t('table.general')
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link 
                              href={document.fileUrl}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              tabIndex={0}
                              aria-label={`${t('table.actions.view')} ${document.title}`}
                            >
                              <FileText className="h-4 w-4" />
                            </Link>
                            <Link 
                              href={document.fileUrl}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              tabIndex={0}
                              aria-label={`${t('table.actions.download')} ${document.title}`}
                              download
                            >
                              <Download className="h-4 w-4" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('table.noResults')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
