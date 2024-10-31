export interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  postalAddress?: string;
}

export interface Company {
  id: string;
  name: string;
  type?: string;
  registrationNumber: string;
  registrationDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  directors: Director[];
  address: string | Address;
  contactInfo?: ContactInfo;
  description?: string;
  industryClassification?: string;
  complianceStatus?: 'COMPLIANT' | 'NON_COMPLIANT';
  shareholders?: Shareholder[];
  financials?: Financial[];
  changes?: Change[];
  relatedEntities?: RelatedEntity[];
  observations?: Observation[];
  natureOfBusiness?: string;
  nominalCapital?: number;
  sharesIssued?: number;
  shareValue?: number;
  registeredOffice?: string;
  postalAddress?: string;
}

export interface Shareholder {
  id: string;
  name: string;
  shares: Share[];
}

export interface Share {
  quantity: number;
  class?: string;
  value?: number;
}

export interface Financial {
  id: string;
  year: number;
  revenue?: number;
  profit?: number;
  profitLoss?: number;
  date: string;
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

export interface Appointment {
  id: string;
  date: string;
  type?: string;
  position?: string;
}

export interface Director {
  id: string;
  name: string;
  nationality: string;
  role: string;
  shares?: number;
  position?: string;
  appointments?: Appointment[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  isPrimary: boolean;
  type?: string;
  value?: string;
} 