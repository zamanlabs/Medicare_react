/**
 * responseFormatter.js
 * 
 * Utility for formatting and enhancing Gemini AI responses in the chat interface
 */

/**
 * Cleans up and enhances AI responses for better visual presentation
 * @param {string} text - The raw response text from Gemini AI
 * @returns {string} - The cleaned and formatted response
 */
export const formatAIResponse = (text) => {
  if (!text) return '';
  
  // Step 1: Remove unnecessary characters and formatting artifacts
  let formattedText = text
    // Remove excessive asterisks used for emphasis but keeping proper markdown
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    
    // Fix escaped characters
    .replace(/\\([`*_{}[\]()#+-.!])/g, '$1')
    
    // Clean up extra brackets that aren't part of a proper markdown link or code block
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\{\{([^}]+)\}\}/g, '$1')
    
    // Convert markdown-style links to HTML
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="ai-response-link" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Convert markdown-style code blocks to HTML
    .replace(/```([^`]*)```/g, '<pre class="ai-code-block"><code>$1</code></pre>')
    .replace(/`([^`]*)`/g, '<code class="ai-inline-code">$1</code>')
    
    // Convert markdown-style lists to HTML
    .replace(/^\s*-\s+(.+)$/gm, '<li class="ai-list-item">$1</li>')
    .replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ai-ordered-list-item">$1</li>')
    
    // Properly handle paragraph breaks
    .replace(/\n{2,}/g, '</p><p class="ai-paragraph">')
    
    // Handle line breaks within paragraphs
    .replace(/\n(?!\n)/g, '<br>');
  
  // Wrap with paragraph tags if not already wrapped
  if (!formattedText.startsWith('<p')) {
    formattedText = `<p class="ai-paragraph">${formattedText}</p>`;
  }
  
  // Fix any list items not properly wrapped in list elements
  formattedText = formattedText
    .replace(/<li class="ai-list-item">(.+?)<\/li>/g, function(match) {
      if (!match.includes('<ul') && !match.includes('</ul>')) {
        return '<ul class="ai-unordered-list">' + match + '</ul>';
      }
      return match;
    })
    .replace(/<li class="ai-ordered-list-item">(.+?)<\/li>/g, function(match) {
      if (!match.includes('<ol') && !match.includes('</ol>')) {
        return '<ol class="ai-ordered-list">' + match + '</ol>';
      }
      return match;
    })
    // Fix nested lists
    .replace(/<\/ul><ul class="ai-unordered-list">/g, '')
    .replace(/<\/ol><ol class="ai-ordered-list">/g, '');
  
  return formattedText;
};

/**
 * Creates animation CSS properties for text display
 * @param {number} index - The message index for staggered animations
 * @returns {Object} - Object with CSS animation properties
 */
export const getAnimationStyle = (index) => {
  return {
    animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s forwards`,
    opacity: 0
  };
};

/**
 * Detects if the response contains code and applies appropriate styling
 * @param {string} text - The raw text to check
 * @returns {boolean} - Whether the text contains code blocks
 */
export const containsCode = (text) => {
  return text.includes('```') || text.includes('`') || 
         text.includes('function') || text.includes('const ') || 
         text.includes('let ') || text.includes('var ');
};

/**
 * Adds syntax highlighting to code blocks if available
 * @param {string} text - The formatted text with code blocks
 * @returns {string} - Text with enhanced code blocks
 */
export const enhanceCodeBlocks = (text) => {
  // Check if text is already HTML formatted
  if (text.includes('<pre class="ai-code-block">')) {
    return text;
  }
  
  // Apply syntax highlighting rules
  return text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
    // Clean the language name
    const lang = language.trim().toLowerCase();
    
    // Format based on detected language
    if (lang === 'javascript' || lang === 'js') {
      // Highlight JavaScript syntax
      const highlighted = code
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(true|false|null|undefined|NaN)\b/g, '<span class="literal">$1</span>')
        .replace(/("[^"]*")|('[^']*')|(`[^`]*`)/g, '<span class="string">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
        .replace(/\/\/(.*)/g, '<span class="comment">//$1</span>')
        .replace(/\/\*([\s\S]*?)\*\//g, '<span class="comment">/*$1*/</span>');
      
      return `<pre class="ai-code-block language-javascript"><code>${highlighted}</code></pre>`;
    }
    
    // Default formatting for other languages
    return `<pre class="ai-code-block ${lang ? 'language-' + lang : ''}"><code>${code}</code></pre>`;
  });
};

export default {
  formatAIResponse,
  getAnimationStyle,
  containsCode,
  enhanceCodeBlocks
}; 