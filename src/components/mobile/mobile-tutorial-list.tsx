'use client';

import { useState } from 'react';
import { Play, Clock, MoreVertical, Edit, Trash2, Star } from 'lucide-react';
import { useView } from '@/lib/view-context';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  views: number;
}

interface MobileTutorialListProps {
  category?: string;
}

export function MobileTutorialList({ category }: MobileTutorialListProps) {
  const { isAdminView } = useView();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const handleEdit = (tutorial: Tutorial) => {
    // Handle edit action
    console.log('Edit tutorial:', tutorial);
    setActiveMenu(null);
  };

  const handleDelete = (tutorial: Tutorial) => {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      // Handle delete action
      console.log('Delete tutorial:', tutorial);
    }
    setActiveMenu(null);
  };

  const handleFeature = (tutorial: Tutorial) => {
    // Handle feature action
    console.log('Feature tutorial:', tutorial);
    setActiveMenu(null);
  };

  if (tutorials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Play className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold">No tutorials yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdminView 
            ? 'Start by adding your first tutorial.'
            : 'Check back later for available tutorials.'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {tutorials.map((tutorial) => (
        <div key={tutorial.id} className="p-4 bg-background">
          <div className="flex items-start gap-4">
            <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={tutorial.thumbnailUrl}
                alt={tutorial.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                <Clock className="h-3 w-3" />
                {tutorial.duration}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-2">
                {tutorial.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {tutorial.description}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                {formatViews(tutorial.views)}
              </div>
            </div>

            {isAdminView && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setActiveMenu(activeMenu === tutorial.id ? null : tutorial.id)}
                  className="p-2 rounded-lg hover:bg-accent"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                
                {activeMenu === tutorial.id && (
                  <div className="absolute right-0 top-10 w-48 rounded-lg border bg-card shadow-lg">
                    <div className="p-1">
                      <button
                        onClick={() => handleFeature(tutorial)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                      >
                        <Star className="h-4 w-4" />
                        Feature
                      </button>
                      <button
                        onClick={() => handleEdit(tutorial)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tutorial)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 