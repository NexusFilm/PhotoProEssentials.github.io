'use client';

import { CategoryPage } from '@/components/category/category-page';
import { TutorialGrid } from '@/components/tutorials/tutorial-grid';

export default function PostProcessingPage() {
  return (
    <CategoryPage
      title="Post-Processing"
      description="Learn photo editing and post-processing techniques"
      type="tutorial"
    >
      <TutorialGrid 
        category="Post-Processing"
        subcategories={[
          'Lightroom',
          'Photoshop',
          'Color Grading'
        ]}
      />
    </CategoryPage>
  );
} 