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
  try {
    (window as any).__lastWaTrackTime = Date.now();
  } catch {}

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
 * Since all WhatsApp CTAs explicitly call trackAndOpenWhatsApp with exact button location metadata,
 * this global listener is safely neutralized to prevent duplicate ghost logs.
 */
export const initGlobalWhatsAppTracker = (): (() => void) => {
  return () => {};
};
