'use client';

import { CompanyForm } from '@/components/admin/CompanyForm';

export default function NewCompanyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Company</h1>
      <CompanyForm />
    </div>
  );
}
