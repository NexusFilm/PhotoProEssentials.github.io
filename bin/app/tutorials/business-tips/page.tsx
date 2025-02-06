'use client';

import { CategoryPage } from '@/components/category/category-page';
import { TutorialGrid } from '@/components/tutorials/tutorial-grid';

export default function BusinessTipsPage() {
  return (
    <CategoryPage
      title="Business Tips"
      description="Learn photography business and marketing strategies"
      type="tutorial"
    >
      <TutorialGrid 
        category="Business Tips"
        subcategories={[
          'Pricing',
          'Marketing',
          'Client Management'
        ]}
      />
    </CategoryPage>
  );
} 