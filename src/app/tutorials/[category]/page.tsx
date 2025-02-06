'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Upload } from 'lucide-react';
import { TutorialList } from '@/components/tutorials/tutorial-list';
import { useView } from '@/lib/view-context';

export default function TutorialCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { isAdminView } = useView();

  const formatCategoryTitle = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{formatCategoryTitle(category)} Tutorials</h1>
          <p className="mt-2 text-muted-foreground">
            Learn {formatCategoryTitle(category).toLowerCase()} techniques and tips
          </p>
        </div>
        {isAdminView && (
          <Link
            href={`/tutorials/upload?category=${category}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" />
            Add Tutorial
          </Link>
        )}
      </div>
      <TutorialList category={category} />
    </div>
  );
} 