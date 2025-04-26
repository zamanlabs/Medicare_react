/**
 * AI Response Enhancer Script
 * 
 * This script enhances the appearance of AI-generated responses in the ZenHealth Assistant.
 * It applies consistent formatting, cleans up the text, and improves readability.
 * 
 * To use, include this script in your application, and it will automatically enhance
 * all messages with the 'ai-response' class.
 */

import { formatAIResponse, enhanceCodeBlocks, containsCode } from '../utils/responseFormatter';

class AIResponseEnhancer {
  constructor() {
    // Configuration options
    this.config = {
      targetClass: 'ai-response',
      contentClass: 'ai-response-content',
      observerConfig: { childList: true, subtree: true },
      pollInterval: 500, // ms to check for new messages if MutationObserver is not supported
      maxRetries: 10
    };
    
    // Initialize variables
    this.observer = null;
    this.retryCount = 0;
    this.initialized = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.enhance = this.enhance.bind(this);
    this.handleMutation = this.handleMutation.bind(this);
    this.fallbackPolling = this.fallbackPolling.bind(this);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.init);
    } else {
      this.init();
    }
  }
  
  init() {
    if (this.initialized) return;
    
    console.log('Initializing AI Response Enhancer...');
    
    // Use MutationObserver if available
    if (window.MutationObserver) {
      this.observer = new MutationObserver(this.handleMutation);
      this.observer.observe(document.body, this.config.observerConfig);
      
      // Also process any existing messages
      this.enhance();
    } else {
      // Fallback for browsers without MutationObserver
      console.warn('MutationObserver not supported. Using polling as fallback.');
      this.fallbackPolling();
    }
    
    this.initialized = true;
  }
  
  handleMutation(mutations) {
    // Check if any of the mutations involve our target elements
    const shouldEnhance = mutations.some(mutation => {
      if (mutation.type === 'childList') {
        return Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return node.classList?.contains(this.config.targetClass) ||
                  node.querySelector(`.${this.config.targetClass}`);
          }
          return false;
        });
      }
      return false;
    });
    
    if (shouldEnhance) {
      this.enhance();
    }
  }
  
  enhance() {
    // Find all AI response messages
    const messages = document.querySelectorAll(`.${this.config.targetClass}`);
    
    if (messages.length === 0) {
      // If we don't find any messages yet, retry a few times
      if (this.retryCount < this.config.maxRetries) {
        this.retryCount++;
        setTimeout(this.enhance, this.config.pollInterval);
      }
      return;
    }
    
    this.retryCount = 0; // Reset retry counter
    
    // Process each message
    messages.forEach(message => {
      // Skip already processed messages
      if (message.dataset.enhanced === 'true') return;
      
      // Find the message text content
      const contentElement = message.querySelector(`.${this.config.contentClass}`);
      
      if (contentElement) {
        // If the message already has a formatted content element, leave it alone
        message.dataset.enhanced = 'true';
        return;
      }
      
      // If there's no content element but there's a text element, enhance it
      const textElement = Array.from(message.childNodes).find(node => 
        node.nodeType === Node.ELEMENT_NODE && 
        (node.tagName === 'P' || node.tagName === 'DIV' || node.tagName === 'SPAN') &&
        !node.classList.contains('ai-response-content') &&
        node.textContent.trim().length > 0
      );
      
      if (textElement) {
        const rawText = textElement.textContent;
        
        // Create a new element for the formatted content
        const formattedElement = document.createElement('div');
        formattedElement.className = this.config.contentClass;
        
        // Format the text
        let formattedHtml = formatAIResponse(rawText);
        
        // Enhance code blocks if present
        if (containsCode(rawText)) {
          formattedHtml = enhanceCodeBlocks(formattedHtml);
        }
        
        // Set the formatted content
        formattedElement.innerHTML = formattedHtml;
        
        // Replace the original text element with the formatted one
        textElement.parentNode.replaceChild(formattedElement, textElement);
        
        // Mark as enhanced
        message.dataset.enhanced = 'true';
      }
    });
  }
  
  fallbackPolling() {
    // Poll for changes as a fallback
    this.enhance();
    setTimeout(this.fallbackPolling, this.config.pollInterval);
  }
}

// Create and export the enhancer instance
const aiResponseEnhancer = new AIResponseEnhancer();

export default aiResponseEnhancer; 