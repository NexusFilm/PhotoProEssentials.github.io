import React from 'react';
import { Header } from '../components/layout/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { AuthProvider } from '../lib/auth-context';
import { ViewProvider } from '../lib/view-context';
import '../styles/globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ViewProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header>{children}</Header>
              <div className="flex-1 flex">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          </ViewProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 