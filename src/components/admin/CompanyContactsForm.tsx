'use client';

import React, { useState } from 'react';
import { Contact } from '../../types';
import { Plus, Trash2, AlertTriangle, Phone, Mail, User, MapPin } from 'lucide-react';

interface CompanyContactsFormProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

export const CompanyContactsForm = ({ contacts, onChange }: CompanyContactsFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateContact = (contact: Contact): boolean => {
    if (!contact.name || !contact.role) {
      setError('Name and role are required');
      return false;
    }
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setError('Invalid email format');
      return false;
    }
    if (contact.phone && !/^\+?[\d\s-]{8,}$/.test(contact.phone)) {
      setError('Invalid phone number format');
      return false;
    }
    setError(null);
    return true;
  };

  const addContact = () => {
    onChange([
      ...contacts,
      {
        id: `temp-${Date.now()}`,
        name: '',
        role: '',
        email: '',
        phone: '',
        address: '',
        isPrimary: contacts.length === 0,
      },
    ]);
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    // If removing primary contact, make the first remaining contact primary
    if (contacts[index].isPrimary && updatedContacts.length > 0) {
      updatedContacts[0].isPrimary = true;
    }
    onChange(updatedContacts);
  };

  const updateContact = (index: number, field: keyof Contact, value: string | boolean) => {
    const updatedContacts = contacts.map((contact, i) => {
      if (i === index) {
        const updatedContact = { ...contact, [field]: value };
        if (field === 'isPrimary' && value === true) {
          // Ensure only one primary contact
          return { ...updatedContact, isPrimary: true };
        }
        validateContact(updatedContact);
        return updatedContact;
      }
      // If setting a new primary contact, unset others
      if (field === 'isPrimary' && value === true) {
        return { ...contact, isPrimary: false };
      }
      return contact;
    });
    onChange(updatedContacts);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Contact Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company contacts
          </p>
        </div>
        <button
          type="button"
          onClick={addContact}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Contact
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={contact.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Name
                </span>
              </label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => updateContact(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={contact.role}
                onChange={(e) => updateContact(index, 'role', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contact role"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </span>
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => updateContact(index, 'email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </span>
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact(index, 'phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </span>
              </label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => updateContact(index, 'address', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contact address"
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={contact.isPrimary}
                    onChange={(e) => updateContact(index, 'isPrimary', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Primary Contact</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </span>
              </label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => updateContact(index, 'address', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contact address"
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={contact.isPrimary}
                    onChange={(e) => updateContact(index, 'isPrimary', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Primary Contact</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
                  className="p-1 text-red-600 hover:text-red-800"

              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </span>
              </label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => updateContact(index, 'address', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contact address"
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={contact.isPrimary}
                    onChange={(e) => updateContact(index, 'isPrimary', e.target.checked)}

import React, { useState } from 'react';
import { Contact } from '../../types';
import { Plus, Trash2, AlertTriangle, Phone, Mail, User, MapPin } from 'lucide-react';

interface CompanyContactsFormProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

export const CompanyContactsForm = ({ contacts, onChange }: CompanyContactsFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateContact = (contact: Contact): boolean => {
    if (!contact.name || !contact.role) {
      setError('Name and role are required');
      return false;
    }
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setError('Invalid email format');
      return false;
    }
    if (contact.phone && !/^\+?[\d\s-]{8,}$/.test(contact.phone)) {
      setError('Invalid phone number format');
      return false;
    }
    setError(null);
    return true;
  };

  const addContact = () => {
    onChange([
      ...contacts,
      {
        id: `temp-${Date.now()}`,
        name: '',
        role: '',
        email: '',
        phone: '',
        address: '',
        isPrimary: contacts.length === 0,
      },
    ]);
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    // If removing primary contact, make the first remaining contact primary
    if (contacts[index].isPrimary && updatedContacts.length > 0) {
      updatedContacts[0].isPrimary = true;
    }
    onChange(updatedContacts);
  };

  const updateContact = (index: number, field: keyof Contact, value: string | boolean) => {
    const updatedContacts = contacts.map((contact, i) => {
      if (i === index) {
        const updatedContact = { ...contact, [field]: value };
        if (field === 'isPrimary' && value === true) {
          // Ensure only one primary contact
          return { ...updatedContact, isPrimary: true };
        }
        validateContact(updatedContact);
        return updatedContact;
      }
      // If setting a new primary contact, unset others
      if (field === 'isPrimary' && value === true) {
        return { ...contact, isPrimary: false };
      }
      return contact;
    });
    onChange(updatedContacts);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Contact Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company contacts
          </p>
        </div>
        <button
          type="button"
          onClick={addContact}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Contact
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={contact.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Name
                </span>
              </label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => updateContact(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={contact.role}
                onChange={(e) => updateContact(index, 'role', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contact role"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">


