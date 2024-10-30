interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  status: string;
  registrationDate: string;
  address: string | Address;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export interface User {
  id: string;
  isAdmin?: boolean;
  // ... other user properties
} 