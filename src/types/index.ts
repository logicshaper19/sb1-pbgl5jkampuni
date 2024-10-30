export * from './auth';
export * from './search';

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  registrationDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  natureOfBusiness?: string;
  nominalCapital?: number;
  sharesIssued?: number;
  shareValue?: number;
  registeredOffice?: string;
  postalAddress?: string;
  directors?: Director[];
  shareholders?: Shareholder[];
  financials?: Financial[];
  changes?: Change[];
  relatedEntities?: RelatedEntity[];
  observations?: Observation[];
}

export interface Address {
  id: string;
  postalCode?: string;
  county?: string;
  district?: string;
  locality?: string;
  street?: string;
  building?: string;
  postalAddress?: string;
  companies: Company[];
}

export interface ContactInfo {
  id: string;
  email?: string;
  phone?: string;
  companies: Company[];
}

export interface Director {
  id: string;
  name: string;
  role?: string;
  nationality?: string;
  appointments?: Array<{
    id: string;
    date: string;
  }>;
}

export interface Shareholder {
  id: string;
  name: string;
  shares?: Array<{
    id: string;
    quantity: number;
  }>;
}

export interface Encumbrance {
  id: string;
  type: string;
  amount: number;
  date: Date;
  status: string;
  description?: string;
  companyId: string;
  company: Company;
}

export interface Tender {
  id: string;
  projectName: string;
  amount: number;
  awardDate: Date;
  completionStatus: string;
  governmentEntity: string;
  companyId: string;
  company: Company;
}

export interface FinancialResult {
  id: string;
  year: number;
  revenue: number;
  profit: number;
  assets: number;
  liabilities: number;
  employeeCount: number;
  companyId: string;
  company: Company;
}

export interface DashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  newCompaniesThisMonth: number;
  totalLicenses: number;
  totalUsers: number;
  newDocuments: number;
  systemHealth: {
    status: 'healthy' | 'warning' | 'error';
    message: string;
  };
  revenueData: {
    month: string;
    value: number;
  }[];
  companyTypes: {
    type: string;
    count: number;
  }[];
  usersTrend: {
    date: string;
    count: number;
  }[];
  companiesTrend: {
    date: string;
    count: number;
  }[];
  documentsTrend: {
    date: string;
    count: number;
  }[];
  activityData: {
    time: string;
    value: number;
  }[];
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  entityType: 'COMPANY' | 'LICENSE' | 'USER';
  entityId: string;
}

export interface Financial {
  id: string;
  year: number;
  revenue?: number;
  profitLoss?: number;
}

export interface Change {
  id: string;
  type: string;
  date: string;
  description: string;
}

export interface RelatedEntity {
  id: string;
  name: string;
  relationship: string;
}

export interface Observation {
  id: string;
  title: string;
  description: string;
  date: string;
}