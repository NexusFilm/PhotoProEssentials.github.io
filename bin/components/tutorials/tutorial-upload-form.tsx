'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Youtube, Link as LinkIcon } from 'lucide-react';

interface TutorialFormData {
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  subcategory: string;
  thumbnailUrl: string;
  duration: string;
}

interface CategoryData {
  name: string;
  subcategories: string[];
}

type Categories = {
  [key: string]: CategoryData;
}

const categories: Categories = {
  'photography-basics': {
    name: 'Photography Basics',
    subcategories: ['Camera Settings', 'Composition', 'Exposure']
  },
  'lighting-techniques': {
    name: 'Lighting Techniques',
    subcategories: ['Natural Light', 'Studio Lighting', 'Flash Photography']
  },
  'post-processing': {
    name: 'Post-Processing',
    subcategories: ['Lightroom', 'Photoshop', 'Color Grading']
  },
  'business-tips': {
    name: 'Business Tips',
    subcategories: ['Pricing', 'Marketing', 'Client Management']
  }
};

export function TutorialUploadForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const urlFromDrop = searchParams.get('url');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TutorialFormData>({
    title: '',
    description: '',
    youtubeUrl: '',
    category: categoryFromUrl || '',
    subcategory: '',
    thumbnailUrl: '',
    duration: ''
  });

  useEffect(() => {
    if (categoryFromUrl && categories[categoryFromUrl]) {
      setFormData(prev => ({
        ...prev,
        category: categoryFromUrl,
        subcategory: categories[categoryFromUrl].subcategories[0]
      }));
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    if (urlFromDrop) {
      handleUrlChange(decodeURIComponent(urlFromDrop));
    }
  }, [urlFromDrop]);

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
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        title: data.title,
        description: data.description || '',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        youtubeUrl: url,
        duration: '00:00' // YouTube oEmbed doesn't provide duration
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
        category: categoryFromUrl || '',
        subcategory: '',
        thumbnailUrl: '',
        duration: ''
      });
    } catch (error) {
      console.error('Upload error:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-2 text-sm font-medium text-primary-foreground w-full sm:w-auto"
        >
          <Youtube className="mr-2 h-4 w-4" />
          YouTube Video
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-muted px-8 py-2 text-sm font-medium text-muted-foreground w-full sm:w-auto"
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          Add URL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube URL Input */}
        <div>
          <label className="text-sm font-medium leading-none">
            YouTube Video URL
          </label>
          <div className="mt-2">
            <div className="relative">
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
              <Youtube className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
            </div>
          </div>
        )}

        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Enter tutorial title"
            required
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Enter tutorial description"
            required
          />
        </div>

        {/* Category Selection */}
        {!categoryFromUrl && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                const newCategory = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  category: newCategory,
                  subcategory: categories[newCategory]?.subcategories[0] || ''
                }));
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select a category</option>
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subcategory Selection */}
        {formData.category && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Subcategory
            </label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select a subcategory</option>
              {categories[formData.category]?.subcategories.map(subcategory => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.youtubeUrl}
          className={`w-full rounded-lg px-4 py-3 text-sm font-medium ${
            isLoading || !formData.youtubeUrl
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              {formData.thumbnailUrl ? 'Adding Tutorial...' : 'Fetching Video Data...'}
            </span>
          ) : (
            'Add Tutorial'
          )}
        </button>
      </form>
    </div>
  );
} 