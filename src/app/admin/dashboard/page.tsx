'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { Camera, MessageSquare, Upload, Settings, ExternalLink, Brain } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your content and access tools
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/upload" className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Upload Content</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Add new templates or tutorials
          </p>
        </Link>

        <Link href="/admin/content" className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Manage Content</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit or remove existing content
          </p>
        </Link>

        <Link href="/admin/settings" className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Settings</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your account settings
          </p>
        </Link>
      </div>

      {/* AI Assistants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Research Tools</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mistral Chat */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Mistral Chat</h3>
              </div>
              <a
                href="https://huggingface.co/spaces/mistralai/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                Open in new tab
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="aspect-video">
              <iframe
                src="https://huggingface.co/spaces/mistralai/chat"
                className="w-full h-full"
                allow="microphone; camera"
              />
            </div>
          </div>

          {/* Llama Chat */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Llama 2</h3>
              </div>
              <a
                href="https://huggingface.co/spaces/ysharma/Explore_llamav2_with_TGI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                Open in new tab
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="aspect-video">
              <iframe
                src="https://huggingface.co/spaces/ysharma/Explore_llamav2_with_TGI"
                className="w-full h-full"
                allow="microphone; camera"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md bg-muted p-4 text-sm">
          <p className="font-medium">About these AI tools:</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• Free to use, no account required</li>
            <li>• Powered by state-of-the-art language models</li>
            <li>• Great for research, writing, and brainstorming</li>
            <li>• Multiple options to choose from based on your needs</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 