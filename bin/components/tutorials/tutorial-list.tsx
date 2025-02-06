'use client';

import React from 'react';
import { Play, Clock, Tag, FolderPlus, Upload } from 'lucide-react';
import Link from 'next/link';
import { useView } from '../../lib/view-context';

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

// Real tutorials data organized by category
const tutorials: Tutorial[] = [
  // Photography Basics
  {
    id: 'basics-1',
    title: 'Photography Basics: Exposure Triangle Explained',
    description: 'Learn the fundamentals of ISO, Aperture, and Shutter Speed in this comprehensive guide.',
    youtubeUrl: 'https://www.youtube.com/watch?v=LxO-6rlihSg',
    thumbnailUrl: 'https://i.ytimg.com/vi/LxO-6rlihSg/maxresdefault.jpg',
    duration: '12:51',
    category: 'photography-basics',
    views: 524000,
  },
  {
    id: 'basics-2',
    title: 'Camera Basics - How to Shoot in Manual Mode',
    description: 'Master manual mode on your camera with these essential tips and techniques.',
    youtubeUrl: 'https://www.youtube.com/watch?v=GFAhR5eXVD8',
    thumbnailUrl: 'https://i.ytimg.com/vi/GFAhR5eXVD8/maxresdefault.jpg',
    duration: '15:42',
    category: 'photography-basics',
    views: 892000,
  },

  // Lighting Techniques
  {
    id: 'lighting-1',
    title: 'Studio Lighting Techniques for Portrait Photography',
    description: 'Professional lighting setups and techniques for stunning portrait photography.',
    youtubeUrl: 'https://www.youtube.com/watch?v=j_5DtLDjkvM',
    thumbnailUrl: 'https://i.ytimg.com/vi/j_5DtLDjkvM/maxresdefault.jpg',
    duration: '20:15',
    category: 'lighting',
    views: 445000,
  },
  {
    id: 'lighting-2',
    title: 'Natural Light Portrait Photography Tips',
    description: 'Learn how to use natural light for beautiful portrait photography.',
    youtubeUrl: 'https://www.youtube.com/watch?v=f23IkmIHXuA',
    thumbnailUrl: 'https://i.ytimg.com/vi/f23IkmIHXuA/maxresdefault.jpg',
    duration: '18:30',
    category: 'lighting',
    views: 678000,
  },

  // Post-Processing
  {
    id: 'post-1',
    title: 'Lightroom Tutorial for Portrait Photography',
    description: 'Complete guide to editing portraits in Adobe Lightroom with professional techniques.',
    youtubeUrl: 'https://www.youtube.com/watch?v=D1yqv8O5miU',
    thumbnailUrl: 'https://i.ytimg.com/vi/D1yqv8O5miU/maxresdefault.jpg',
    duration: '25:18',
    category: 'post-processing',
    views: 892000,
  },
  {
    id: 'post-2',
    title: 'Advanced Color Grading in Photoshop',
    description: 'Master color grading techniques to enhance your photography.',
    youtubeUrl: 'https://www.youtube.com/watch?v=T6XNWVxY2yU',
    thumbnailUrl: 'https://i.ytimg.com/vi/T6XNWVxY2yU/maxresdefault.jpg',
    duration: '22:45',
    category: 'post-processing',
    views: 567000,
  },

  // Business Tips
  {
    id: 'business-1',
    title: 'How to Price Your Photography Services',
    description: 'Learn how to set profitable pricing for your photography business.',
    youtubeUrl: 'https://www.youtube.com/watch?v=hvVXHNWZi8g',
    thumbnailUrl: 'https://i.ytimg.com/vi/hvVXHNWZi8g/maxresdefault.jpg',
    duration: '16:42',
    category: 'business',
    views: 234000,
  },
  {
    id: 'business-2',
    title: 'Marketing Your Photography Business',
    description: 'Effective marketing strategies for photographers to grow their business.',
    youtubeUrl: 'https://www.youtube.com/watch?v=7ZWg2WEo_0E',
    thumbnailUrl: 'https://i.ytimg.com/vi/7ZWg2WEo_0E/maxresdefault.jpg',
    duration: '19:15',
    category: 'business',
    views: 345000,
  },
];

interface TutorialListProps {
  category?: string;
}

export function TutorialList({ category }: TutorialListProps) {
  const { isAdminView } = useView();
  const [tutorials, setTutorials] = React.useState<Tutorial[]>([]);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  if (tutorials.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <FolderPlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No tutorials yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdminView 
              ? 'Start by uploading your first tutorial.'
              : 'Check back later for available tutorials.'}
          </p>
          {isAdminView && (
            <Link
              href="/tutorials/upload"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" />
              Add Tutorial
            </Link>
          )}
        </div>
      </div>
    );
  }

  const filteredTutorials = category
    ? tutorials.filter(tutorial => 
        tutorial.category === category ||
        tutorial.category.includes(category.toLowerCase())
      )
    : tutorials;

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTutorials.map((tutorial) => (
          <a
            key={tutorial.id}
            href={tutorial.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50"
          >
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
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {tutorial.category.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-tight">
                {tutorial.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {tutorial.description}
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                {formatViews(tutorial.views)}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 