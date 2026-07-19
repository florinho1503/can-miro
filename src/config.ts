/**
 * Site-wide contact config, sourced from environment variables with sensible
 * placeholder defaults so the site builds out of the box. Set real values in
 * `.env` (see .env.example).
 */
const env = import.meta.env;

export const config = {
  /** WhatsApp number in international format, digits only (no +, no spaces). */
  whatsappNumber: (env.PUBLIC_WHATSAPP_NUMBER as string) || '31614059644',
  /** Contact email address (also the enquiry destination). */
  email: (env.PUBLIC_CONTACT_EMAIL as string) || 'michaelabokx@gmail.com',
  /** Web3Forms access key (https://web3forms.com). Empty = form uses mailto fallback. */
  web3formsKey: (env.PUBLIC_WEB3FORMS_KEY as string) || '',
};

/** Build a WhatsApp deep link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${config.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
