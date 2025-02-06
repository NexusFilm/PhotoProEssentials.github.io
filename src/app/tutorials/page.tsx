'use client';

import React, { useState } from 'react';
import { TutorialList } from '../../components/tutorials/tutorial-list';
import { TutorialUpload } from '../../components/tutorials/tutorial-upload';
import { Plus, List } from 'lucide-react';

export default function TutorialsPage() {
  const [isAdmin] = useState(process.env.NEXT_PUBLIC_ADMIN_MODE === 'true');
  const [view, setView] = useState<'list' | 'upload'>('list');

  return (
    <div className="container py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Photography Tutorials</h1>
          <p className="mt-2 text-muted-foreground">
            Learn photography techniques from expert tutorials
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <List className="h-4 w-4" />
              View Tutorials
            </button>
            <button
              onClick={() => setView('upload')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                view === 'upload'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Plus className="h-4 w-4" />
              Add Tutorial
            </button>
          </div>
        )}
      </div>

      {view === 'list' ? (
        <TutorialList />
      ) : (
        isAdmin && <TutorialUpload />
      )}
    </div>
  );
} 