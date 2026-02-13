// /app/lib/blog-wordpress-converter.ts
import DOMPurify from 'isomorphic-dompurify';

export class BlogWordPressConverter {
  /**
   * Main method to convert WordPress blog content to clean HTML
   */
  static convert(content: string): string {
    if (!content) return '';

    try {
      // Step 1: Remove WordPress block comments
      let cleaned = this.removeBlockComments(content);

      // Step 2: Decode HTML entities
      cleaned = this.decodeEntities(cleaned);

      // Step 3: Handle hashtags
      cleaned = this.formatHashtags(cleaned);

      // Step 4: Format resource/profile lists
      cleaned = this.formatResourceLists(cleaned);

      // Step 5: Format statistics and numbers
      cleaned = this.formatStatistics(cleaned);

      // Step 6: Handle embeds and links
      cleaned = this.handleEmbeds(cleaned);

      // Step 7: Format section headers
      cleaned = this.formatSectionHeaders(cleaned);

      // Step 8: Format quotes and testimonials
      cleaned = this.formatQuotes(cleaned);

      // Step 9: Clean WordPress classes
      cleaned = this.cleanWordPressClasses(cleaned);

      // Step 10: Format lists properly
      cleaned = this.formatLists(cleaned);

      // Step 11: Format paragraphs
      cleaned = this.formatParagraphs(cleaned);

      // Step 12: Final cleanup
      cleaned = this.finalCleanup(cleaned);

      // Step 13: Sanitize HTML
      cleaned = DOMPurify.sanitize(cleaned, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target', 'rel'],
      });

      return cleaned;
    } catch (error) {
      console.error('Error converting WordPress blog content:', error);
      return content;
    }
  }

  /**
   * Remove WordPress block comments
   */
  private static removeBlockComments(content: string): string {
    return content
      .replace(/<!-- \/?wp:[^\-]*?-->/g, '')
      .replace(/<!--.*?-->/g, '')
      .replace(/\[\/?[a-z_]+\]/g, '');
  }

  /**
   * Decode HTML entities
   */
  private static decodeEntities(content: string): string {
    return content
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8217;/g, '\u2019')
      .replace(/&#8216;/g, '\u2018')
      .replace(/&#8220;/g, '\u201C')
      .replace(/&#8221;/g, '\u201D')
      .replace(/&#8211;/g, '\u2013')
      .replace(/&#8212;/g, '\u2014')
      .replace(/&#038;/g, '&')
      .replace(/&hellip;/g, '…');
  }

  /**
   * Format hashtags - style them nicely
   */
  private static formatHashtags(content: string): string {
    let formatted = content;

    // Extract hashtag paragraphs and style them
    formatted = formatted.replace(
      /<p[^>]*>(\s*#[A-Za-z0-9#]+\s*(?:#[A-Za-z0-9#]+\s*)*)<\/p>/gi,
      (match, hashtags) => {
        const formattedHashtags = hashtags
          .trim()
          .split(/\s+/)
          .map((tag: string) => `<span class="blog-hashtag">${tag}</span>`)
          .join(' ');
        
        return `<div class="blog-hashtag-container">${formattedHashtags}</div>`;
      }
    );

    return formatted;
  }

  /**
   * Format resource/profile lists with bold titles
   * e.g. "- Mariama Sarge, Co-founder, MESE Energy Solutions"
   */
  private static formatResourceLists(content: string): string {
    let formatted = content;

    // Find list items with bold or strong tags that look like entrepreneur profiles
    formatted = formatted.replace(
      /<li[^>]*>\s*<strong>(.*?)<\/strong>(.*?)<\/li>/gi,
      (match, boldText, restText) => {
        return `<li class="blog-resource-item">
          <span class="blog-resource-title">${boldText}</span>${restText}
        </li>`;
      }
    );

    // Format numbered resource lists
    formatted = formatted.replace(
      /<li[^>]*>\s*(\d+\.)\s*<strong>(.*?)<\/strong>(.*?)<\/li>/gi,
      (match, number, boldText, restText) => {
        return `<li class="blog-resource-item blog-numbered-item">
          <span class="blog-resource-number">${number}</span>
          <span class="blog-resource-title">${boldText}</span>${restText}
        </li>`;
      }
    );

    // Format bullet points with just bold text
    formatted = formatted.replace(
      /<p[^>]*>\s*[•●]\s*<strong>(.*?)<\/strong>(.*?)<\/p>/gi,
      (match, boldText, restText) => {
        return `<div class="blog-resource-inline">
          <span class="blog-resource-title">${boldText}</span>${restText}
        </div>`;
      }
    );

    return formatted;
  }

  /**
   * Format statistics and numbers to make them stand out
   */
  private static formatStatistics(content: string): string {
    let formatted = content;

    // Format percentages
    formatted = formatted.replace(
      /(\d+(?:\.\d+)?%)/g,
      '<span class="blog-stat">$1</span>'
    );

    // Format currency amounts (D36 million, $42 billion, etc.)
    formatted = formatted.replace(
      /([A-Z]?[$€£]\d+(?:[.,]\d+)?(?:\s*(?:million|billion|thousand|trillion))?)/gi,
      '<span class="blog-currency">$1</span>'
    );

    // Format large numbers
    formatted = formatted.replace(
      /\b(\d{4,}(?:[.,]\d+)?)\b/g,
      (match) => {
        // Don't format years
        if (match.length === 4 && parseInt(match) > 1900 && parseInt(match) < 2100) {
          return match;
        }
        return `<span class="blog-number">${match}</span>`;
      }
    );

    return formatted;
  }

  /**
   * Handle embeds and links
   */
  private static handleEmbeds(content: string): string {
    let processed = content;

    // YouTube embeds
    processed = processed.replace(
      /https:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/g,
      (match, videoId) => {
        return `<div class="blog-video-container">
          <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        </div>`;
      }
    );

    processed = processed.replace(
      /https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
      (match, videoId) => {
        return `<div class="blog-video-container">
          <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        </div>`;
      }
    );

    // Style links based on type
    processed = processed.replace(
      /<a href="(https:\/\/[^"]+\.(pdf|doc|docx|xls|xlsx))">(.*?)<\/a>/gi,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="blog-link blog-document-link">📄 $3</a>'
    );

    processed = processed.replace(
      /<a href="(https:\/\/(?:www\.)?(facebook|twitter|linkedin|instagram)\.[^"]+)">(.*?)<\/a>/gi,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="blog-link blog-social-link">🌐 $3</a>'
    );

    processed = processed.replace(
      /<a href="([^"]+\.gov[^"]*|[^"]+\.org[^"]*)">(.*?)<\/a>/gi,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="blog-link blog-official-link">🏛️ $2</a>'
    );

    // Default link styling
    processed = processed.replace(
      /<a href="([^"]+)">(.*?)<\/a>/gi,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="blog-link">$2</a>'
    );

    return processed;
  }

  /**
   * Format section headers (In Focus:, On Stage:, etc.)
   */
  private static formatSectionHeaders(content: string): string {
    let formatted = content;

    // Format "In Focus:" headers
    formatted = formatted.replace(
      /<p[^>]*>\s*<strong>\s*In Focus:\s*([^<]+)<\/strong>\s*<\/p>/gi,
      '<div class="blog-section-header"><span class="blog-section-tag">IN FOCUS</span><h2>$1</h2></div>'
    );

    // Format "On Stage:" headers
    formatted = formatted.replace(
      /<p[^>]*>\s*<strong>\s*On Stage:\s*([^<]+)<\/strong>\s*<\/p>/gi,
      '<div class="blog-section-header"><span class="blog-section-tag">ON STAGE</span><h2>$1</h2></div>'
    );

    // Format "In the Limelight:" headers
    formatted = formatted.replace(
      /<p[^>]*>\s*<strong>\s*In the Limelight:\s*([^<]+)<\/strong>\s*<\/p>/gi,
      '<div class="blog-section-header"><span class="blog-section-tag">IN THE LIMELIGHT</span><h2>$1</h2></div>'
    );

    // Format country/profile headers
    formatted = formatted.replace(
      /<p[^>]*>\s*<strong>\s*([A-Z][A-Z\s]+):\s*<\/strong>\s*([^<]+)<\/p>/gi,
      (match, tag, title) => {
        return `<div class="blog-section-header">
          <span class="blog-section-tag">${tag.replace(/\s+/g, ' ').trim()}</span>
          <h3>${title}</h3>
        </div>`;
      }
    );

    return formatted;
  }

  /**
   * Format quotes
   */
  private static formatQuotes(content: string): string {
    let formatted = content;

    formatted = formatted.replace(
      /<p[^>]*>\s*["""]([^"""]+)["""]\s*<\/p>/gi,
      (match, quote) => {
        return `<figure class="blog-quote">
          <blockquote>${quote.trim()}</blockquote>
        </figure>`;
      }
    );

    formatted = formatted.replace(
      /<p[^>]*>\s*<em>\s*["""]([^"""]+)["""]\s*<\/em>\s*<\/p>/gi,
      (match, quote) => {
        return `<figure class="blog-quote">
          <blockquote>${quote.trim()}</blockquote>
        </figure>`;
      }
    );

    return formatted;
  }

  /**
   * Clean WordPress-specific classes
   */
  private static cleanWordPressClasses(content: string): string {
    let cleaned = content;

    cleaned = cleaned.replace(/\s*class="wp-block-[^"]*"/g, '');
    cleaned = cleaned.replace(/\s*class="has-[^"]*"/g, '');
    cleaned = cleaned.replace(/\s*class="align[^"]*"/g, '');
    cleaned = cleaned.replace(/\s*class="size-[^"]*"/g, '');
    cleaned = cleaned.replace(/\s*style="[^"]*"/g, '');
    cleaned = cleaned.replace(/<figure[^>]*>/g, '<figure>');
    cleaned = cleaned.replace(/<figcaption[^>]*>/g, '<figcaption>');

    return cleaned;
  }

  /**
   * Format lists
   */
  private static formatLists(content: string): string {
    let formatted = content;

    formatted = formatted.replace(/<ul[^>]*>/g, '<ul class="blog-list">');
    formatted = formatted.replace(/<ol[^>]*>/g, '<ol class="blog-list blog-list-numbered">');
    formatted = formatted.replace(/<li[^>]*>/g, '<li>');

    return formatted;
  }

  /**
   * Format paragraphs
   */
  private static formatParagraphs(content: string): string {
    let formatted = content;

    // Add class to regular paragraphs
    formatted = formatted.replace(
      /<p>(?!\s*<)(.*?)<\/p>/g,
      (match, content) => {
        // Skip if it's already been processed
        if (match.includes('blog-')) return match;
        return `<p class="blog-paragraph">${content}</p>`;
      }
    );

    // Remove empty paragraphs
    formatted = formatted.replace(/<p[^>]*>\s*<\/p>/g, '');

    return formatted;
  }

  /**
   * Final cleanup
   */
  private static finalCleanup(content: string): string {
    let cleaned = content;

    // Remove multiple consecutive newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // Ensure proper spacing around headings
    cleaned = cleaned.replace(/(<\/h[1-6]>)/g, '$1\n');
    cleaned = cleaned.replace(/(<\/div>)/g, '$1\n');
    cleaned = cleaned.replace(/(<\/figure>)/g, '$1\n');

    return cleaned;
  }

  /**
   * Extract excerpt from blog content
   */
  static extractExcerpt(content: string, maxLength: number = 160): string {
    if (!content) return '';
    
    const text = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/#[A-Za-z0-9#]+\s*/g, '') // Remove hashtags
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  }

  /**
   * Extract author from blog content
   */
  static extractAuthor(content: string): string {
    const authorMatch = content.match(/by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i) || 
                       content.match(/Written by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
    return authorMatch ? authorMatch[1] : "She at Work";
  }

  /**
   * Calculate reading time
   */
  static calculateReadTime(content: string): string {
    if (!content) return '1 min read';
    
    const text = content.replace(/<[^>]*>/g, ' ');
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  }

  /**
   * Format date
   */
  static formatDate(dateString: string): string {
    if (!dateString) return 'Date unavailable';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date unavailable';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date unavailable';
    }
  }
}