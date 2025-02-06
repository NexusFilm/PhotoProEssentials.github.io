'use client';

import { useState } from 'react';
import { FileText, Download, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useView } from '@/lib/view-context';

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

interface MobileDocumentListProps {
  category?: string;
}

export function MobileDocumentList({ category }: MobileDocumentListProps) {
  const { isAdminView } = useView();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleDownload = (doc: Document) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (doc: Document) => {
    // Handle edit action
    console.log('Edit document:', doc);
    setActiveMenu(null);
  };

  const handleDelete = (doc: Document) => {
    if (confirm('Are you sure you want to delete this document?')) {
      // Handle delete action
      console.log('Delete document:', doc);
    }
    setActiveMenu(null);
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold">No documents yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdminView 
            ? 'Start by uploading your first document.'
            : 'Check back later for available documents.'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {documents.map((doc) => (
        <div key={doc.id} className="p-4 bg-background">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate pr-4">
                {doc.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {doc.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {doc.subcategory}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {doc.type === 'file' ? 'PDF' : 'Link'}
                </span>
              </div>
            </div>

            <div className="relative flex items-start">
              {isAdminView ? (
                <>
                  <button
                    onClick={() => setActiveMenu(activeMenu === doc.id ? null : doc.id)}
                    className="p-2 rounded-lg hover:bg-accent"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {activeMenu === doc.id && (
                    <div className="absolute right-0 top-10 w-48 rounded-lg border bg-card shadow-lg">
                      <div className="p-1">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <button
                          onClick={() => handleEdit(doc)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 rounded-lg hover:bg-accent"
                >
                  <Download className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 