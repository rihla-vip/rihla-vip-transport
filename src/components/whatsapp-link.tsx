import type { ReactNode } from "react";

export function WhatsAppLink({
  href,
  external,
  className,
  children,
  label,
}: {
  href: string;
  external: boolean;
  className?: string;
  children: ReactNode;
  label: string;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={className} aria-label={label}>
      {children}
    </a>
  );
}
