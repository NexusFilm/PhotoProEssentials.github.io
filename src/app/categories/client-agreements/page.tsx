'use client';

import { CategoryPage } from '@/components/category/category-page';
import { DocumentGrid } from '@/components/documents/document-grid';

export default function ClientAgreementsPage() {
  return (
    <CategoryPage
      title="Client Agreements"
      description="Browse and manage client agreement templates"
      type="doc"
    >
      <DocumentGrid 
        category="Client Agreements"
        subcategories={[
          'Service Agreements',
          'Model Releases',
          'Usage Rights'
        ]}
      />
    </CategoryPage>
  );
} 