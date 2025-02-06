'use client';

import React, { useState } from 'react';
import { Upload, X, Plus, Loader2, Link as LinkIcon, FileText } from 'lucide-react';

interface UploadFormData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  file: File | null;
  pdfUrl: string;
  uploadType: 'file' | 'url';
}

const categories = {
  'Photography Contracts': [
    'Wedding Photography',
    'Portrait Sessions',
    'Event Photography',
  ],
  'Videography Contracts': [
    'Wedding Videography',
    'Commercial Video',
    'Event Videography',
  ],
  'Client Agreements': [
    'Service Agreements',
    'Model Releases',
    'Usage Rights',
  ],
  'Business Documents': [
    'Invoice Templates',
    'Studio Policies',
    'Terms of Service',
  ],
};

export function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    file: null,
    pdfUrl: '',
    uploadType: 'file',
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, file: droppedFile, uploadType: 'file' }));
      await extractMetadata(droppedFile);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, file: selectedFile, uploadType: 'file' }));
      await extractMetadata(selectedFile);
    }
  };

  const extractMetadata = async (file: File) => {
    setIsExtracting(true);
    try {
      // Here you would integrate with a PDF parsing library or API
      // For now, we'll just use the filename as a demo
      const fileName = file.name.replace('.pdf', '');
      const words = fileName.split(/[_-\s]/);
      
      // Basic attempt to generate a title and description
      const title = words.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      
      setFormData(prev => ({
        ...prev,
        title: title,
        description: `This is a ${title.toLowerCase()} document.`,
      }));

      // Attempt to match category based on filename
      for (const [category, subcategories] of Object.entries(categories)) {
        const categoryMatch = category.toLowerCase().split(' ')[0];
        if (fileName.toLowerCase().includes(categoryMatch)) {
          setFormData(prev => ({ ...prev, category }));
          break;
        }
      }
    } catch (error) {
      console.error('Error extracting metadata:', error);
    }
    setIsExtracting(false);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pdfUrl) return;

    setIsExtracting(true);
    try {
      // Here you would validate the URL and potentially fetch metadata
      const urlParts = formData.pdfUrl.split('/');
      const fileName = urlParts[urlParts.length - 1].replace('.pdf', '');
      
      setFormData(prev => ({
        ...prev,
        title: fileName.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        uploadType: 'url',
      }));
    } catch (error) {
      console.error('Error processing URL:', error);
    }
    setIsExtracting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // TODO: Implement actual upload logic here
      console.log('Form data to upload:', formData);
      
      if (formData.uploadType === 'file') {
        // Handle file upload
        console.log('Uploading file:', formData.file?.name);
      } else {
        // Handle URL submission
        console.log('Submitting URL:', formData.pdfUrl);
      }

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset form after successful upload
      setFormData({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        file: null,
        pdfUrl: '',
        uploadType: 'file',
      });
    } catch (error) {
      console.error('Upload error:', error);
    }

    setIsUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-2xl py-10">
      <div className="space-y-6">
        {/* Upload Type Selection */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, uploadType: 'file' }))}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              formData.uploadType === 'file'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" />
              Upload File
            </div>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, uploadType: 'url' }))}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              formData.uploadType === 'url'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Add URL
            </div>
          </button>
        </div>

        {/* File Upload Area */}
        {formData.uploadType === 'file' ? (
          <div
            className={`relative rounded-lg border-2 border-dashed p-12 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div className="flex flex-col items-center">
              {formData.file ? (
                <>
                  <div className="flex items-center gap-2">
                    <Upload className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium">{formData.file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                    className="mt-2 text-sm text-muted-foreground hover:text-destructive"
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Upload Contract Template</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop your PDF file here, or click to select a file
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* URL Input */
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none">
                PDF URL
              </label>
              <input
                type="url"
                value={formData.pdfUrl}
                onChange={e => setFormData(prev => ({ ...prev, pdfUrl: e.target.value }))}
                onBlur={handleUrlSubmit}
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="https://example.com/document.pdf"
                required={formData.uploadType === 'url'}
              />
            </div>
          </div>
        )}

        {/* Metadata Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium leading-none">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter template title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium leading-none">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-2 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter template description"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium leading-none">
              Category
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select a category</option>
              {Object.keys(categories).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {formData.category && (
            <div>
              <label className="text-sm font-medium leading-none">
                Subcategory
              </label>
              <select
                value={formData.subcategory}
                onChange={e => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Select a subcategory</option>
                {categories[formData.category as keyof typeof categories].map(subcategory => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={(!formData.file && !formData.pdfUrl) || isUploading || isExtracting}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${
            (!formData.file && !formData.pdfUrl) || isUploading || isExtracting
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : isExtracting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Extracting Metadata...
            </span>
          ) : (
            'Upload Template'
          )}
        </button>
      </div>
    </form>
  );
} 