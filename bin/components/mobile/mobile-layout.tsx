'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, Camera, Home,
  FileText, PlayCircle, Star, Settings
} from 'lucide-react';
import Link from 'next/link';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    }
  ];

  if (!mounted) {
    return null;
  }

  // Main Menu View
  if (pathname === '/') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="w-full bg-white shadow-sm">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold">PhotoPro</h1>
            </div>
          </div>
        </header>

        {/* Grid Layout */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {allButtons.map((button) => (
              <Link
                key={button.href}
                href={button.href}
                className={`flex flex-col items-center justify-center rounded-xl ${button.color} text-white p-6 hover:opacity-90 transition-all shadow-sm aspect-square`}
              >
                {button.icon}
                <span className="text-sm font-medium mt-2 text-center">
                  {button.name}
                </span>
              </Link>
            ))}
          </div>
        </main>

        {/* Navigation */}
        <nav className="w-full bg-white border-t py-2">
          <div className="flex justify-around items-center">
            <Link href="/" className="flex flex-col items-center p-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/documents" className="flex flex-col items-center p-2">
              <FileText className="h-6 w-6 text-gray-600" />
              <span className="text-xs mt-1">Docs</span>
            </Link>
            <Link href="/tutorials" className="flex flex-col items-center p-2">
              <PlayCircle className="h-6 w-6 text-gray-600" />
              <span className="text-xs mt-1">Tutorials</span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  // Content View
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-3 rounded-xl p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold truncate">
              {pathname.split('/').pop()?.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </h1>
          </div>
          <Link href="/" className="p-2 rounded-xl hover:bg-gray-100">
            <Home className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Navigation */}
      <nav className="w-full bg-white border-t py-2">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center p-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/documents" className="flex flex-col items-center p-2">
            <FileText className="h-6 w-6 text-gray-600" />
            <span className="text-xs mt-1">Docs</span>
          </Link>
          <Link href="/tutorials" className="flex flex-col items-center p-2">
            <PlayCircle className="h-6 w-6 text-gray-600" />
            <span className="text-xs mt-1">Tutorials</span>
          </Link>
        </div>
      </nav>
    </div>
  );
} 