// /app/components/EntrechatPostContent.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { WordPressContentConverter } from '@/lib/wordpress-converter';


interface EntrechatPostContentProps {
  content: string;
  title?: string;
}

export default function EntrechatPostContent({ content, title }: EntrechatPostContentProps) {
  const [processedContent, setProcessedContent] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content) return;
    
    // Convert WordPress content to clean HTML with title for context
    const converted = WordPressContentConverter.convert(content, title);
    setProcessedContent(converted);
    
    // Trigger animations after content is set
    setTimeout(() => setIsVisible(true), 100);
  }, [content, title]);

  if (!processedContent) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-amber-100 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={contentRef}
      className={`wordpress-content max-w-4xl mx-auto px-4 sm:px-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Add a decorative header for interviews */}
      <div className="interview-header mb-8 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#CF2554] to-[#3A3285] text-white text-sm font-medium mb-4">
          Entrepreneur Interview
        </div>
        <div className="interview-separator"></div>
      </div>
      
      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      
      {/* Add a decorative footer */}
      <div className="interview-footer mt-16 text-center">
        <div className="interview-separator"></div>
        <p className="text-sm mt-4 opacity-60">
          — Share this inspiring story —
        </p>
      </div>
    </div>
  );
}