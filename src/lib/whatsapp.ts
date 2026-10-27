const WHATSAPP_NUMBER = /^\d{8,15}$/;

export function isWhatsappConfigured(number: string): boolean {
  return WHATSAPP_NUMBER.test(number);
}

export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

export function buildWhatsappUrl(
  number: string,
  message: string,
): string | null {
  if (!isWhatsappConfigured(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function inquiryLink(
  number: string,
  message: string,
): { href: string; external: boolean } {
  const href = buildWhatsappUrl(number, message);
  if (!href) return { href: "#contact", external: false };
  return { href, external: true };
}
