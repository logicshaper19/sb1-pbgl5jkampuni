'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  FileText,
  Download,
  Printer,
  Share2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Trash2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import type { Document, DocumentPermission } from '@/types';

interface DocumentViewerProps {
  document: Document;
  onClose?: () => void;
  onDelete?: (id: string) => void;
}

export function DocumentViewer({ document, onClose, onDelete }: DocumentViewerProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<DocumentPermission | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const [permissionsRes, pagesRes] = await Promise.all([
          fetch(`/api/documents/${document.id}/permissions`),
          fetch(`/api/documents/${document.id}/pages`)
        ]);

        if (!permissionsRes.ok || !pagesRes.ok) {
          throw new Error('Failed to fetch document details');
        }

        const [permissionsData, pagesData] = await Promise.all([
          permissionsRes.json(),
          pagesRes.json()
        ]);

        setPermissions(permissionsData);
        setTotalPages(pagesData.total);
      } catch (err) {
        console.error('Document details fetch error:', err);
        setError('Failed to load document details');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [document.id]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download document');
    }
  };

  const handlePrint = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/print`);
      if (!response.ok) throw new Error('Print preparation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error('Print error:', err);
      setError('Failed to print document');
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/share`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to generate share link');

      const { shareUrl } = await response.json();
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Share error:', err);
      setError('Failed to share document');
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Delete failed');

      onDelete(document.id);
      onClose?.();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete document');
    }
  };

  if (!permissions?.canView) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Lock className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have permission to view this document.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {document.filename}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {permissions?.canDownload && (
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
          )}
          {permissions?.canPrint && (
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </button>
          )}
          {permissions?.canShare && (
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              title="Share"
            >
              <Share2 className="h-5 w-5" />
            </button>
          )}
          {permissions?.canDelete && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 overflow-auto relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <div
            ref={viewerRef}
            className="relative h-full"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <img
              src={`/api/documents/${document.id}/pages/${currentPage}`}
              alt={`Page ${currentPage}`}
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-t">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom(z => Math.max(25, z - 25))}
              disabled={zoom <= 25}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(400, z + 25))}
              disabled={zoom >= 400}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setRotation(r => (r + 90) % 360)}
            className="p-1 text-gray-600 hover:text-gray-900"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">{currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
