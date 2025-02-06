'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useView } from '@/lib/view-context';
import { Play, Clock, Star, Trash2 } from 'lucide-react';
import { saveContentArrangement, applyContentArrangement } from '@/lib/content-arrangement';
import * as db from '@/lib/db';
import { addToFeatured, removeFromFeatured } from '@/lib/db';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  subcategory: string;
  views: number;
}

interface TutorialGridProps {
  category: string;
  subcategories: string[];
}

export function TutorialGrid({ category, subcategories }: TutorialGridProps) {
  const { isAdminView } = useView();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTutorials();
  }, [category]);

  const loadTutorials = async () => {
    try {
      const items = await db.getTutorialsByCategory(category);
      const arrangedItems = await applyContentArrangement(items, category, 'tutorial');
      setTutorials(arrangedItems);
    } catch (error) {
      console.error('Error loading tutorials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = async (result: any) => {
    setIsDragging(false);
    
    if (!result.destination) {
      return;
    }

    const items = Array.from(tutorials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTutorials(items);

    // Save the new arrangement
    try {
      await saveContentArrangement(
        category,
        'tutorial',
        items.map(item => item.id)
      );
    } catch (error) {
      console.error('Error saving arrangement:', error);
      // Revert to previous arrangement on error
      loadTutorials();
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const handleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleFeature = async () => {
    if (!selectedItems.length) return;

    try {
      const selectedTutorials = tutorials.filter(t => selectedItems.includes(t.id));
      
      for (const tutorial of selectedTutorials) {
        await addToFeatured({
          type: 'tutorial',
          title: tutorial.title,
          description: tutorial.description,
          thumbnailUrl: tutorial.thumbnailUrl,
          url: tutorial.youtubeUrl,
          category: tutorial.category
        });
      }

      setSelectedItems([]);
      // Show success message or notification
    } catch (error) {
      console.error('Error featuring tutorials:', error);
      // Show error message
    }
  };

  const handleDelete = async () => {
    if (!selectedItems.length || !confirm('Are you sure you want to delete the selected tutorials?')) return;

    try {
      // Implement delete logic here
      setSelectedItems([]);
      // Show success message
    } catch (error) {
      console.error('Error deleting tutorials:', error);
      // Show error message
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (tutorials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-lg border-2 border-dashed p-12 text-muted-foreground">
          <p className="mb-2 text-lg font-medium">No tutorials yet</p>
          <p className="text-sm">
            {isAdminView 
              ? 'Start by uploading your first tutorial.'
              : 'Check back later for available tutorials.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAdminView && selectedItems.length > 0 && (
        <div className="sticky top-20 z-10 mb-4 flex items-center justify-between rounded-lg border bg-card p-4 shadow-lg">
          <p className="text-sm">
            <span className="font-medium">{selectedItems.length}</span> items selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleFeature}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Star className="h-4 w-4" />
              Add to Featured
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="tutorials">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {tutorials.map((tutorial, index) => (
                <Draggable
                  key={tutorial.id}
                  draggableId={tutorial.id}
                  index={index}
                  isDragDisabled={!isAdminView}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      } ${selectedItems.includes(tutorial.id) ? 'ring-2 ring-primary' : ''}`}
                    >
                      {isAdminView && (
                        <div className="absolute right-2 top-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(tutorial.id)}
                            onChange={() => handleSelect(tutorial.id)}
                            className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                          />
                        </div>
                      )}

                      {/* Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img
                          src={tutorial.thumbnailUrl}
                          alt={tutorial.title}
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                          <Clock className="h-3 w-3" />
                          {tutorial.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="rounded-full bg-primary/90 p-4">
                            <Play className="h-6 w-6 text-white" fill="white" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-base font-semibold leading-tight">
                          {tutorial.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {tutorial.description}
                        </p>
                        <div className="mt-3 text-xs text-muted-foreground">
                          {formatViews(tutorial.views)}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
} 