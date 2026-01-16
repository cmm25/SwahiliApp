'use client';

import Link, { LinkProps } from "next/link";
import { usePrefetch } from "@/hooks/usePrefetch";
import { forwardRef, useCallback } from "react";

interface PrefetchLinkProps extends LinkProps {
  prefetchOnHover?: boolean;
  className?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}

export const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  ({ href, prefetchOnHover = true, onMouseEnter, onFocus, children, ...props }, ref) => {
    const { prefetch } = usePrefetch();
    const path = typeof href === "string" ? href : href.pathname || "";

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (prefetchOnHover) {
          prefetch(path);
        }
        onMouseEnter?.(e);
      },
      [prefetch, path, prefetchOnHover, onMouseEnter]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLAnchorElement>) => {
        if (prefetchOnHover) {
          prefetch(path);
        }
        onFocus?.(e);
      },
      [prefetch, path, prefetchOnHover, onFocus]
    );

    return (
      <Link
        ref={ref}
        href={href}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

PrefetchLink.displayName = "PrefetchLink";
