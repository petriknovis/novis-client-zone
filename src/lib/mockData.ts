export type Contract = {
  id: string;
  title: string;
  type: string;
  number: string;
  startDate: string;
  endDate: string;
  premium: number;
  nextDate: string,
  accountBalance: string,
  validTo: string,
  status: "active" | "pending" | "expired";
  
};

export type Document = {
  id: string;
  title: string;
  date: string;
  type: string;
  contractId?: string;
  fileUrl: string;
};

export const contracts: Contract[] = [
  {
    id: "1",
    title: "NOVIS Product / VPP - HUP 3030 / NOVUM Balesetbiztosítás",
    type: "Contract number",
    number: "101400067",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    nextDate: "2025-07-23",
    accountBalance: "3600",
    validTo: "2027-07-23",
    premium: 1200,
    status: "active",
    
  },
  {
    id: "2",
    title: "NOVIS Product / VPP - HUP 1014/ NOVUM Nyugdíjbiztosítás",
    type: "Contract number",
    number: "101400066",
    startDate: "2024-02-15",
    endDate: "2025-02-15",
    nextDate: "2025-06-25",
    accountBalance: "6600",
    validTo: "2028-07-23",
    premium: 800,
    status: "active",
    
  },
  {
    id: "3",
    title: "NOVIS Product / VPP - HUP 2021 / NOVUM Életbiztosítás",
    type: "Contract number",
    number: "101400068",
    startDate: "2023-05-23",
    endDate: "2033-10-01",
    nextDate: "2025-09-12",
    accountBalance: "3600",
    validTo: "2029-07-23",
    premium: 2400,
    status: "active",
    
  }
];

export const documents: Document[] = [
  {
    id: "1",
    title: "Home Insurance Policy",
    date: "2024-01-01",
    type: "Policy",
    contractId: "1",
    fileUrl: "/documents/home_insurance_policy.pdf"
  },
  {
    id: "2",
    title: "Car Insurance Policy",
    date: "2024-02-15",
    type: "Policy",
    contractId: "2",
    fileUrl: "/documents/car_insurance_policy.pdf"
  },
  {
    id: "3",
    title: "Life Insurance Policy",
    date: "2023-10-01",
    type: "Policy",
    contractId: "3",
    fileUrl: "/documents/life_insurance_policy.pdf"
  },
  // Annual Statements for each contract
  {
    id: "4",
    title: "Home Insurance Annual Statement",
    date: "2024-03-15",
    type: "Statement",
    contractId: "1",
    fileUrl: "/documents/home_insurance_annual_statement.pdf"
  },
  {
    id: "5",
    title: "Car Insurance Annual Statement",
    date: "2024-03-15",
    type: "Statement",
    contractId: "2",
    fileUrl: "/documents/car_insurance_annual_statement.pdf"
  },
  {
    id: "6",
    title: "Life Insurance Annual Statement",
    date: "2024-03-15",
    type: "Statement",
    contractId: "3",
    fileUrl: "/documents/life_insurance_annual_statement.pdf"
  },
  // Terms and Conditions Updates for each contract
  {
    id: "7",
    title: "Home Insurance Terms Update",
    date: "2024-02-01",
    type: "Notice",
    contractId: "1",
    fileUrl: "/documents/home_insurance_terms_update.pdf"
  },
  {
    id: "8",
    title: "Car Insurance Terms Update",
    date: "2024-02-01",
    type: "Notice",
    contractId: "2",
    fileUrl: "/documents/car_insurance_terms_update.pdf"
  },
  {
    id: "9",
    title: "Life Insurance Terms Update",
    date: "2024-02-01",
    type: "Notice",
    contractId: "3",
    fileUrl: "/documents/life_insurance_terms_update.pdf"
  }
];
