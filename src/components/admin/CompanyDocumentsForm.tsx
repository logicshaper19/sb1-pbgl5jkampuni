'use client';

import React, { useState } from 'react';
import { Document } from '../../types';
import { Plus, Trash2, AlertTriangle, FileText, Calendar, Download, Upload } from 'lucide-react';

interface CompanyDocumentsFormProps {
  documents: Document[];
  onChange: (documents: Document[]) => void;
  onUpload?: (file: File) => Promise<string>;
}

export const CompanyDocumentsForm = ({ 
  documents, 
  onChange,
  onUpload 
}: CompanyDocumentsFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateDocument = (document: Document): boolean => {
    if (!document.title || !document.type) {
      setError('Title and type are required');
      return false;
    }
    setError(null);
    return true;
  };

  const addDocument = () => {
    onChange([
      ...documents,
      {
        id: `temp-${Date.now()}`,
        title: '',
        type: 'CERTIFICATE',
        uploadDate: new Date().toISOString(),
        fileUrl: '',
        description: '',
      },
    ]);
  };

  const removeDocument = (index: number) => {
    onChange(documents.filter((_, i) => i !== index));
  };

  const updateDocument = (index: number, field: keyof Document, value: string) => {
    const updatedDocuments = documents.map((document, i) => {
      if (i === index) {
        const updatedDocument = { ...document, [field]: value };
        validateDocument(updatedDocument);
        return updatedDocument;
      }
      return document;
    });
    onChange(updatedDocuments);
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!onUpload) return;

    try {
      setUploading(true);
      setError(null);
      const fileUrl = await onUpload(file);
      updateDocument(index, 'fileUrl', fileUrl);
      updateDocument(index, 'title', file.name);
    } catch (err) {
      setError('Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Company Documents</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company documents and certificates
          </p>
        </div>
        <button
          type="button"
          onClick={addDocument}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Document
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {documents.map((document, index) => (
          <div key={document.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Document Title
                </span>
              </label>
              <input
                type="text"
                value={document.title}
                onChange={(e) => updateDocument(index, 'title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Document title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Document Type</label>
              <select
                value={document.type}
                onChange={(e) => updateDocument(index, 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="CERTIFICATE">Certificate</option>
                <option value="LICENSE">License</option>
                <option value="PERMIT">Permit</option>
                <option value="REPORT">Report</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Upload Date
                </span>
              </label>
              <input
                type="date"
                value={document.uploadDate.split('T')[0]}
                onChange={(e) => updateDocument(index, 'uploadDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={document.description || ''}
                onChange={(e) => updateDocument(index, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Document description"
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between space-x-4">
                {onUpload && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">File</label>
                    <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            Upload a file
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(index, e.target.files[0])}
                      />
                    </label>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  {document.fileUrl && (
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Remove document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
