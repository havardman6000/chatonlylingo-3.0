// public/sdk/lingobabe-chat-sdk.js
(function(window) {
    'use strict';
  
    // Create LingobabeChat object
    window.LingobabeChat = window.LingobabeChat || {};
    
    // Base URL for embedded chats - change this to your domain in production
    const BASE_URL = window.location.origin + '/embed/chat';
    
    /**
     * Initialize a chat widget
     * @param {Object} options Configuration options
     */
    window.LingobabeChat.init = function(options) {
      // Default options
      const config = {
        container: 'lingobabe-chat',
        language: 'chinese',
        tutor: 'mei',
        height: 600,
        width: '100%',
        onReady: function() {},
        onMessage: function() {},
        onComplete: function() {},
        ...options
      };
      
      // Get container element
      const container = document.getElementById(config.container);
      if (!container) {
        console.error(`LingobabeChat: Container element with ID "${config.container}" not found`);
        return null;
      }
      
      // Set container styles
      container.style.width = typeof config.width === 'number' ? `${config.width}px` : config.width;
      container.style.height = typeof config.height === 'number' ? `${config.height}px` : config.height;
      container.style.overflow = 'hidden';
      container.style.borderRadius = '12px';
      
      // Create the iframe
      const iframe = document.createElement('iframe');
      iframe.src = `${BASE_URL}/${config.language}/${config.tutor}`;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.allow = 'microphone';
      
      // Append iframe to container
      container.innerHTML = '';
      container.appendChild(iframe);
      
      // Listen for messages from the iframe
      const messageHandler = function(event) {
        // Make sure message is from our iframe
        if (event.source !== iframe.contentWindow) return;
        
        const data = event.data;
        if (!data || !data.type) return;
        
        // Handle different message types
        switch (data.type) {
          case 'lingobabe-chat-ready':
            if (typeof config.onReady === 'function') {
              config.onReady(data);
            }
            break;
            
          case 'lingobabe-message-sent':
            if (typeof config.onMessage === 'function') {
              config.onMessage(data);
            }
            break;
            
          case 'lingobabe-chat-completed':
            if (typeof config.onComplete === 'function') {
              config.onComplete(data);
            }
            break;
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Return API
      return {
        changeTutor: function(tutor) {
          iframe.src = `${BASE_URL}/${config.language}/${tutor}`;
          config.tutor = tutor;
        },
        changeLanguage: function(language, tutor) {
          iframe.src = `${BASE_URL}/${language}/${tutor || config.tutor}`;
          config.language = language;
          if (tutor) config.tutor = tutor;
        },
        destroy: function() {
          window.removeEventListener('message', messageHandler);
          if (container.contains(iframe)) {
            container.removeChild(iframe);
          }
        }
      };
    };
  })(window);