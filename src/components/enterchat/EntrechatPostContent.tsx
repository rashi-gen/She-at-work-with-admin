/*eslint-disable @typescript-eslint/no-unused-vars */
/*eslint-disable  @typescript-eslint/no-explicit-any*/
// /app/components/EntrechatPostContent.tsx
'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';

interface EntrechatPostContentProps {
  content: string;
}

export default function EntrechatPostContent({ content }: EntrechatPostContentProps) {
  const [processedContent, setProcessedContent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (!content) return;

    const cleanWordPressContent = (rawContent: string): string => {
      try {
        // Remove WordPress block comments
        let cleaned = rawContent.replace(/<!-- \/?wp:[^>]+ -->/g, '');
        
        // Remove empty paragraph blocks
        cleaned = cleaned.replace(/<p><\/p>/g, '');
        
        // Convert WordPress shortcodes to proper links
        cleaned = cleaned.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g, 
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Handle YouTube embeds
        cleaned = cleaned.replace(
          /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/g,
          '<div class="aspect-video my-6"><iframe src="https://www.youtube.com/embed/$1" class="w-full h-full rounded-lg" frameborder="0" allowfullscreen></iframe></div>'
        );
        
        // Handle YouTube watch links
        cleaned = cleaned.replace(
          /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
          '<div class="aspect-video my-6"><iframe src="https://www.youtube.com/embed/$1" class="w-full h-full rounded-lg" frameborder="0" allowfullscreen></iframe></div>'
        );
        
        // Clean WordPress classes
        cleaned = cleaned.replace(/class="wp-block-[^"]*"/g, '');
        cleaned = cleaned.replace(/class="wp-block-list"/g, 'class="list-disc pl-6 my-4"');
        cleaned = cleaned.replace(/class="wp-block-heading"/g, '');
        cleaned = cleaned.replace(/class="wp-block-embed"/g, '');
        cleaned = cleaned.replace(/class="wp-block-embed__wrapper"/g, '');
        
        return DOMPurify.sanitize(cleaned, {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target', 'rel'],
        });
      } catch (error) {
        console.error('Error cleaning content:', error);
        return rawContent;
      }
    };

    const processQuotes = (html: string): string => {
      try {
        const quoteRegex = /<p>Quote[^<]*["']([^"']+)["']<\/p>/gi;
        return html.replace(quoteRegex, (match, quoteText) => {
          return `<blockquote class="border-l-4 border-pink-500 bg-pink-50 pl-4 py-2 my-4 italic text-gray-700">
            "${quoteText}"
          </blockquote>`;
        });
      } catch (error) {
        return html;
      }
    };

    const formatQA = (html: string): string => {
      try {
        // Convert numbered questions to styled headings
        let formatted = html.replace(
          /<p>(\d+\.\s+[^<]+)<\/p>/gi,
          '<h3 class="font-bold text-lg mt-6 mb-2 text-gray-900">$1</h3>'
        );
        
        // Style answers
        formatted = formatted.replace(
          /<p><strong>Ans\.?<\/strong>/gi,
          '<p class="ml-4 pl-4 border-l-2 border-gray-300 my-3"><span class="font-semibold text-pink-600">Ans:</span>'
        );
        
        // Style Q: format
        formatted = formatted.replace(
          /<p><strong>Q[^<]*<\/strong>/gi,
          '<h3 class="font-bold text-lg mt-6 mb-2 text-gray-900">'
        );
        
        return formatted;
      } catch (error) {
        return html;
      }
    };

    try {
      let processed = cleanWordPressContent(content);
      processed = processQuotes(processed);
      processed = formatQA(processed);
      
      const parsed = parse(processed, {
        replace: (node: any) => {
          if (!node || !node.name) return node;
          
          if (node.name === 'a' && node.attribs?.href) {
            if (!node.attribs.href.startsWith('/') && !node.attribs.href.startsWith('#')) {
              node.attribs.target = '_blank';
              node.attribs.rel = 'noopener noreferrer';
              node.attribs.class = 'text-primary hover:text-primary/80 underline underline-offset-2';
            }
          }
          
          if (node.name === 'ul') {
            node.attribs = node.attribs || {};
            node.attribs.class = 'list-disc pl-6 my-4 space-y-2';
          }
          
          if (node.name === 'ol') {
            node.attribs = node.attribs || {};
            node.attribs.class = 'list-decimal pl-6 my-4 space-y-2';
          }
          
          if (node.name === 'h1' || node.name === 'h2' || node.name === 'h3' || 
              node.name === 'h4' || node.name === 'h5' || node.name === 'h6') {
            node.attribs = node.attribs || {};
            node.attribs.class = `${node.attribs.class || ''} font-display font-bold text-foreground`.trim();
          }
          
          return node;
        }
      });
      
      setProcessedContent(parsed);
    } catch (error) {
      console.error('Error transforming content:', error);
      setProcessedContent(<p className="text-red-500">Error rendering content</p>);
    }
  }, [content]);

  if (!processedContent) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{processedContent}</>;
}