/**
 * ADT Overlay Demo Helper - Enhanced with Sequence Mode & Interaction Blocking
 * Version: 1.2.3
 * 
 * Key Features:
 * - Pin/unpin events
 * - Open/close events
 * - Sequence mode with auto-play
 * - Interaction blocking for demo mode
 * - Auto-scroll control
 */
(function() {
  "use strict";
  
  let initialized = false;
  let initTimer = null;
  
  window.OverlayDemoHelper = {
    
    /**
     * Pin a single event in an iframe
     */
    pin: function(iframeSelector, eventName) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      // console.log(`[OverlayDemoHelper] Sending pin message for: ${eventName} to ${iframeSelector}`);
      
      iframe.contentWindow.postMessage({
        action: 'adtPinEvent',
        eventName: eventName
      }, '*');
      
      // console.log(`[OverlayDemoHelper] Pin message sent for: ${eventName}`);
      return true;
    },
    
    /**
     * Pin multiple events at once
     */
    pinMultiple: function(iframeSelector, eventNames) {
      const events = Array.isArray(eventNames) ? eventNames : [eventNames];
      let success = true;
      
      events.forEach(name => {
        if (!this.pin(iframeSelector, name)) success = false;
      });
      
      return success;
    },
    
    /**
     * Pin all events in a group (by CSS class)
     */
    pinGroup: function(iframeSelector, groupClass) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtPinGroup',
        eventGroup: groupClass
      }, '*');
      
      return true;
    },
    
    /**
     * Unpin all events in an iframe
     */
    unpinAll: function(iframeSelector) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtUnpinAll'
      }, '*');
      
      return true;
    },
    
    /**
     * Open an event without pinning it
     * Expands the JSON in the main scrolling list
     */
    open: function(iframeSelector, eventName) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtOpenEvent',
        eventName: eventName
      }, '*');
      
      return true;
    },
    
    /**
     * Open multiple events without pinning
     */
    openMultiple: function(iframeSelector, eventNames) {
      const events = Array.isArray(eventNames) ? eventNames : [eventNames];
      let success = true;
      
      events.forEach(name => {
        if (!this.open(iframeSelector, name)) success = false;
      });
      
      return success;
    },
    
    /**
     * Open all events in a group without pinning
     */
    openGroup: function(iframeSelector, groupClass) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtOpenGroup',
        eventGroup: groupClass
      }, '*');
      
      return true;
    },
    
    /**
     * Close all opened events (doesn't affect pinned)
     */
    closeAll: function(iframeSelector) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtCloseAll'
      }, '*');
      
      return true;
    },
    
    /**
     * Disable all user interactions with the overlay
     * Perfect for automated demos and sequences
     */
    disableInteraction: function(iframeSelector) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtDisableInteraction'
      }, '*');
      
      // console.log('[OverlayDemoHelper] ✓ Interactions disabled');
      return true;
    },
    
    /**
     * Re-enable user interactions with the overlay
     */
    enableInteraction: function(iframeSelector) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtEnableInteraction'
      }, '*');
      
      // console.log('[OverlayDemoHelper] ✓ Interactions enabled');
      return true;
    },
    
    /**
     * Pause auto-scroll
     */
    pauseAutoScroll: function(iframeSelector) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtPauseAutoScroll'
      }, '*');
      
      return true;
    },
    
    /**
     * Resume auto-scroll
     */
    resumeAutoScroll: function(iframeSelector) {
      const iframe = document.querySelector(iframeSelector);
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return false;
      }
      
      iframe.contentWindow.postMessage({
        action: 'adtResumeAutoScroll'
      }, '*');
      
      return true;
    },
    
    /**
     * Apply configuration object to all iframes
     * Supports: pinEvents, openEvents, pinGroup, openGroup
     */
    applyConfig: function(config) {
      if (!config) {
        console.warn('[OverlayDemoHelper] No config provided');
        return;
      }
      
      // console.log('[OverlayDemoHelper] Applying configuration...');
      let applied = 0;
      
      Object.keys(config).forEach(selector => {
        const iframe = document.querySelector(selector);
        if (!iframe) {
          return;
        }
        
        const cfg = config[selector];
        
        // Open specific events without pinning (FIRST)
        if (cfg.openEvents) {
          this.openMultiple(selector, cfg.openEvents);
          applied++;
        }
        
        // Open group without pinning (FIRST)
        if (cfg.openGroup) {
          this.openGroup(selector, cfg.openGroup);
          applied++;
        }
        
        // Pin specific events (AFTER opening)
        if (cfg.pinEvents) {
          this.pinMultiple(selector, cfg.pinEvents);
          applied++;
        }
        
        // Pin by group (AFTER opening)
        if (cfg.pinGroup) {
          this.pinGroup(selector, cfg.pinGroup);
          applied++;
        }
      });
    },

    /**
     * Sequence/Demo Mode - v1.2.3
     * Automatically scroll through and highlight events
     * 
     * Options:
     * - duration: Time each event stays visible (ms, default: 5000)
     * - loop: Loop back to start when done (default: false)
     * - disableInteraction: Disable clicks/interactions during sequence (default: false)
     * - pauseAutoScroll: Pause auto-scroll during sequence (default: true)
     * - pinInSequence: Pin events instead of opening them (default: false)
     * - scrollBehavior: 'smooth' or 'auto' (default: 'smooth')
     * - onEventChange: Callback when event changes (eventName, index, total)
     * - onComplete: Callback when sequence finishes
     */
    sequence: function(iframeSelector, eventNames, options = {}) {
      const defaults = {
        duration: 5000,           // Time each event stays open (ms)
        scrollBehavior: 'smooth', // 'smooth' or 'auto'
        loop: false,              // Loop back to start when done
        disableInteraction: false, // Disable clicks/interactions in iframe
        pauseAutoScroll: true,    // Pause auto-scroll during sequence
        pinInSequence: false,     // Pin events instead of opening (allows scroll to continue)
        onEventChange: null,      // Callback when event changes
        onComplete: null          // Callback when sequence finishes
      };
  
      const settings = { ...defaults, ...options };
      const iframe = document.querySelector(iframeSelector);
  
      if (!iframe?.contentWindow) {
        console.warn('[OverlayDemoHelper] Iframe not found:', iframeSelector);
        return null;
      }
  
      const events = Array.isArray(eventNames) ? eventNames : [eventNames];
      let currentIndex = 0;
      let intervalId = null;
      let isRunning = false;
  
      const controller = {
        start: function() {
          if (isRunning) {
            console.warn('[OverlayDemoHelper] Sequence already running');
            return;
          }
      
          isRunning = true;
          // console.log(`[OverlayDemoHelper] Starting sequence with ${events.length} events`);
      
          // Pause auto-scroll if enabled (unless using pin mode which allows scroll)
          if (settings.pauseAutoScroll && !settings.pinInSequence) {
            OverlayDemoHelper.pauseAutoScroll(iframeSelector);
          }
      
          // Disable interaction if enabled
          if (settings.disableInteraction) {
            OverlayDemoHelper.disableInteraction(iframeSelector);
          }
      
          // Show first event immediately
          this.showEvent(0);
      
          // Set up interval for subsequent events
          intervalId = setInterval(() => {
            currentIndex++;
        
            if (currentIndex >= events.length) {
              if (settings.loop) {
                currentIndex = 0;
              } else {
                this.stop();
                if (settings.onComplete) settings.onComplete();
                return;
              }
            }
        
            this.showEvent(currentIndex);
          }, settings.duration);
        },
    
        stop: function() {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          isRunning = false;
      
          // Unpin all if using pin mode (do this FIRST)
          if (settings.pinInSequence) {
            OverlayDemoHelper.unpinAll(iframeSelector);
          }
      
          // Resume auto-scroll (only if it was paused)
          if (settings.pauseAutoScroll && !settings.pinInSequence) {
            OverlayDemoHelper.resumeAutoScroll(iframeSelector);
          }
      
          // Re-enable interaction
          if (settings.disableInteraction) {
            OverlayDemoHelper.enableInteraction(iframeSelector);
          }
      
          // console.log('[OverlayDemoHelper] Sequence stopped');
        },
    
        pause: function() {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            isRunning = false;
            // console.log('[OverlayDemoHelper] Sequence paused');
          }
        },
    
        resume: function() {
          if (!isRunning && currentIndex < events.length) {
            this.start();
          }
        },
    
        next: function() {
          this.pause();
          currentIndex = Math.min(currentIndex + 1, events.length - 1);
          this.showEvent(currentIndex);
        },
    
        previous: function() {
          this.pause();
          currentIndex = Math.max(currentIndex - 1, 0);
          this.showEvent(currentIndex);
        },
    
        goTo: function(index) {
          this.pause();
          currentIndex = Math.max(0, Math.min(index, events.length - 1));
          this.showEvent(currentIndex);
        },
    
        showEvent: function(index) {
          const eventName = events[index];
          
          // console.log(`[OverlayDemoHelper] showEvent called - Index: ${index}, Event: ${eventName}, pinInSequence: ${settings.pinInSequence}`);
  
          if (settings.pinInSequence) {
            // console.log('[OverlayDemoHelper] Pin mode active - unpinning all first...');
            // Pin mode: Unpin all previous, then pin the new event
            OverlayDemoHelper.unpinAll(iframeSelector);
            
            // INCREASED delay to ensure unpin completes and DOM stabilizes
            setTimeout(() => {
              // console.log(`[OverlayDemoHelper] Now pinning event: ${eventName}`);
              OverlayDemoHelper.pin(iframeSelector, eventName);
      
              // Smooth scroll to the event in the main list (after another delay)
              setTimeout(() => {
                // console.log(`[OverlayDemoHelper] Scrolling to event: ${eventName}`);
                iframe.contentWindow.postMessage({
                  action: 'adtScrollToEvent',
                  eventName: eventName,
                  scrollBehavior: 'smooth'
                }, '*');
              }, 150);
            }, 300);
          } else {
            // console.log('[OverlayDemoHelper] Open mode active - closing all first...');
            // Open mode: Close previous, scroll, and open (original behavior)
            OverlayDemoHelper.closeAll(iframeSelector);
    
            iframe.contentWindow.postMessage({
              action: 'adtScrollAndOpenEvent',
              eventName: eventName,
              scrollBehavior: 'auto',
              openDelay: 300
            }, '*');
          }
  
          // console.log(`[OverlayDemoHelper] Showing event ${index + 1}/${events.length}: ${eventName}`);
  
          // Trigger callback
          if (settings.onEventChange) {
            settings.onEventChange(eventName, index, events.length);
          }
        },
    
        isRunning: function() {
          return isRunning;
        },
    
        getCurrentIndex: function() {
          return currentIndex;
        },
    
        getEvents: function() {
          return [...events];
        }
      };
  
      return controller;
    },
    
    /**
     * Initialize with retry logic
     */
    init: function(delay = 1500, maxRetries = 3) {
      if (initialized) {
        // console.log('[OverlayDemoHelper] Already initialized');
        return;
      }
      
      // console.log(`[OverlayDemoHelper] Initializing with ${delay}ms delay...`);
      
      // Clear any existing timer
      if (initTimer) clearTimeout(initTimer);
      
      let attempts = 0;
      const tryInit = () => {
        attempts++;
        // console.log(`[OverlayDemoHelper] Initialization attempt ${attempts}/${maxRetries}`);
        
        if (window.overlayDemoConfig) {
          this.applyConfig(window.overlayDemoConfig);
          initialized = true;
        } else if (attempts < maxRetries) {
          // console.log('[OverlayDemoHelper] Config not ready, retrying in 500ms...');
          initTimer = setTimeout(tryInit, 500);
        } else {
          // console.log('[OverlayDemoHelper] ✓ Ready (no config found after retries)');
          initialized = true;
        }
      };
      
      initTimer = setTimeout(tryInit, delay);
    }
  };
  
  // Auto-initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      OverlayDemoHelper.init();
    });
  } else {
    // DOM already loaded
    OverlayDemoHelper.init();
  }
  
  // Also try on window load as backup
  window.addEventListener('load', function() {
    if (!initialized) {
      // console.log('[OverlayDemoHelper] Triggering backup initialization on window.load');
      OverlayDemoHelper.init(500);
    }
  });
  
})();