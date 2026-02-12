/*eslint-disable  @typescript-eslint/no-explicit-any */
// app/components/EntrechatPost.tsx
'use client';

import parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { useRef } from 'react';

interface EntrechatPostProps {
  content: string;
  title: string;
  featuredImage?: string;
}

export default function EntrechatPost({ content, title, featuredImage }: EntrechatPostProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Add safety check for content
  if (!content) {
    return (
      <article className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        {featuredImage && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-6">
            <img 
              src={featuredImage} 
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <p className="text-gray-500">No content available</p>
      </article>
    );
  }

  // Clean WordPress block comments and shortcodes with null safety
  const cleanWordPressContent = (rawContent: string): string => {
    // Return empty string if content is undefined or null
    if (!rawContent) return '';
    
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
      
      // Clean WordPress classes but preserve semantic structure
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
      console.error('Error cleaning WordPress content:', error);
      return rawContent; // Return original content if cleaning fails
    }
  };

  // Process quotes and highlight them
  const processQuotes = (html: string): string => {
    if (!html) return '';
    
    try {
      const quoteRegex = /<p>Quote[^<]*["']([^"']+)["']<\/p>/gi;
      return html.replace(quoteRegex, (match, quoteText) => {
        return `<blockquote class="border-l-4 border-pink-500 bg-pink-50 pl-4 py-2 my-4 italic text-gray-700">
          "${quoteText}"
        </blockquote>`;
      });
    } catch (error) {
      console.error('Error processing quotes:', error);
      return html;
    }
  };

  // Structure Q&A format
  const formatQA = (html: string): string => {
    if (!html) return '';
    
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
      console.error('Error formatting Q&A:', error);
      return html;
    }
  };

  // Transform the content
  const transformedContent = () => {
    try {
      let processed = cleanWordPressContent(content);
      processed = processQuotes(processed);
      processed = formatQA(processed);
      
      return parse(processed, {
        replace: (node: any) => {
          // Skip if node is not valid
          if (!node || !node.name) return node;
          
          // Custom handling for specific elements
          if (node.name === 'a' && node.attribs?.href) {
            // Open external links in new tab
            if (!node.attribs.href.startsWith('/') && !node.attribs.href.startsWith('#')) {
              node.attribs.target = '_blank';
              node.attribs.rel = 'noopener noreferrer';
              node.attribs.class = 'text-pink-600 hover:text-pink-700 underline';
            }
          }
          
          // Style lists
          if (node.name === 'ul') {
            node.attribs = node.attribs || {};
            node.attribs.class = 'list-disc pl-6 my-4 space-y-2';
          }
          if (node.name === 'ol') {
            node.attribs = node.attribs || {};
            node.attribs.class = 'list-decimal pl-6 my-4 space-y-2';
          }
          
          // Style headings
          if (node.name === 'h1' || node.name === 'h2' || node.name === 'h3' || 
              node.name === 'h4' || node.name === 'h5' || node.name === 'h6') {
            node.attribs = node.attribs || {};
            node.attribs.class = `${node.attribs.class || ''} font-bold text-gray-900`.trim();
          }
          
          return node;
        }
      });
    } catch (error) {
      console.error('Error transforming content:', error);
      return <p className="text-red-500">Error rendering content</p>;
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title || 'Untitled'}
        </h1>
        
        {featuredImage && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-6">
            <img 
              src={featuredImage} 
              alt={title || 'Featured image'}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Hide image on error
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="prose prose-lg max-w-none
          prose-headings:font-semibold prose-headings:text-gray-900
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
          prose-ul:my-4 prose-ol:my-4
          prose-li:text-gray-700
          prose-img:rounded-lg prose-img:shadow-md"
      >
        {transformedContent()}
      </div>
    </article>
  );
}