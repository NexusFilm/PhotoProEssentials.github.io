'use client';

import React, { useState } from 'react';
import { Youtube, Loader2 } from 'lucide-react';

interface TutorialFormData {
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  thumbnailUrl: string;
  duration: string;
}

const categories = [
  'Photography Basics',
  'Lighting Techniques',
  'Post-Processing',
  'Business Tips',
  'Camera Settings',
  'Composition',
  'Portrait Photography',
  'Landscape Photography',
  'Studio Setup',
  'Marketing Tips',
];

export function TutorialUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TutorialFormData>({
    title: '',
    description: '',
    youtubeUrl: '',
    category: '',
    thumbnailUrl: '',
    duration: ''
  });

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchYouTubeMetadata = async (url: string) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) return;

    setIsLoading(true);
    try {
      // Fetch video metadata using YouTube oEmbed API
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const data = await response.json();

      // Set form data with fetched metadata
      setFormData(prev => ({
        ...prev,
        title: data.title,
        description: data.description || '',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        youtubeUrl: url,
        // Note: YouTube oEmbed doesn't provide duration, you'd need YouTube Data API for that
        duration: '00:00'
      }));
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, youtubeUrl: url }));
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      await fetchYouTubeMetadata(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual upload logic here
      console.log('Tutorial data to save:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        youtubeUrl: '',
        category: '',
        thumbnailUrl: '',
        duration: ''
      });
    } catch (error) {
      console.error('Upload error:', error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-2xl py-10">
      <div className="space-y-6">
        {/* YouTube URL Input */}
        <div>
          <label className="text-sm font-medium leading-none">
            YouTube Video URL
          </label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
              <Youtube className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Video Preview */}
        {formData.thumbnailUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={formData.thumbnailUrl}
              alt="Video thumbnail"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Youtube className="h-12 w-12 text-white" />
            </div>
          </div>
        )}

        {/* Title Input */}
        <div>
          <label className="text-sm font-medium leading-none">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Enter tutorial title"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="text-sm font-medium leading-none">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-2 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Enter tutorial description"
            required
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium leading-none">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.youtubeUrl}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${
            isLoading || !formData.youtubeUrl
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {formData.thumbnailUrl ? 'Adding Tutorial...' : 'Fetching Video Data...'}
            </span>
          ) : (
            'Add Tutorial'
          )}
        </button>
      </div>
    </form>
  );
} 