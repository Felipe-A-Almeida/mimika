import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  /** Path-only canonical (e.g. "/contact"). Defaults to current pathname. */
  canonicalPath?: string;
}

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SEO({ title, description, canonicalPath }: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
    upsertMeta('description', description);

    const path = canonicalPath ?? location.pathname;
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://mimika.com.br';
    const canonical = `${origin}${path === '/' ? '/' : path.replace(/\/$/, '')}`;
    upsertCanonical(canonical);

    // Open Graph + Twitter sync
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:url', canonical, 'property');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
  }, [title, description, canonicalPath, location.pathname]);

  return null;
}
