'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toolCategories } from '@/lib/utils';

// Simple icon components
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Auto-expand the category containing the current tool
  useEffect(() => {
    const currentTool = toolCategories.find(category => 
      category.tools.some(tool => tool.path === pathname)
    );
    
    if (currentTool) {
      // Option 1: Only show the active category (cleaner UX)
      setExpandedCategories([currentTool.name]);
      
      // Option 2: Keep all visited categories open (uncomment below and comment above)
      // setExpandedCategories(prev => 
      //   prev.includes(currentTool.name) ? prev : [...prev, currentTool.name]
      // );
    }
  }, [pathname]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 lg:w-72 xl:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DT</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">DevToolChest</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {toolCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.name);
              
              return (
                <div key={category.name}>
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 mr-2" />
                    )}
                    {category.name}
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.tools.map((tool) => (
                        <Link
                          key={tool.path}
                          href={tool.path}
                          onClick={onClose}
                          className={`
                            block px-3 py-2 text-sm rounded-md transition-colors
                            ${pathname === tool.path
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300'
                            }
                          `}
                        >
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {tool.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>100+ Free Developer Tools</p>
            <p className="mt-1">No tracking • No registration required</p>
          </div>
        </div>
      </div>
    </>
  );
}
