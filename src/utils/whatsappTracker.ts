import { saveWhatsAppClick } from '../firebase/dbServices';
import { getWhatsAppLink, WhatsAppLinkOptions } from '../config/whatsapp';

const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export interface TrackClickOptions extends WhatsAppLinkOptions {
  buttonLocation: string;
  pagePath?: string;
  contextDetails?: string;
  customUrl?: string;
}

/**
 * Explicit helper to record click events and return target URL
 */
export const trackAndOpenWhatsApp = (options: TrackClickOptions): string => {
  const targetUrl = options.customUrl || getWhatsAppLink(options);
  const pagePath = options.pagePath || (window.location.pathname + window.location.hash) || '/';
  const deviceType = isMobileDevice() ? 'Mobile' : 'Desktop';

  let context = options.contextDetails || '';
  if (!context) {
    if (options.serviceTitle) context = `Service: ${options.serviceTitle}`;
    else if (options.documentTitle) context = `Document: ${options.documentTitle}`;
    else if (options.articleTitle) context = `Article: ${options.articleTitle}`;
    else if (options.branchName) context = `Branch: ${options.branchName}`;
    else if (options.query) context = `Search Query: ${options.query}`;
    else if (options.faqQuestion) context = `FAQ: ${options.faqQuestion}`;
    else if (options.message) context = options.message;
  }

  saveWhatsAppClick({
    pagePath: pagePath || '/',
    buttonLocation: options.buttonLocation,
    contextDetails: context,
    deviceType,
    targetUrl
  }).catch((e) => console.warn('WA Click logging error:', e));

  return targetUrl;
};

/**
 * GLOBAL AUTOMATIC WHATSAPP EVENT TRACKER
 * Listens for ANY click anywhere on the webpage. If an anchor or button contains a `wa.me` link
 * or WhatsApp trigger, it automatically parses the URL/message parameters, extracts the page path,
 * and logs the click to the Centralized Database automatically!
 */
export const initGlobalWhatsAppTracker = (): (() => void) => {
  const handleGlobalClick = (e: MouseEvent) => {
    try {
      const targetElement = (e.target as HTMLElement)?.closest('a[href*="wa.me"], a[href*="whatsapp.com"], [data-wa-location]');
      if (!targetElement) return;

      const href = targetElement.getAttribute('href') || targetElement.getAttribute('data-wa-url') || '';
      if (!href.includes('wa.me') && !href.includes('whatsapp.com')) return;

      // Extract details from URL query parameter or element attributes
      let buttonLocation = targetElement.getAttribute('data-wa-location') || '';
      let contextDetails = targetElement.getAttribute('data-wa-context') || '';

      // Fallback location detection based on DOM placement if not explicitly set
      if (!buttonLocation) {
        const textContent = targetElement.textContent?.trim() || '';
        if (targetElement.closest('header')) {
          buttonLocation = 'Header WhatsApp CTA';
        } else if (targetElement.closest('footer')) {
          buttonLocation = 'Footer WhatsApp Contact';
        } else if (targetElement.closest('#status')) {
          buttonLocation = 'Visa Status Helper Card';
        } else if (targetElement.closest('#services') || window.location.hash === '#services') {
          buttonLocation = 'Services Catalog Card';
        } else if (targetElement.closest('#branches') || window.location.hash === '#branches') {
          buttonLocation = 'Branch Contact Card';
        } else if (targetElement.closest('#faq') || window.location.hash === '#faq') {
          buttonLocation = 'FAQ WhatsApp CTA';
        } else if (targetElement.closest('#company') || window.location.hash === '#company') {
          buttonLocation = 'Company Page CTA';
        } else if (targetElement.closest('#blog') || window.location.hash.startsWith('#guide/')) {
          buttonLocation = 'Article Specialist CTA';
        } else {
          buttonLocation = textContent ? `WhatsApp Button (${textContent})` : 'Global WhatsApp Link';
        }
      }

      // Parse decoded text from URL e.g. wa.me/971...?text=Hello%20...
      if (!contextDetails && href.includes('text=')) {
        try {
          const urlObj = new URL(href);
          const decodedMsg = urlObj.searchParams.get('text');
          if (decodedMsg) {
            if (decodedMsg.includes('interested in "')) {
              const match = decodedMsg.match(/interested in "([^"]+)"/);
              if (match) contextDetails = `Service: ${match[1]}`;
            } else if (decodedMsg.includes('verify my documents for "')) {
              const match = decodedMsg.match(/verify my documents for "([^"]+)"/);
              if (match) contextDetails = `Document: ${match[1]}`;
            } else if (decodedMsg.includes('guide on "')) {
              const match = decodedMsg.match(/guide on "([^"]+)"/);
              if (match) contextDetails = `Article: ${match[1]}`;
            } else if (decodedMsg.includes('searched for "')) {
              const match = decodedMsg.match(/searched for "([^"]+)"/);
              if (match) contextDetails = `Search: ${match[1]}`;
            } else {
              contextDetails = decodedMsg.slice(0, 70);
            }
          }
        } catch {
          // ignore URL parse fallback
        }
      }

      const pagePath = window.location.pathname + window.location.hash || '/';
      const deviceType = isMobileDevice() ? 'Mobile' : 'Desktop';

      saveWhatsAppClick({
        pagePath: pagePath || '/',
        buttonLocation,
        contextDetails,
        deviceType,
        targetUrl: href
      }).catch(err => console.warn('Global tracker save error:', err));

    } catch (err) {
      console.warn('Global WhatsApp Tracker error:', err);
    }
  };

  window.addEventListener('click', handleGlobalClick, true);
  return () => window.removeEventListener('click', handleGlobalClick, true);
};
