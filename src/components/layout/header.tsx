'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Upload, LogOut, Eye, EyeOff, Smartphone, X, Home, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { useView } from '../../lib/view-context';
import { usePathname } from 'next/navigation';
import { MobileLayout } from '../mobile/mobile-layout';
import type { DeviceType, Orientation } from '../../lib/view-context';

interface HeaderProps {
  children: React.ReactNode;
}

const deviceOptions: { value: DeviceType; label: string; dimensions: { portrait: { width: number; height: number }; landscape: { width: number; height: number } } }[] = [
  { value: 'iphone', label: 'iPhone', dimensions: { portrait: { width: 375, height: 812 }, landscape: { width: 812, height: 375 } } },
  { value: 'android', label: 'Android', dimensions: { portrait: { width: 360, height: 800 }, landscape: { width: 800, height: 360 } } },
  { value: 'tablet', label: 'Tablet', dimensions: { portrait: { width: 768, height: 1024 }, landscape: { width: 1024, height: 768 } } },
];

export function Header({ children }: HeaderProps) {
  const { signOut } = useAuth();
  const { isAdminView, isMobilePreview, deviceType, orientation, toggleView, toggleMobilePreview, setDeviceType, setOrientation } = useView();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  const selectedDevice = deviceOptions.find(device => device.value === deviceType) || deviceOptions[0];
  const dimensions = selectedDevice.dimensions[orientation];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
            : 'bg-background'
        }`}
      >
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-lg font-bold leading-none">PhotoPro</span>
                <span className="text-sm text-muted-foreground">Essentials</span>
              </div>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-4">
              {!isHomePage && !isAdminView && (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              )}

              {isAdminView && (
                <>
                  {!isHomePage && (
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  )}
                  <Link
                    href="/admin/dashboard"
                    className="group relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
                  >
                    Dashboard
                    <span className="absolute inset-x-0 -bottom-px h-px bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <Link
                    href="/admin/content"
                    className="group relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
                  >
                    Content
                    <span className="absolute inset-x-0 -bottom-px h-px bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Link>
                </>
              )}
              <button
                onClick={toggleMobilePreview}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isMobilePreview
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                title="Mobile Preview"
              >
                <Smartphone className="h-4 w-4" />
                Mobile View
              </button>
              <button
                onClick={toggleView}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                title={isAdminView ? "Switch to User View" : "Switch to Admin View"}
              >
                {isAdminView ? (
                  <>
                    <Eye className="h-4 w-4" />
                    User View
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Admin View
                  </>
                )}
              </button>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Preview Modal */}
      {isMobilePreview && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-lg border-l bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Mobile Preview</h2>
              <button
                onClick={toggleMobilePreview}
                className="rounded-full p-2 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Device Controls */}
            <div className="flex items-center gap-4 mb-6">
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deviceOptions.map((device) => (
                  <option key={device.value} value={device.value}>
                    {device.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9"
                title={`Switch to ${orientation === 'portrait' ? 'landscape' : 'portrait'} mode`}
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex justify-center">
              <div 
                className={`relative bg-background rounded-[3rem] border-8 border-muted shadow-2xl overflow-hidden transition-all duration-300`}
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                }}
              >
                {/* Phone Notch */}
                <div className={`absolute ${orientation === 'portrait' ? 'top-0 inset-x-0 h-6' : 'left-0 inset-y-0 w-6'} bg-muted rounded-b-3xl`} />
                
                {/* Phone Content */}
                <div className="h-full w-full overflow-y-auto">
                  <MobileLayout>
                    {children}
                  </MobileLayout>
                </div>
                
                {/* Home Indicator */}
                <div className={`absolute ${orientation === 'portrait' ? 'bottom-1 left-1/2 -translate-x-1/2 w-32 h-1' : 'right-1 top-1/2 -translate-y-1/2 h-32 w-1'} bg-muted rounded-full`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 