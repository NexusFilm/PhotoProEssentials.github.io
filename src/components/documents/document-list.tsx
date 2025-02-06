'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Download, Tag, ExternalLink, Pencil, Trash2, FolderPlus, Upload } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  coverImage: string;
  pdfUrl: string;
}

interface DocumentListProps {
  category?: string;
  isAdminView?: boolean;
  documents: Document[];
  onDocumentClick?: (doc: Document) => void;
}

export function DocumentList({ category, isAdminView = false, documents, onDocumentClick }: DocumentListProps) {
  const [loading, setLoading] = useState(false);

  const handleEdit = (doc: Document) => {
    // Handle edit action
    console.log('Edit document:', doc);
  };

  const handleDelete = (doc: Document) => {
    // Handle delete action
    if (confirm('Are you sure you want to delete this document?')) {
      console.log('Delete document:', doc);
    }
  };

  const handleDocumentClick = useCallback((doc: Document) => {
    if (onDocumentClick) {
      onDocumentClick(doc);
      return;
    }
    
    if (typeof window !== 'undefined') {
      window.open(doc.pdfUrl, '_blank', 'noopener,noreferrer');
    }
  }, [onDocumentClick]);

  const filteredDocuments = category
    ? documents.filter(doc => 
        doc.category.toLowerCase().includes(category.replace(/-/g, ' ')) ||
        doc.subcategory.toLowerCase().includes(category.replace(/-/g, ' '))
      )
    : documents;

  if (filteredDocuments.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <FolderPlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No documents yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdminView 
              ? 'Start by uploading your first document or template.'
              : 'Check back later for available documents and templates.'}
          </p>
          {isAdminView && (
            <Link
              href="/upload"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
          >
            {isAdminView && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleEdit(doc)}
                  className="p-2 rounded-full bg-background/90 hover:bg-background text-muted-foreground hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="p-2 rounded-full bg-background/90 hover:bg-background text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            
            <div
              className="relative aspect-video w-full overflow-hidden rounded-t-xl cursor-pointer"
              onClick={() => handleDocumentClick(doc)}
            >
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105 ${
                  loading ? 'animate-shimmer' : ''
                }`}
                style={{ backgroundImage: `url(${doc.coverImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {doc.subcategory}
                </span>
              </div>
              <h3 className="mt-2 font-semibold leading-none tracking-tight">
                {doc.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {doc.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleDocumentClick(doc)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <FileText className="h-4 w-4" />
                  View Template
                </button>
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 