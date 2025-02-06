'use client';

import { useState } from 'react';
import { 
  ChevronLeft, Camera, Home,
  FileText, PlayCircle, Star, Settings
} from 'lucide-react';
import Link from 'next/link';
import { useView } from '@/lib/view-context';
import { useRouter, usePathname } from 'next/navigation';

interface AppButton {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdminView } = useView();

  const handleBack = () => {
    router.back();
  };

  // All buttons in a single array for the grid
  const allButtons = [
    // Documents (Blue)
    { 
      name: 'Photography', 
      href: '/categories/photography-contracts', 
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    { 
      name: 'Videography', 
      href: '/categories/videography-contracts', 
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    { 
      name: 'Agreements', 
      href: '/categories/client-agreements', 
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    { 
      name: 'Business', 
      href: '/categories/business-documents', 
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    // Tutorials (Purple)
    { 
      name: 'Photo Basics', 
      href: '/tutorials/photography-basics', 
      icon: <PlayCircle className="h-5 w-5" />,
      color: 'bg-purple-600'
    },
    { 
      name: 'Lighting', 
      href: '/tutorials/lighting-techniques', 
      icon: <PlayCircle className="h-5 w-5" />,
      color: 'bg-purple-600'
    },
    { 
      name: 'Editing', 
      href: '/tutorials/post-processing', 
      icon: <PlayCircle className="h-5 w-5" />,
      color: 'bg-purple-600'
    },
    { 
      name: 'Business', 
      href: '/tutorials/business-tips', 
      icon: <PlayCircle className="h-5 w-5" />,
      color: 'bg-purple-600'
    },
    // Features (Amber)
    { 
      name: 'Features', 
      href: '/features', 
      icon: <Star className="h-5 w-5" />,
      color: 'bg-amber-600'
    }
  ];

  // Main Menu View
  if (pathname === '/') {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <header className="w-full bg-white shadow-sm">
          <div className="flex h-12 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary">
                <Camera className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-base font-semibold">PhotoPro</h1>
            </div>
          </div>
        </header>

        {/* Grid Layout */}
        <main className="flex-1 p-2 overflow-hidden">
          <div className="grid grid-cols-3 gap-2 auto-rows-fr">
            {allButtons.map((button) => (
              <Link
                key={button.href}
                href={button.href}
                className={`flex flex-col items-center justify-center rounded-xl ${button.color} text-white hover:opacity-90 transition-all shadow-sm p-2`}
              >
                {button.icon}
                <span className="text-xs font-medium mt-1 text-center line-clamp-1">
                  {button.name}
                </span>
              </Link>
            ))}
          </div>
        </main>

        {/* Navigation */}
        <nav className="w-full bg-white border-t py-1 px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex flex-col items-center p-1">
              <Home className="h-5 w-5 text-primary" />
              <span className="text-[10px] mt-0.5">Home</span>
            </Link>
            <Link href="/documents" className="flex flex-col items-center p-1">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="text-[10px] mt-0.5">Docs</span>
            </Link>
            <Link href="/tutorials" className="flex flex-col items-center p-1">
              <PlayCircle className="h-5 w-5 text-gray-600" />
              <span className="text-[10px] mt-0.5">Tutorials</span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  // Content View
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-3 rounded-xl p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-base font-semibold truncate">
              {pathname.split('/').pop()?.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </h1>
          </div>
          <Link href="/" className="p-2 rounded-xl hover:bg-gray-100">
            <Home className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Navigation */}
      <nav className="w-full bg-white border-t py-1 px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center p-1">
            <Home className="h-5 w-5 text-primary" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>
          <Link href="/documents" className="flex flex-col items-center p-1">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="text-[10px] mt-0.5">Docs</span>
          </Link>
          <Link href="/tutorials" className="flex flex-col items-center p-1">
            <PlayCircle className="h-5 w-5 text-gray-600" />
            <span className="text-[10px] mt-0.5">Tutorials</span>
          </Link>
        </div>
      </nav>
    </div>
  );
} 