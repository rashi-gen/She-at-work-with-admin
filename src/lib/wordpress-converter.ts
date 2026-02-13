// /app/lib/wordpress-converter.ts
import DOMPurify from 'isomorphic-dompurify';

export interface WordPressPost {
  ID: string;
  post_title: string;
  post_content: string;
  post_date: string;
  post_excerpt: string;
  featured_image_url: string | null;
  section_name: string;
  post_name: string;
}

export class WordPressContentConverter {
  /**
   * Main method to convert WordPress content to clean HTML
   */
  static convert(content: string): string {
    if (!content) return '';

    try {
      // Step 1: Remove WordPress block comments
      let cleaned = this.removeBlockComments(content);

      // Step 2: Decode HTML entities early
      cleaned = this.decodeEntities(cleaned);

      // Step 3: Normalize line breaks and whitespace
      cleaned = this.normalizeWhitespace(cleaned);

      // Step 4: Handle WordPress embeds and bare URLs
      cleaned = this.handleEmbeds(cleaned);

      // Step 5: Clean WordPress-specific classes/styles
      cleaned = this.cleanWordPressClasses(cleaned);

      // Step 6: Detect content type and format accordingly
      cleaned = this.formatContent(cleaned);

      // Step 7: Clean spacing and empty tags
      cleaned = this.cleanSpacing(cleaned);

      // Step 8: Format lists
      cleaned = this.formatLists(cleaned);

      // Step 9: Format headings
      cleaned = this.formatHeadings(cleaned);

      // Step 10: Sanitize HTML
      cleaned = DOMPurify.sanitize(cleaned, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target', 'rel'],
      });

      return cleaned;
    } catch (error) {
      console.error('Error converting WordPress content:', error);
      return content;
    }
  }

  // ─────────────────────────────────────────────
  // STEP 1 – Remove WordPress block comments
  // ─────────────────────────────────────────────
  private static removeBlockComments(content: string): string {
    return content
      .replace(/<!-- \/?wp:[^\-]*?-->/g, '')
      .replace(/<!--.*?-->/g, '');
  }

  // ─────────────────────────────────────────────
  // STEP 2 – Decode HTML entities
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // STEP 3 – Normalize whitespace
  // ─────────────────────────────────────────────
  private static normalizeWhitespace(content: string): string {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  // ─────────────────────────────────────────────
  // STEP 4 – Handle embeds & bare URLs
  // ─────────────────────────────────────────────
  private static handleEmbeds(content: string): string {
    let processed = content;

    // YouTube youtu.be
    processed = processed.replace(
      /(?<!href=["'])https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)(?:[^\s<>"']*)/g,
      (_match, videoId) =>
        `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    );

    // YouTube watch?v=
    processed = processed.replace(
      /(?<!href=["'])https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(?:[^\s<>"']*)/g,
      (_match, videoId) =>
        `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    );

    // Wrap bare social/web URLs that are NOT already inside an <a> tag
    processed = processed.replace(
      /(?<!href=["'])(?<!src=["'])(https?:\/\/[^\s<>"'\)]+)/g,
      (match) =>
        `<a href="${match}" target="_blank" rel="noopener noreferrer" class="wordpress-link">${match}</a>`
    );

    // Wrap bare email addresses
    processed = processed.replace(
      /(?<!href=["'])([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g,
      (match) => `<a href="mailto:${match}" class="wordpress-link">${match}</a>`
    );

    return processed;
  }

  // ─────────────────────────────────────────────
  // STEP 5 – Strip WP classes & styles
  // ─────────────────────────────────────────────
  private static cleanWordPressClasses(content: string): string {
    let cleaned = content;
    cleaned = cleaned.replace(/\s*class="wp-block-[^"]*"/g, '');
    cleaned = cleaned.replace(/\s*class="has-[^"]*"/g, '');
    cleaned = cleaned.replace(/\s*class="align[^"]*"/g, '');
    cleaned = cleaned.replace(/\s*class="size-[^"]*"/g, '');
    cleaned = cleaned.replace(/\s*style="[^"]*"/g, '');
    return cleaned;
  }

  // ─────────────────────────────────────────────
  // STEP 6 – Smart content formatter
  //   Detects and handles ALL content patterns:
  //   (a) Prose intro + Q&A mixed
  //   (b) Pure Q&A with various Q/A markers
  //   (c) Pure prose / narrative
  //   (d) Standalone quotes
  // ─────────────────────────────────────────────
  private static formatContent(content: string): string {
    // First extract and process standalone HTML blocks (tables, figures, etc.)
    // Then work on the text content

    let out = content;

    // ── (i) Blockquotes already in <blockquote> tags ──
    out = out.replace(
      /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
      (_m, inner) =>
        `<figure class="wp-block-quote"><blockquote><p>${inner.replace(/<\/?p>/gi, '').trim()}</p></blockquote></figure>`
    );

    // ── (ii) Explicit <blockquote> or figure.wp-block-quote ──
    // already handled above

    // ── (iii) Process paragraph-level Q&A and prose ──
    out = this.processParagraphs(out);

    // ── (iv) Inline quote pattern: text ending with "quoted text" on its own line ──
    out = this.extractInlineQuotes(out);

    return out;
  }

  // ─────────────────────────────────────────────
  // Core paragraph processor – handles every known Q&A style
  // ─────────────────────────────────────────────
  private static processParagraphs(content: string): string {
    // Split into blocks (p tags, divs, or raw text separated by double newlines)
    // We'll work on the raw string with regex passes

    let out = content;

    // ── Pattern A: <p><strong>Q.</strong> or <p><strong>Q1.</strong> etc. ──
    // e.g. <p><strong>Q. How did you...</strong></p>
    out = out.replace(
      /<p[^>]*>\s*<strong>\s*Q(?:ues(?:tion)?)?\.?\s*\d*[.:)–\-]?\s*(.*?)<\/strong>\s*<\/p>/gi,
      (_m, q) => this.makeQuestion(q.trim())
    );

    // ── Pattern B: <p>Q. plain text (no strong tag) ──
    out = out.replace(
      /<p[^>]*>\s*Q(?:ues(?:tion)?)?\.?\s*\d*[.:)–\-]?\s+(.+?)<\/p>/gi,
      (_m, q) => this.makeQuestion(q.trim())
    );

    // ── Pattern C: <p><strong>1. Question text</strong></p> (numbered, bold) ──
    out = out.replace(
      /<p[^>]*>\s*<strong>\s*(\d+)[.)]\s+(.*?)<\/strong>\s*<\/p>/gi,
      (_m, num, q) => this.makeQuestion(`${num}. ${q.trim()}`)
    );

    // ── Pattern D: <p>1. Question text</p> (numbered plain) ──
    out = out.replace(
      /<p[^>]*>\s*(\d+)[.)]\s+([A-Z].{10,})\s*<\/p>/gi,
      (_m, num, q) => this.makeQuestion(`${num}. ${q.trim()}`)
    );

    // ── Pattern E: Ans. / Answer: / A. prefix ──
    out = out.replace(
      /<p[^>]*>\s*<strong>\s*A(?:ns(?:wer)?)?\.?\s*[:\-]?\s*<\/strong>\s*(.*?)<\/p>/gi,
      (_m, a) => this.makeAnswer(a.trim())
    );

    out = out.replace(
      /<p[^>]*>\s*A(?:ns(?:wer)?)?\.?\s*[:\-]\s+(.+?)<\/p>/gi,
      (_m, a) => this.makeAnswer(a.trim())
    );

    // ── Pattern F: Mixed inline Q and A in same paragraph
    //    e.g. "Q. How did...? It happened by chance..."
    //    This is the tricky prose+QA pattern from your sample
    out = this.splitInlineMixedQA(out);

    // ── Pattern G: Prose intro paragraph (no Q/A marker) → wrap in intro class ──
    // Already plain <p> tags — just ensure they're clean

    // ── Pattern H: Standalone "Quote –" or italicized quotes ──
    out = out.replace(
      /<p[^>]*>\s*["""]([^"""]{20,})["""]\s*<\/p>/gi,
      (_m, q) =>
        `<figure class="wp-block-quote"><blockquote><p>${q.trim()}</p></blockquote></figure>`
    );

    out = out.replace(
      /<p[^>]*>\s*<em>\s*["""]([^"""]{15,})["""]\s*<\/em>\s*<\/p>/gi,
      (_m, q) =>
        `<figure class="wp-block-quote"><blockquote><p>${q.trim()}</p></blockquote></figure>`
    );

    out = out.replace(
      /<p[^>]*>\s*Quote\s*[–\-—:]\s*["""]?(.+?)["""]?\s*<\/p>/gi,
      (_m, q) =>
        `<figure class="wp-block-quote"><blockquote><p>${q.trim()}</p></blockquote></figure>`
    );

    return out;
  }

  // ─────────────────────────────────────────────
  // Handle prose paragraphs that contain BOTH
  // a question AND its answer inline (no tags)
  // e.g.: "Q. How did you...? It happened by chance."
  // ─────────────────────────────────────────────
  private static splitInlineMixedQA(content: string): string {
    // Match paragraphs that start with Q. but are NOT already wrapped
    // and contain enough text to be question+answer
    return content.replace(
      /<p[^>]*>\s*(Q(?:ues(?:tion)?)?\.?\s*\d*[.:)–\-]?\s+[^<]{10,})\s*<\/p>/gi,
      (_m, text) => {
        // Try to split at the first sentence-ending punctuation followed by a capital letter
        // The question usually ends at ? or . followed by a new sentence
        const splitMatch = text.match(
          /^(Q(?:ues(?:tion)?)?\.?\s*\d*[.:)–\-]?\s+[\s\S]+?[?.])\s+([A-Z][\s\S]+)$/
        );

        if (splitMatch) {
          const questionPart = splitMatch[1].replace(/^Q(?:ues(?:tion)?)?\.?\s*\d*[.:)–\-]?\s+/i, '').trim();
          const answerPart = splitMatch[2].trim();
          return this.makeQuestion(questionPart) + this.makeAnswer(answerPart);
        }

        // If no clean split found, treat entire text as question
        const cleanQ = text.replace(/^Q(?:ues(?:tion)?)?\.?\s*\d*[.:)–\-]?\s+/i, '').trim();
        return this.makeQuestion(cleanQ);
      }
    );
  }

  // ─────────────────────────────────────────────
  // Extract inline quotes embedded in prose
  // e.g. She says, "I do not have any experience..."
  // ─────────────────────────────────────────────
  private static extractInlineQuotes(content: string): string {
    // Only extract if the quoted text is long enough to be meaningful (40+ chars)
    // and it's a standalone quote attribution pattern
    return content.replace(
      /<p[^>]*>([^<"]*(?:says?|shares?|explains?|points? out|states?|notes?)[^<"]*)["""]([^"""]{40,})["""]([^<]*)<\/p>/gi,
      (_m, before, quote, after) => {
        const cleanBefore = before.trim();
        const cleanAfter = after.trim();
        const attribution = (cleanBefore + ' ' + cleanAfter).trim();

        return `<p>${attribution}</p>
<figure class="wp-block-quote">
  <blockquote><p>${quote.trim()}</p></blockquote>
</figure>`;
      }
    );
  }

  // ─────────────────────────────────────────────
  // HTML builders
  // ─────────────────────────────────────────────
  private static makeQuestion(text: string): string {
    // Strip any remaining HTML tags inside the question text
    const clean = text.replace(/<[^>]+>/g, '').trim();
    return `
<div class="entrechat-question">
  <h3>${clean}</h3>
</div>`;
  }

  private static makeAnswer(text: string): string {
    const clean = text.trim();
    return `
<div class="entrechat-answer">
  <p>${clean}</p>
</div>`;
  }

  // ─────────────────────────────────────────────
  // STEP 7 – Clean spacing
  // ─────────────────────────────────────────────
  private static cleanSpacing(content: string): string {
    let cleaned = content;

    // Remove empty paragraphs
    cleaned = cleaned.replace(/<p[^>]*>\s*(&nbsp;)?\s*<\/p>/gi, '');

    // Collapse 3+ newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    return cleaned;
  }

  // ─────────────────────────────────────────────
  // STEP 8 – Format lists
  // ─────────────────────────────────────────────
  private static formatLists(content: string): string {
    let formatted = content;
    formatted = formatted.replace(/<ul[^>]*>/g, '<ul>');
    formatted = formatted.replace(/<ol[^>]*>/g, '<ol>');
    formatted = formatted.replace(/<li[^>]*>/g, '<li>');
    return formatted;
  }

  // ─────────────────────────────────────────────
  // STEP 9 – Format headings
  // ─────────────────────────────────────────────
  private static formatHeadings(content: string): string {
    let formatted = content;
    // Demote h1 → h2 (page title is h1)
    formatted = formatted.replace(/<h1[^>]*>/gi, '<h2>');
    formatted = formatted.replace(/<\/h1>/gi, '</h2>');
    // Strip classes from headings
    formatted = formatted.replace(/<(h[2-6])[^>]*>/gi, '<$1>');
    return formatted;
  }

  // ─────────────────────────────────────────────
  // Public utility methods (used by other components)
  // ─────────────────────────────────────────────

  static extractExcerpt(content: string, maxLength = 160): string {
    if (!content) return '';
    const text = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  }

  static extractInterviewee(title: string): string {
    if (!title) return 'Interviewee';
    return title
      .replace(/Entrechat\s+(?:With|with)\s+/i, '')
      .replace(/Entrechat\s*[–\-—]\s*/i, '')
      .replace(/^(Ms\.|Mr\.|Mrs\.|Dr\.|Prof\.)\s+/i, '')
      .replace(/&amp;/g, '&')
      .trim() || 'Interviewee';
  }

  static categorizePost(content: string, title: string): string {
    if (!content && !title) return 'Entrepreneurship';
    const text = `${title} ${content}`.toLowerCase();

    const categories = [
      { keywords: ['design', 'interior', 'architecture', 'fashion', 'home decor', 'art', 'madhubani', 'craft'], name: 'Design & Architecture' },
      { keywords: ['wellness', 'health', 'yoga', 'fitness', 'mental', 'meditation', 'graphology', 'healing', 'dental'], name: 'Wellness & Health' },
      { keywords: ['finance', 'funding', 'investment', 'wealth', 'money', 'banking', 'consulting', 'tax'], name: 'Funding & Finance' },
      { keywords: ['technology', 'tech', 'software', 'ai', 'digital', 'coding', 'vr', 'aviation', 'edtech'], name: 'Technology' },
      { keywords: ['leadership', 'management', 'hr', 'consulting', 'mentor', 'advocacy'], name: 'Leadership' },
      { keywords: ['education', 'edtech', 'learning', 'teaching', 'school', 'college', 'student'], name: 'Education' },
      { keywords: ['food', 'baking', 'culinary', 'restaurant', 'kitchen', 'cooking'], name: 'Food & Beverage' },
      { keywords: ['sports', 'tt', 'table tennis', 'badminton', 'athlete', 'fitness'], name: 'Sports' },
      { keywords: ['logistics', 'transport', 'cargo', 'supply chain', 'fleet'], name: 'Logistics' },
      { keywords: ['travel', 'tourism', 'boutique', 'itinerary', 'destinations', 'wanderer'], name: 'Travel & Tourism' },
      { keywords: ['social', 'ngo', 'foundation', 'nonprofit', 'disability', 'autism', 'empowerment'], name: 'Social Impact' },
    ];

    for (const category of categories) {
      if (category.keywords.some((kw) => text.includes(kw))) return category.name;
    }
    return 'Entrepreneurship';
  }

  static calculateReadTime(content: string): string {
    if (!content) return '1 min read';
    const text = content.replace(/<[^>]*>/g, ' ');
    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  }

  static formatDate(dateString: string): string {
    if (!dateString) return 'Date unavailable';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date unavailable';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Date unavailable';
    }
  }
}