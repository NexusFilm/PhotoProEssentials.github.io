'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TutorialUpload } from '@/components/tutorials/tutorial-upload';

function TutorialUploadContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upload Tutorial</h1>
          <p className="mt-2 text-muted-foreground">
            Add a new tutorial to your library
          </p>
        </div>
      </div>
      <TutorialUpload />
    </div>
  );
}

export default function TutorialUploadPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <TutorialUploadContent />
    </Suspense>
  );
} 