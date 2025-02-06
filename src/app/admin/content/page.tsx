'use client';

import { useAuth } from '../../../lib/auth-context';
import { DocumentManager } from '../../../components/documents/document-manager';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ContentManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Content Management</h1>
      <DocumentManager />
    </div>
  );
} 