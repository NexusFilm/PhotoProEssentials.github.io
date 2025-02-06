'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Play, FileText } from 'lucide-react';
import Link from 'next/link';
import { useView } from '@/lib/view-context';
import * as db from '@/lib/db';

interface FeaturedContent {
  id: string;
  type: 'tutorial' | 'document';
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
  category: string;
}

export default function HomePage() {
  const { isAdminView, isMobilePreview } = useView();
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  async function loadFeaturedContent() {
    try {
      const featured = await db.getFeaturedContent();
      setFeaturedContent(featured);
    } catch (error) {
      console.error('Error loading featured content:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Mobile Layout
  if (isMobilePreview) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
        {/* Mobile Hero */}
        <section className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-primary/10 to-background">
          <h1 className="text-3xl font-bold mb-4">
            PhotoPro Essentials
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Your photography resource hub
          </p>
          <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
            <Link
              href="/categories/photography-contracts"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground"
            >
              Browse Templates
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tutorials/photography-basics"
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-medium"
            >
              Start Learning
              <Play className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Mobile Featured Content */}
        <section className="p-6 bg-background">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Featured</h2>
            {isAdminView && (
              <Link
                href="/admin/featured"
                className="text-sm text-muted-foreground"
              >
                Manage
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredContent.length > 0 ? (
            <div className="space-y-4">
              {featuredContent.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="flex flex-col rounded-lg border bg-card overflow-hidden"
                >
                  <div className="aspect-video relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 right-2">
                      {item.type === 'tutorial' ? (
                        <Play className="h-4 w-4 text-white" />
                      ) : (
                        <FileText className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No featured content yet.
                {isAdminView && ' Add some from the content pages.'}
              </p>
            </div>
          )}
        </section>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Welcome to PhotoPro Essentials
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your comprehensive resource for photography and videography templates, contracts, and tutorials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/categories/photography-contracts"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse Templates
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/tutorials/photography-basics"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-lg font-medium hover:bg-accent/90"
            >
              Start Learning
              <Play className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Content</h2>
            {isAdminView && (
              <Link
                href="/admin/featured"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Manage Featured Content
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContent.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {item.type === 'tutorial' ? (
                        <Play className="h-12 w-12 text-white" />
                      ) : (
                        <FileText className="h-12 w-12 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No featured content yet.
                {isAdminView && ' Add some from the content pages.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 