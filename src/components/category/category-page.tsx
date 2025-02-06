'use client';

import { useState } from 'react';
import { Upload, Edit, Save, Youtube, Plus } from 'lucide-react';
import { useView } from '@/lib/view-context';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface CategoryPageProps {
  title: string;
  description: string;
  type: 'doc' | 'tutorial';
  children: React.ReactNode;
}

export function CategoryPage({ title, description, type, children }: CategoryPageProps) {
  const { isAdminView } = useView();
  const router = useRouter();
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const category = pathname.split('/').pop();

  const handleSave = () => {
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleContentChange = () => {
    setHasChanges(true);
  };

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

    if (type === 'doc') {
      const file = e.dataTransfer.files[0];
      if (file?.type === 'application/pdf') {
        // Redirect to upload page with file and category
        router.push(`/upload?category=${category}`);
      } else {
        alert('Please drop a PDF file');
      }
    } else {
      // Handle YouTube URL drop
      const text = e.dataTransfer.getData('text');
      if (text.includes('youtube.com') || text.includes('youtu.be')) {
        router.push(`/tutorials/upload?category=${category}&url=${encodeURIComponent(text)}`);
      } else {
        alert('Please drop a YouTube URL');
      }
    }
  };

  return (
    <div 
      className="container py-6 relative min-h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {category?.split('-').join(' ')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse available {type === 'doc' ? 'documents' : 'tutorials'} in this category
          </p>
        </div>
        
        {isAdminView && (
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                  hasChanges 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground'
                }`}
                disabled={!hasChanges}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium hover:bg-accent/90"
                >
                  <Edit className="h-4 w-4" />
                  Edit Layout
                </button>
                <Link
                  href={`${type === 'doc' ? '/upload' : '/tutorials/upload'}?category=${pathname.split('/').pop()}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Add {type === 'doc' ? 'Document' : 'Tutorial'}
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className={`relative ${isEditing ? 'cursor-move' : ''}`}>
        {children}
      </div>

      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary rounded-lg z-50">
          <div className="text-center p-8 rounded-lg bg-background/80">
            <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Drop to Upload</h3>
            <p className="text-sm text-muted-foreground">
              {type === 'doc' 
                ? 'Drop your PDF file here to upload' 
                : 'Drop a YouTube URL here to add tutorial'}
            </p>
          </div>
        </div>
      )}

      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-background border shadow-lg rounded-lg p-4 flex items-center gap-4">
          <p className="text-sm font-medium">You have unsaved changes</p>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
} 