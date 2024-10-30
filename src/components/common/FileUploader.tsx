'use client';

import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  FileText,
  Image as ImageIcon,
  Film,
  Archive
} from 'lucide-react';
import type { FileUpload } from '@/types';

interface FileUploaderProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  onUpload?: (files: FileUpload[]) => void;
  onError?: (error: string) => void;
  className?: string;
  multiple?: boolean;
  showPreview?: boolean;
}

export function FileUploader({
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['*'],
  onUpload,
  onError,
  className = '',
  multiple = true,
  showPreview = true
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const uploadController = useRef<AbortController | null>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-blue-500" />;
    if (type.startsWith('video/')) return <Film className="h-8 w-8 text-purple-500" />;
    if (type.startsWith('application/pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-8 w-8 text-yellow-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length + files.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      onError?.(`Some files exceed the ${formatFileSize(maxSize)} size limit`);
      return;
    }

    setUploading(true);
    uploadController.current = new AbortController();

    try {
      const uploads = await Promise.all(
        acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            signal: uploadController.current?.signal,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(prev => ({
                  ...prev,
                  [file.name]: progress
                }));
              }
            }
          });

          if (!response.ok) throw new Error('Upload failed');

          const data = await response.json();
          return {
            id: data.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: data.url,
            uploadedAt: new Date().toISOString()
          };
        })
      );

      setFiles(prev => [...prev, ...uploads]);
      onUpload?.(uploads);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          onError?.('Upload cancelled');
        } else {
          onError?.(error.message);
        }
      }
    } finally {
      setUploading(false);
      setUploadProgress({});
      uploadController.current = null;
    }
  }, [files.length, maxFiles, maxSize, onError, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => ({
      ...acc,
      [type]: []
    }), {}),
    multiple,
    disabled: uploading
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const cancelUpload = () => {
    uploadController.current?.abort();
    setUploading(false);
    setUploadProgress({});
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : `Drag 'n' drop files here, or click to select files`}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {`Maximum ${maxFiles} files, up to ${formatFileSize(maxSize)} each`}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              {showPreview && file.type.startsWith('image/') && (
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-10 w-10 object-cover rounded"
                />
              )}
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
            <button
              onClick={cancelUpload}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Cancel
            </button>
          </div>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{fileName}</span>
                <span>{progress}%</span>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-500 rounded transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
