"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contracts, documents, Contract } from "@/lib/mockData";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { ArrowLeft, FileText, Save, Pencil, ChevronUp, ChevronDown } from "lucide-react";

export default function ContractDetailsPage() {
  const { locale } = useParams();
  const t = useTranslations('contracts');
  const td = useTranslations('dashboard');

  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContract, setEditedContract] = useState<Contract | null>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<typeof documents>([]);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({
    contractHolder: false,
    insuredPerson: false,
    beneficiary: false,
    relatedDocuments: false,
    portfolio: false,
    payments: false
  });
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'value' | 'type';
    direction: 'asc' | 'desc';
  } | null>(null);
  const paymentsPerPage = 10;

  const payments = [
    { date: "02.01.2025", value: "40 000 Ft", type: "Premium" },
    { date: "03.08.2022", value: "20 000 Ft", type: "Premium" },
    { date: "04.01.2023", value: "20 000 Ft", type: "Premium" },
    { date: "04.04.2022", value: "28 000 Ft", type: "Tax Bonus" },
    { date: "05.01.2022", value: "20 000 Ft", type: "Premium" },
    { date: "05.01.2024", value: "60 000 Ft", type: "Premium" },
    { date: "05.06.2022", value: "20 000 Ft", type: "Premium" },
    { date: "05.07.2022", value: "20 000 Ft", type: "Premium" },
    { date: "05.09.2022", value: "20 000 Ft", type: "Premium" },
    { date: "06.02.2023", value: "20 000 Ft", type: "Premium" },
    { date: "06.03.2022", value: "20 000 Ft", type: "Premium" },
    { date: "06.05.2024", value: "40 000 Ft", type: "Premium" },
    { date: "06.07.2024", value: "40 000 Ft", type: "Premium" },
    { date: "06.09.2024", value: "40 000 Ft", type: "Premium" },
    { date: "06.12.2022", value: "20 000 Ft", type: "Premium" },
    // Page 2 data
    { date: "07.01.2023", value: "25 000 Ft", type: "Premium" },
    { date: "07.03.2023", value: "25 000 Ft", type: "Premium" },
    { date: "07.05.2023", value: "30 000 Ft", type: "Tax Bonus" },
    { date: "08.01.2023", value: "25 000 Ft", type: "Premium" },
    { date: "08.04.2023", value: "25 000 Ft", type: "Premium" }
  ];

  const handleSort = (key: 'date' | 'value' | 'type') => {
    setSortConfig((prevSort) => ({
      key,
      direction: 
        prevSort?.key === key && prevSort?.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const sortedAndFilteredPayments = useMemo(() => {
    let result = [...payments];
    
    // First apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(payment => 
        payment.type.toLowerCase().includes(query) ||
        payment.date.toLowerCase().includes(query) ||
        payment.value.toLowerCase().includes(query)
      );
    }

    // Then apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.date.split('.').reverse().join('-'));
          const dateB = new Date(b.date.split('.').reverse().join('-'));
          return sortConfig.direction === 'asc' 
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }
        
        if (sortConfig.key === 'value') {
          const valueA = parseInt(a.value.replace(/[^0-9]/g, ''));
          const valueB = parseInt(b.value.replace(/[^0-9]/g, ''));
          return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      });
    }

    return result;
  }, [sortConfig, payments, searchQuery]);

  const totalFilteredPages = Math.ceil(sortedAndFilteredPayments.length / paymentsPerPage);
  const currentPayments = sortedAndFilteredPayments.slice(
    (currentPage - 1) * paymentsPerPage,
    currentPage * paymentsPerPage
  );

  useEffect(() => {
    setMounted(true);
    // Find the contract
    const foundContract = contracts.find(c => c.id === contractId);
    if (foundContract) {
      setContract(foundContract);
      setEditedContract(foundContract);

      // Find related documents
      const related = documents.filter(doc => doc.contractId === contractId);
      setRelatedDocuments(related);
    } else {
      // Contract not found, redirect back to contracts page
      router.push("/client-zone/contracts");
    }
  }, [contractId, router]);

  const formatDate = (date: string) => {
    if (!mounted) return ''; // Return empty string during SSR
    return new Date(date).toLocaleDateString(locale);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!editedContract) return;

    setEditedContract({
      ...editedContract,
      [name]: name === "premium" ? parseFloat(value) : value,
    });
  };

  const handleSave = () => {
    if (!editedContract) return;

    // In a real application, this would send data to the server
    // For now, we'll just update our local state
    setContract(editedContract);
    setIsEditing(false);

    // Show a success message (in a real app, this would be a toast notification)
    alert("Contract updated successfully!");
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const toggleSection = (section: keyof typeof showDetails) => {
    setShowDetails(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{td('loading')}</p>
      </div>
    );
  }

  if (!contract) {
    return null;
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/client-zone/contracts")}
                aria-label={td('back')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {td('back')}
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">{contract.title}</h1>
            </div>

            <Card>
              {/* Contract details */}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{t('contractDetails')}</CardTitle>
                    <CardDescription>
                      {contract.type} • {contract.number}
                    </CardDescription>
                  </div>
                  <div className="mr-15">
                    <p className="text-sm text-gray-500">{t('status.label')}</p>
                    <p className={`font-medium inline-flex items-center ${contract.status === "active"
                      ? "text-green-600"
                      : contract.status === "pending"
                        ? "text-yellow-600"
                        : "text-gray-600"
                      }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${contract.status === "active"
                        ? "bg-green-600"
                        : contract.status === "pending"
                          ? "bg-yellow-600"
                          : "bg-gray-600"
                        }`}></span>
                      {t(`status.${contract.status}`)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* Contract details form */}
                  <div>
                    <div className="space-y-4">
                      {isEditing ? (
                        <>
                          <div>
                            <Label htmlFor="title">{t('title')}</Label>
                            <Input
                              id="title"
                              name="title"
                              value={editedContract?.title || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">{t('type')}</Label>
                            <Input
                              id="type"
                              name="type"
                              value={editedContract?.type || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="premium">{t('details.annualPremium')}</Label>
                            <Input
                              id="premium"
                              name="premium"
                              type="number"
                              value={editedContract?.premium || 0}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="startDate">{t('validPeriod')}</Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={editedContract?.startDate?.split('T')[0] || ""}
                                onChange={handleInputChange}
                              />
                              <span>{t('details.to')}</span>
                              <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={editedContract?.endDate?.split('T')[0] || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="details">{t('details.coverageDetails')}</Label>
                            {/* <Input
                              id="details"
                              name="details"
                              value={editedContract?.details || ""}
                              onChange={handleInputChange}
                            /> */}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={toggleEdit}>
                              {t('contractHolder.cancel')}
                            </Button>
                            <Button onClick={handleSave}>
                              <Save className="h-4 w-4 mr-2" />
                              {t('save')}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">{t('title')}</p>
                              <p className="font-medium">{contract.title}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t('type')}</p>
                              <p className="font-medium">{contract.type}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t('details.annualPremium')}</p>
                              <p className="font-medium">€{contract.premium.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t('details.nextDatePayment')}</p>
                              <p className="font-medium">{formatDate(contract.nextDate)}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">{t('validPeriod')}</p>
                              <p className="font-medium">
                                {formatDate(contract.startDate)} {t('details.to')} {formatDate(contract.endDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t('details.accountBalance')}</p>
                              <p className="font-medium">€{contract.accountBalance} {t('details.to')} {formatDate(contract.validTo)}</p>
                            </div>
                            {/* <div>
                              <p className="text-sm text-gray-500">{t('details.coverageDetails')}</p>
                              <p className="font-medium">{contract.details}</p>
                            </div> */}
                          </div>

                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Contract holder */}
            <Card>
              <div className="grid gap-6 last:mb-5">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{t('contractHolder.title')}</CardTitle>
                      <CardDescription>
                        {t('contractHolder.description')}
                      </CardDescription>
                    </div>
                    <button onClick={() => toggleSection('contractHolder')}>
                      {showDetails?.contractHolder ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </CardHeader>

                {showDetails?.contractHolder && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      {/* Základné údaje */}
                      <div>
                        <p className="font-semibold mb-2">{t('contractHolder.basicData')}</p>
                        <p><span className="text-gray-500">{t('contractHolder.firstNameLastName')}</span> <span className="font-medium">John Doe</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.identityCard')}</span> <span className="font-medium">445458AE</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.proofOfAddress')}</span> <span className="font-medium">AD123456</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.taxIdentification')}</span> <span className="font-medium">SK1234567890</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.dateBirth')}</span> <span className="font-medium">01.01.1980 / Bratislava</span></p>
                      </div>

                      {/* Kontaktné údaje */}
                      <div>
                        <p className="font-semibold mb-2">{t('contractHolder.contactData')}</p>
                        <p><span className="text-gray-500">{t('contractHolder.mobilePhone')}</span> <span className="font-medium">+421 900 123 456</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.email')}</span> <span className="font-medium">john.doe@example.com</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.permanentAddress')}</span> <span className="font-medium">Hlavná 123, Bratislava</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.postalAddress')}</span> <span className="font-medium">P.O. Box 456, Bratislava 100</span></p>
                      </div>
                    </div>
                  </CardContent>


                )}
              </div>
            </Card>

            {/* Insured person */}
            <Card>
              <div className="grid gap-6 last:mb-5">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{t('insuredPerson.title')}</CardTitle>
                      <CardDescription>
                        {t('insuredPerson.description')}
                      </CardDescription>
                    </div>
                    <button onClick={() => toggleSection('insuredPerson')}>
                      {showDetails?.insuredPerson ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </CardHeader>

                {showDetails?.insuredPerson && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      {/* Základné údaje */}
                      <div>
                        <p className="font-semibold mb-2">{t('contractHolder.basicData')}</p>
                        <p><span className="text-gray-500">{t('contractHolder.firstNameLastName')}</span> <span className="font-medium">John Doe</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.identityCard')}</span> <span className="font-medium">445458AE</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.proofOfAddress')}</span> <span className="font-medium">AD123456</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.taxIdentification')}</span> <span className="font-medium">SK1234567890</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.dateBirth')}</span> <span className="font-medium">01.01.1980 / Bratislava</span></p>
                      </div>

                      {/* Kontaktné údaje */}
                      <div>
                        <p className="font-semibold mb-2">{t('contractHolder.contactData')}</p>
                        <p><span className="text-gray-500">{t('contractHolder.mobilePhone')}</span> <span className="font-medium">+421 900 123 456</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.email')}</span> <span className="font-medium">john.doe@example.com</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.permanentAddress')}</span> <span className="font-medium">Hlavná 123, Bratislava</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.postalAddress')}</span> <span className="font-medium">P.O. Box 456, Bratislava 100</span></p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mt-5">
                      <div>
                        <p className="font-semibold mb-2">{t('insuredPerson.coveredRisks')}</p>
                        <p><span className="text-gray-500">{t('insuredPerson.deathCover')}</span> <span className="font-medium">€1,200</span></p>
                        <p><span className="text-gray-500">{t('insuredPerson.accidentInsurance')}</span> <span className="font-medium">€1,700</span></p>
                        <p><span className="text-gray-500">{t('insuredPerson.illness')}</span> <span className="font-medium">€12,200</span> </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </div>
            </Card>

            {/* Beneficiary */}
            <Card>
              <div className="grid gap-6 last:mb-5">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{t('beneficiary.title')}</CardTitle>
                      <CardDescription>
                        {t('beneficiary.description')}
                      </CardDescription>
                    </div>
                    <button onClick={() => toggleSection('beneficiary')}>
                      {showDetails?.beneficiary ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </CardHeader>

                {showDetails?.beneficiary && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      {/* Základné údaje */}
                      <div>
                        <p className="font-semibold mb-2">{t('contractHolder.basicData')}</p>
                        <p><span className="text-gray-500">{t('contractHolder.firstNameLastName')}</span> <span className="font-medium">Anna Kováčová</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.identityCard')}</span> <span className="font-medium">785412BG</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.proofOfAddress')}</span> <span className="font-medium">BA987654</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.taxIdentification')}</span> <span className="font-medium">SK9876543210</span></p>
                        <p><span className="text-gray-500">{t('contractHolder.dateBirth')}</span> <span className="font-medium">15.03.1975 / Košice</span></p>
                      </div>

                      {/* Kontaktné údaje */}
                      <div>
                        <p className="font-semibold mb-2">{t('contractHolder.contactData')}</p>
                        <p><span className="text-gray-500">{t('beneficiary.sharePercentage')}</span> <span className="font-medium">50%</span></p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </div>
            </Card>

            {/* Portfolio */}
            <Card>
              <div className="grid gap-6 last:mb-5">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Portfolio</CardTitle>
                      <CardDescription>
                        Overview of your insurance contracts, coverage details and investment components.
                      </CardDescription>
                    </div>
                    <button onClick={() => toggleSection('portfolio')}>
                      {showDetails?.portfolio ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </CardHeader>

                {showDetails?.portfolio && (
                  <CardContent>
                    <div className="space-y-6 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        {/* Základné údaje */}
                        <div>
                          <p className="font-semibold mb-2">Current value of the investment units registered on your account</p>
                          <p><span className="text-gray-500">Account Balance: </span> <span className="font-medium">€1,547,164.85</span></p>
                          <p><span className="text-gray-500">Liquid Account Balance: </span> <span className="font-medium">€761,427.40</span></p>
                          <p><span className="text-gray-500">Tax Bonus: </span> <span className="font-medium">€371,435.00</span></p>
                          <p><span className="text-gray-500">NOVIS Bonuses Balance: </span> <span className="font-medium">€3,553.00</span></p>
                          <p><span className="text-gray-500">NOVIS Special Bonus:</span> <span className="font-medium">€2,559,783.71</span></p>
                          <p><span className="text-gray-500">Summary:</span> <span className="font-medium">€2,559,783.71</span></p>
                        </div>

                        {/* Kontaktné údaje */}
                        <div>
                          <p className="font-semibold mb-2">NOVIS bonuses and tax credits available during the contract period</p>
                          <p><span className="text-gray-500">NOVIS bonuses: </span> <span className="font-medium">€3,553.00</span></p>
                          <p><span className="text-gray-500">Tax credits: </span> <span className="font-medium">€371,435.00</span></p>
                          <p><span className="text-gray-500">Summary: </span> <span className="font-medium">€374,988.00</span></p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                          *The data shown are for informational purposes only. They include all NOVIS bonuses and tax credits available during the contract period. The calculation was made on the assumption that the payment is contracted until the entire contract period, the insurance coverage remains unchanged and that the insurance contract remain in force throughout. During the calculation, we did not calculate the assumed return of bonuses and tax credits.
                        </p>
                      


                      <div>
                        <h4 className="font-semibold mb-4">Portfolio Overview</h4>

                        {/* First Table */}
                        <div className="space-y-4 mb-8">
                          <div className="grid grid-cols-6 gap-4 py-2 text-sm font-medium bg-blue-50 px-2">
                            <div>My portfolio</div>
                            <div className="text-right">Current value</div>
                            <div className="text-right">Initial investment</div>
                            <div className="text-right">Bonuses</div>
                            <div className="text-right">Rate</div>
                            <div className="text-right">Profit</div>
                          </div>
                          <div className="grid grid-cols-6 gap-4 py-2 border-b px-2">
                            <div>NOVIS Guaranteed</div>
                            <div className="text-right">0.00</div>
                            <div className="text-right">0.00</div>
                            <div className="text-right">0.00</div>
                            <div className="text-right">0</div>
                            <div className="text-right">0 Ft</div>
                          </div>
                          <div className="grid grid-cols-6 gap-4 py-2 border-b px-2">
                            <div>NOVIS Dynamic</div>
                            <div className="text-right">0.00</div>
                            <div className="text-right">0.00</div>
                            <div className="text-right">0.00</div>
                            <div className="text-right">0</div>
                            <div className="text-right">0 Ft</div>
                          </div>
                          <div className="grid grid-cols-6 gap-4 py-2 font-medium bg-blue-50 px-2">
                            <div>Total:</div>
                            <div className="text-right">0 Ft</div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                          </div>
                        </div>

                        {/* Second Table */}
                        <div className="space-y-4 mb-8">
                          <div className="grid grid-cols-6 gap-4 py-2 text-sm font-medium bg-blue-50 px-2">
                            <div>Insurance Fund</div>
                            <div className="text-right">Current value</div>
                            <div className="text-right">Initial investment</div>
                            <div className="text-right">Bonuses</div>
                            <div className="text-right">Rate</div>
                            <div className="text-right">Profit</div>
                          </div>
                          {[
                            'NOVIS Absolute Return Insurance Fund',
                            'NOVIS Bond Insurance Fund Magyar Korona',
                            'NOVIS ETF Share Insurance Fund',
                            'NOVIS Global Select Insurance Fund',
                            'NOVIS Gold Insurance Fund',
                            'NOVIS Fixed Income Insurance Fund',
                            'NOVIS World Brands Insurance Fund',
                            'NOVIS Latin America Insurance Fund',
                            'NOVIS Dividend Insurance Fund'
                          ].map((fund, index) => (
                            <div key={index} className="grid grid-cols-6 gap-4 py-2 border-b px-2">
                              <div>{fund}</div>
                              <div className="text-right">0.00</div>
                              <div className="text-right">0.00</div>
                              <div className="text-right">0.00</div>
                              <div className="text-right">0</div>
                              <div className="text-right">0 Ft</div>
                            </div>
                          ))}
                          <div className="grid grid-cols-6 gap-4 py-2 font-medium bg-blue-50 px-2">
                            <div>Total:</div>
                            <div className="text-right">0 Ft</div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                          </div>
                        </div>

                        {/* Third Table */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-6 gap-4 py-2 text-sm font-medium bg-blue-50 px-2">
                            <div>Technical Account</div>
                            <div className="text-right">1,547,164.85</div>
                            <div className="text-right">761,427.40</div>
                            <div className="text-right">371,435.00</div>
                            <div className="text-right">3,553.00</div>
                            <div className="text-right">2,559,783.71</div>
                          </div>
                          <div className="grid grid-cols-6 gap-4 py-2 font-medium bg-blue-50 px-2 mt-4">
                            <div>Total Portfolio Value as of 15.04.2025:</div>
                            <div className="text-right">2,559,783.71</div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                            <div className="text-right"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </div>
            </Card>

            {/* Payments */}
            <Card>
              <div className="grid gap-6 last:mb-5">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Payments</CardTitle>
                      <CardDescription>
                      All paid insurance premiums and tax bonuses
                      </CardDescription>
                    </div>
                    <button onClick={() => toggleSection('payments')}>
                      {showDetails?.payments ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </CardHeader>
                {showDetails?.payments && (
                  <CardContent className="text-sm">
                    <h4 className="font-semibold mb-4">All paid insurance premiums and tax bonuses</h4>
                    
                    {/* Search input */}
                    <div className="mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by type, date, or value..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                          }}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setCurrentPage(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                      <div className="grid grid-cols-3 bg-blue-50 text-gray-900 font-medium">
                        <button 
                          onClick={() => handleSort('date')} 
                          className="px-4 py-3 text-left hover:bg-blue-100 flex items-center gap-2"
                        >
                          Date
                          {sortConfig?.key === 'date' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                        <button 
                          onClick={() => handleSort('value')} 
                          className="px-4 py-3 text-right hover:bg-blue-100 flex items-center justify-end gap-2"
                        >
                          Value
                          {sortConfig?.key === 'value' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                        <button 
                          onClick={() => handleSort('type')} 
                          className="px-4 py-3 text-left hover:bg-blue-100 flex items-center gap-2"
                        >
                          Type
                          {sortConfig?.key === 'type' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                      </div>
                      <div className="divide-y">
                        {currentPayments.map((payment, index) => (
                          <div key={index} className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <div className="px-4 py-3">{payment.date}</div>
                            <div className="px-4 py-3 text-right">{payment.value}</div>
                            <div className="px-4 py-3">{payment.type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        onClick={() => handlePageChange(1)}
                        variant="outline"
                        disabled={currentPage === 1}
                      >
                        Previous page
                      </Button>
                      {[...Array(totalFilteredPages).keys()].map((pageNumber) => (
                        <Button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber + 1)}
                          variant={currentPage === pageNumber + 1 ? "default" : "outline"}
                          className={currentPage === pageNumber + 1 ? "bg-blue-100 hover:bg-blue-100" : ""}
                        >
                          {pageNumber + 1}
                        </Button>
                      ))}
                      <Button
                        onClick={() => handlePageChange(totalFilteredPages)}
                        variant="outline"
                        disabled={currentPage === totalFilteredPages}
                      >
                        Next page
                      </Button>
                    </div>
                  </CardContent>
                )}
              </div>
            </Card>

            {/* Related documents */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{t('relatedDocuments.title')}</CardTitle>
                    <CardDescription>
                      {t('relatedDocuments.description')}
                    </CardDescription>
                  </div>
                  <button onClick={() => toggleSection('relatedDocuments')}>
                    {showDetails?.relatedDocuments ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {showDetails?.relatedDocuments && (
                  relatedDocuments.length > 0 ? (
                    <div className="divide-y">
                      {relatedDocuments.map((document) => (
                        <div key={document.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
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
                            aria-label={`${td('view')} ${document.title}`}
                          >
                            {td('view')}
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">{t('relatedDocuments.noDocuments')}</p>
                  )
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
