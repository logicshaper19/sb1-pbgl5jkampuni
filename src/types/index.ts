export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  registrationDate: string;
  status: string;
  address: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  directors: Person[];
  shareholders: Person[];
  encumbrances: Encumbrance[];
  tenders: Tender[];
  financialResults: FinancialResult[];
}

export interface Person {
  id: string;
  name: string;
  role: string;
  nationality: string;
  appointmentDate: string;
}

export interface Encumbrance {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  description: string;
}

export interface Tender {
  id: string;
  projectName: string;
  amount: number;
  awardDate: string;
  completionStatus: string;
  governmentEntity: string;
}

export interface FinancialResult {
  year: number;
  revenue: number;
  profit: number;
  assets: number;
  liabilities: number;
  employeeCount: number;
}