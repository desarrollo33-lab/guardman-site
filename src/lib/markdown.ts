import { marked } from 'marked';

/**
 * Convert Markdown string to safe HTML.
 * Strips H1 (pages have their own <h1>).
 */
export function mdToHtml(markdown: string): string {
  if (!markdown) return '';
  
  // Strip H1 — pages already provide their own
  const noH1 = markdown.replace(/^# .+$/gm, '');
  
  return marked.parse(noH1, { async: false }) as string;
}

/**
 * Extract first paragraph from Markdown as plain text (for hero/og).
 * Handles both real newlines and escaped \n\n.
 */
export function mdToPlainText(markdown: string, maxLen = 300): string {
  if (!markdown) return '';
  
  // Normalize escaped newlines
  const normalized = markdown
    .replace(/\\n/g, '\n');
  
  // Remove markdown formatting
  const plain = normalized
    .replace(/^#{1,6}\s+.+$/gm, '')     // headers
    .replace(/\*\*(.+?)\*\*/g, '$1')     // bold
    .replace(/\*(.+?)\*/g, '$1')         // italic
    .replace(/__(.+?)__/g, '$1')         // bold underscore
    .replace(/_(.+?)_/g, '$1')           // italic underscore
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')  // links
    .replace(/`(.+?)`/g, '$1')           // inline code
    .replace(/^[-*+]\s+/gm, '')          // unordered list markers
    .replace(/^\d+\.\s+/gm, '')          // ordered list markers
    .replace(/\n{2,}/g, '\n')            // multiple newlines
    .trim();
  
  // Get first meaningful paragraph
  const paragraphs = plain.split('\n').filter(p => p.trim().length > 20);
  const text = paragraphs[0] || plain;
  
  return text.length > maxLen ? text.slice(0, maxLen).trim() + '...' : text;
}
