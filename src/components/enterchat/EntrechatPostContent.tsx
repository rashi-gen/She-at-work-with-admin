
'use client';

import { useEffect, useState, useRef } from 'react';
import { WordPressContentConverter } from '@/lib/wordpress-converter';

interface EntrechatPostContentProps {
  content: string;
}

export default function EntrechatPostContent({ content }: EntrechatPostContentProps) {
  const [processedContent, setProcessedContent] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content) return;
    
    // Convert WordPress content to clean HTML
    const converted = WordPressContentConverter.convert(content);
    setProcessedContent(converted);
  }, [content]);

  if (!processedContent) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-primary/5 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={contentRef}
      className="wordpress-content"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}