'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="flex flex-col h-full lg:ml-72 xl:ml-80">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page content */}
        <main className="flex-1 overflow-auto px-4 py-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer ad placeholder */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl h-16 bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Footer Ad Space (728x90)</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
