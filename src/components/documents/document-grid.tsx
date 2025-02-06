'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useView } from '@/lib/view-context';
import { saveContentArrangement, applyContentArrangement } from '@/lib/content-arrangement';
import * as db from '@/lib/db';
import { FileIcon } from '@/components/icons/file-icon';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: 'file' | 'link';
  url: string;
  thumbnail_url: string;
}

interface DocumentGridProps {
  category: string;
  subcategories: string[];
}

export function DocumentGrid({ category, subcategories }: DocumentGridProps) {
  const { isAdminView } = useView();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [category]);

  const loadDocuments = async () => {
    try {
      const docs = await db.getDocumentsByCategory(category);
      const arrangedDocs = await applyContentArrangement(docs, category, 'doc');
      setDocuments(arrangedDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
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

    const items = Array.from(documents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDocuments(items);

    // Save the new arrangement
    try {
      await saveContentArrangement(
        category,
        'doc',
        items.map(item => item.id)
      );
    } catch (error) {
      console.error('Error saving arrangement:', error);
      // Revert to previous arrangement on error
      loadDocuments();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-lg border-2 border-dashed p-12 text-muted-foreground">
          <p className="mb-2 text-lg font-medium">No documents yet</p>
          <p className="text-sm">
            {isAdminView 
              ? 'Start by uploading your first document.'
              : 'Check back later for available documents.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="documents">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {documents.map((doc, index) => (
              <Draggable
                key={doc.id}
                draggableId={doc.id}
                index={index}
                isDragDisabled={!isAdminView}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`rounded-lg border bg-card p-4 shadow-sm transition-shadow ${
                      snapshot.isDragging ? 'shadow-lg' : ''
                    }`}
                  >
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                      {doc.thumbnail_url ? (
                        <img
                          src={doc.thumbnail_url}
                          alt={doc.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium line-clamp-1">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {doc.description}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {doc.subcategory}
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
  );
} 