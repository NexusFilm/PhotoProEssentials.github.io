'use client';

import { CategoryPage } from '@/components/category/category-page';
import { TutorialGrid } from '@/components/tutorials/tutorial-grid';

export default function PhotographyBasicsPage() {
  return (
    <CategoryPage
      title="Photography Basics"
      description="Learn fundamental photography techniques and concepts"
      type="tutorial"
    >
      <TutorialGrid 
        category="Photography Basics"
        subcategories={[
          'Camera Settings',
          'Composition',
          'Exposure'
        ]}
      />
    </CategoryPage>
  );
} 