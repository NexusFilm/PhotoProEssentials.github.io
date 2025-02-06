'use client';

import { useState, useEffect } from 'react';
import { File, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import * as db from '../../lib/db';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: 'file' | 'link';
  url: string;
  thumbnail_url: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const docs = await db.getDocuments();
      setDocuments(docs);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(docs.map(doc => doc.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredDocuments = selectedCategory
    ? documents.filter(doc => doc.category === selectedCategory)
    : documents;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Documents</h1>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border bg-card p-4 hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
              {doc.thumbnail_url ? (
                <img
                  src={doc.thumbnail_url}
                  alt={doc.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {doc.type === 'file' ? (
                  <File className="h-4 w-4 text-primary" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-primary" />
                )}
                <span className="text-xs text-muted-foreground">
                  {doc.category} / {doc.subcategory}
                </span>
              </div>
              <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {doc.description}
              </p>
            </div>
          </a>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No documents found{selectedCategory ? ` in ${selectedCategory}` : ''}.
          </p>
        </div>
      )}
    </div>
  );
} 