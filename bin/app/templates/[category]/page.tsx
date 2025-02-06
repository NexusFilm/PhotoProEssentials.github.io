'use client';

import { useState, useEffect } from 'react';
import { DocumentList } from '@/components/documents/document-list';
import * as db from '@/lib/db';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  coverImage: string;
  pdfUrl: string;
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const category = params.category;

  useEffect(() => {
    async function loadDocuments() {
      try {
        const docs = await db.getDocumentsByCategory(category);
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {category.split('-').join(' ')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse available documents in this category
          </p>
        </div>
      </div>
      <DocumentList documents={documents} category={category} />
    </div>
  );
} 