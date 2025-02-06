'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentUpload } from '../../components/documents/document-upload';

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin mode is enabled
    if (process.env.NEXT_PUBLIC_ADMIN_MODE !== 'true') {
      router.push('/');
    }
  }, [router]);

  // Only render the upload form if in admin mode
  if (process.env.NEXT_PUBLIC_ADMIN_MODE !== 'true') {
    return null;
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upload Template</h1>
          <p className="mt-2 text-muted-foreground">
            Add a new contract template to your library.
          </p>
        </div>
      </div>
      <DocumentUpload />
    </div>
  );
} 