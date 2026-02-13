// /app/components/blog/BlogPostContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { BlogWordPressConverter } from '@/lib/blog-wordpress-converter';

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    if (!content) return;
    const converted = BlogWordPressConverter.convert(content);
    setProcessedContent(converted);
  }, [content]);

  if (!processedContent) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}