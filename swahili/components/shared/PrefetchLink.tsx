'use client';

import { Link, LinkProps } from "react-router-dom";
import { usePrefetch } from "@/hooks/usePrefetch";
import { forwardRef, useCallback } from "react";

interface PrefetchLinkProps extends LinkProps {
  prefetchOnHover?: boolean;
}

export const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  ({ to, prefetchOnHover = true, onMouseEnter, onFocus, children, ...props }, ref) => {
    const { prefetch } = usePrefetch();
    const path = typeof to === "string" ? to : to.pathname || "";

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
        to={to}
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
