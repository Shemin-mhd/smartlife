import { subscribeGeneralSettings, getStoredLocalSettings } from '../firebase/dbSettings';

export interface WhatsAppConfig {
  primaryNumber: string; // Clean digits or formatted e.g. "971551585570" or "+971 55 158 5570"
  displayNumber: string; // Formatted e.g. "+971 55 158 5570"
  businessName: string;
  defaultMessage: string;
}

const initialSettings = getStoredLocalSettings();

export const CENTRAL_WHATSAPP_CONFIG: WhatsAppConfig = {
  primaryNumber: initialSettings.whatsappNumber || '971551585570',
  displayNumber: initialSettings.whatsappDisplayNumber || '+971 55 158 5570',
  businessName: initialSettings.businessName || 'Smart Life Typing Services',
  defaultMessage: initialSettings.whatsappDefaultMessage || 'Hello Smart Life Typing Services, I need assistance with UAE visa & government documentation.',
};

// Subscribe to real-time general settings updates
if (typeof window !== 'undefined') {
  subscribeGeneralSettings((settings) => {
    if (settings.whatsappNumber) {
      CENTRAL_WHATSAPP_CONFIG.primaryNumber = settings.whatsappNumber;
    }
    if (settings.whatsappDisplayNumber) {
      CENTRAL_WHATSAPP_CONFIG.displayNumber = settings.whatsappDisplayNumber;
    }
    if (settings.businessName) {
      CENTRAL_WHATSAPP_CONFIG.businessName = settings.businessName;
    }
    if (settings.whatsappDefaultMessage) {
      CENTRAL_WHATSAPP_CONFIG.defaultMessage = settings.whatsappDefaultMessage;
    }
  });
}

export interface WhatsAppLinkOptions {
  message?: string;
  serviceTitle?: string;
  query?: string;
  branchName?: string;
  articleTitle?: string;
  documentTitle?: string;
  faqQuestion?: string;
}

/**
 * Returns clean digits for WhatsApp wa.me links
 */
export const getCleanWhatsAppNumber = (numStr?: string): string => {
  const raw = numStr || CENTRAL_WHATSAPP_CONFIG.primaryNumber;
  return raw.replace(/[^0-9]/g, '');
};

/**
 * Returns formatted public WhatsApp display number
 */
export const getWhatsAppDisplayNumber = (): string => {
  return CENTRAL_WHATSAPP_CONFIG.displayNumber || CENTRAL_WHATSAPP_CONFIG.primaryNumber;
};

/**
 * Generates a centralized WhatsApp click link with customized, structured messages.
 */
export const getWhatsAppLink = (options: WhatsAppLinkOptions = {}): string => {
  const number = getCleanWhatsAppNumber();
  let text = CENTRAL_WHATSAPP_CONFIG.defaultMessage;

  if (options.message) {
    text = options.message;
  } else if (options.query) {
    text = `Hello ${CENTRAL_WHATSAPP_CONFIG.businessName}, I searched for "${options.query}" on your website. Could you please provide guidance and pricing for this service?`;
  } else if (options.serviceTitle) {
    text = `Hello ${CENTRAL_WHATSAPP_CONFIG.businessName}, I am interested in "${options.serviceTitle}". Please guide me on required documents, processing time, and fees.`;
  } else if (options.documentTitle) {
    text = `Hello ${CENTRAL_WHATSAPP_CONFIG.businessName}, I want to verify my documents for "${options.documentTitle}". Please review my application.`;
  } else if (options.articleTitle) {
    text = `Hello ${CENTRAL_WHATSAPP_CONFIG.businessName}, I read your guide on "${options.articleTitle}" and would like assistance with my application.`;
  } else if (options.faqQuestion) {
    text = `Hello ${CENTRAL_WHATSAPP_CONFIG.businessName}, I have a question regarding: "${options.faqQuestion}". Could you please clarify?`;
  } else if (options.branchName) {
    text = `Hello ${CENTRAL_WHATSAPP_CONFIG.businessName} (${options.branchName}), I would like to inquire about typing services and visiting your branch.`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

/**
 * Centralized direct trigger to open WhatsApp in a new browser tab.
 */
export const openCentralWhatsApp = (options: WhatsAppLinkOptions = {}): void => {
  const url = getWhatsAppLink(options);
  window.open(url, '_blank', 'noopener,noreferrer');
};
