'use client';

import { CategoryPage } from '@/components/category/category-page';
import { DocumentGrid } from '@/components/documents/document-grid';

export default function VideographyContractsPage() {
  return (
    <CategoryPage
      title="Videography Contracts"
      description="Browse and manage videography contract templates"
      type="doc"
    >
      <DocumentGrid 
        category="Videography Contracts"
        subcategories={[
          'Wedding Videography',
          'Commercial Video',
          'Event Videography'
        ]}
      />
    </CategoryPage>
  );
} 