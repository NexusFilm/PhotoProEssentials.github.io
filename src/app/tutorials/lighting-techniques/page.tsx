'use client';

import { CategoryPage } from '@/components/category/category-page';
import { TutorialGrid } from '@/components/tutorials/tutorial-grid';

export default function LightingTechniquesPage() {
  return (
    <CategoryPage
      title="Lighting Techniques"
      description="Master photography lighting techniques and setups"
      type="tutorial"
    >
      <TutorialGrid 
        category="Lighting Techniques"
        subcategories={[
          'Natural Light',
          'Studio Lighting',
          'Flash Photography'
        ]}
      />
    </CategoryPage>
  );
} 