'use client';

import { CategoryPage } from '@/components/category/category-page';
import { DocumentGrid } from '@/components/documents/document-grid';

export default function BusinessDocumentsPage() {
  return (
    <CategoryPage
      title="Business Documents"
      description="Browse and manage business document templates"
      type="doc"
    >
      <DocumentGrid 
        category="Business Documents"
        subcategories={[
          'Invoice Templates',
          'Studio Policies',
          'Terms of Service'
        ]}
      />
    </CategoryPage>
  );
} 