'use client';

import { CategoryPage } from '@/components/category/category-page';
import { DocumentGrid } from '@/components/documents/document-grid';

export default function PhotographyContractsPage() {
  return (
    <CategoryPage
      title="Photography Contracts"
      description="Browse and manage photography contract templates"
      type="doc"
    >
      <DocumentGrid 
        category="Photography Contracts"
        subcategories={[
          'Wedding Photography',
          'Portrait Sessions',
          'Event Photography'
        ]}
      />
    </CategoryPage>
  );
} 