"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackedLinkProps {
  href: string;
  eventName: string;
  eventParams: Record<string, string | number | boolean>;
  className?: string;
  children: ReactNode;
}

export default function TrackedLink({
  href,
  eventName,
  eventParams,
  className,
  children,
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent(eventName, eventParams)}
    >
      {children}
    </Link>
  );
}
