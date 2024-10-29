import axios, { AxiosError } from 'axios';

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  dateRegistered: string;
  directors: Director[];
  address: Address;
  contactInfo: ContactInfo;
}

export interface Director {
  id: string;
  name: string;
  role: string;
  nationality: string;
  address: string;
}

export interface Address {
  street: string;
  building: string;
  postalCode: string;
  city: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  postalAddress: string;
}

export interface APIError {
  message: string;
  status?: number;
}

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000,
});

export async function searchCompanies(query: string): Promise<Company[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const response = await api.get<Company[]>('/companies/search', {
      params: { q: query.trim() }
    });

    return response.data || [];
  } catch (error) {
    const apiError: APIError = {
      message: 'Failed to search companies'
    };

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      apiError.status = axiosError.response?.status;
      apiError.message = axiosError.response?.data?.message || apiError.message;
    }

    throw apiError;
  }
}

export async function getCompany(id: string): Promise<Company> {
  try {
    if (!id) {
      throw new Error('Company ID is required');
    }

    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  } catch (error) {
    const apiError: APIError = {
      message: 'Failed to fetch company details'
    };

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      apiError.status = axiosError.response?.status;
      apiError.message = axiosError.response?.data?.message || apiError.message;
    }

    throw apiError;
  }
}