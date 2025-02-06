'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Camera, Video, Users, Briefcase, 
  Image, Film, UserCheck, Building,
  Calendar, DollarSign, Shield, FileCheck,
  Youtube, Lightbulb, Presentation, BookOpen,
  Upload
} from 'lucide-react';
import { DocumentList } from '../documents/document-list';
import { TutorialList } from '../tutorials/tutorial-list';
import { useView } from '@/lib/view-context';
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

const documentCategories = [
  {
    name: 'Photography Contracts',
    href: '/categories/photography-contracts'
  },
  {
    name: 'Videography Contracts',
    href: '/categories/videography-contracts'
  },
  {
    name: 'Client Agreements',
    href: '/categories/client-agreements'
  },
  {
    name: 'Business Documents',
    href: '/categories/business-documents'
  }
];

const tutorialCategories = [
  {
    name: 'Photography Basics',
    href: '/tutorials/photography-basics'
  },
  {
    name: 'Lighting Techniques',
    href: '/tutorials/lighting-techniques'
  },
  {
    name: 'Post-Processing',
    href: '/tutorials/post-processing'
  },
  {
    name: 'Business Tips',
    href: '/tutorials/business-tips'
  }
];

export function Sidebar() {
  const [selectedType, setSelectedType] = useState<'doc' | 'tutorial'>('doc');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { isAdminView } = useView();

  useEffect(() => {
    async function loadDocuments() {
      if (selectedType === 'doc' && selectedCategory) {
        try {
          const docs = await db.getDocumentsByCategory(selectedCategory);
          setDocuments(docs);
        } catch (error) {
          console.error('Error loading documents:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadDocuments();
  }, [selectedType, selectedCategory]);

  const handleCategoryClick = (type: 'doc' | 'tutorial', category: string) => {
    setSelectedType(type);
    setSelectedCategory(category);
  };

  return (
    <div className="flex h-screen flex-col gap-4">
      <div className="space-y-4">
        <div>
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Documents
          </h2>
          <div className="space-y-1">
            {documentCategories.map((category) => (
              <button
                key={category.href}
                onClick={() => handleCategoryClick('doc', category.name)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  selectedType === 'doc' && selectedCategory === category.name
                    ? 'bg-accent'
                    : ''
                }`}
              >
                <Camera className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Tutorials
          </h2>
          <div className="space-y-1">
            {tutorialCategories.map((category) => (
              <button
                key={category.href}
                onClick={() => handleCategoryClick('tutorial', category.name)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  selectedType === 'tutorial' && selectedCategory === category.name
                    ? 'bg-accent'
                    : ''
                }`}
              >
                <Youtube className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCategory && (
        <div className="flex-1 overflow-auto px-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{selectedCategory}</h3>
            <p className="text-sm text-muted-foreground">
              Browse available {selectedType === 'doc' ? 'documents' : 'tutorials'}
            </p>
          </div>
          {selectedType === 'doc' ? (
            loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <DocumentList documents={documents} category={selectedCategory} />
            )
          ) : (
            <TutorialList category={selectedCategory} />
          )}
        </div>
      )}
    </div>
  );
} 