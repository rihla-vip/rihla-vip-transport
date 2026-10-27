"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { buttonPrimary } from "@/components/button-styles";
import { WhatsAppLink } from "@/components/whatsapp-link";
import type { NavLink } from "@/lib/types";

export function MobileNav({
  links,
  ctaLabel,
  ctaHref,
  ctaExternal,
  ctaAriaLabel,
  openLabel,
  closeLabel,
  navLabel,
}: {
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  ctaExternal: boolean;
  ctaAriaLabel: string;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center text-ivory"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" strokeWidth={1.5} />
        <span className="sr-only">{openLabel}</span>
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="bg-navy text-ivory"
        onClose={() => setOpen(false)}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-5">
          <div className="flex items-center justify-between">
            <p id={titleId} className="text-xs font-semibold uppercase tracking-[0.26em] text-gold">
              {navLabel}
            </p>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-ivory"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" strokeWidth={1.5} />
              <span className="sr-only">{closeLabel}</span>
            </button>
          </div>
          <nav className="mt-10 flex flex-col" aria-label={navLabel}>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b border-ivory/10 py-4 text-3xl font-medium uppercase tracking-[0.04em] text-ivory"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <WhatsAppLink
            href={ctaHref}
            external={ctaExternal}
            label={ctaAriaLabel}
            className={`${buttonPrimary} mt-auto h-12 px-6`}
          >
            {ctaLabel}
          </WhatsAppLink>
        </div>
      </dialog>
    </div>
  );
}
