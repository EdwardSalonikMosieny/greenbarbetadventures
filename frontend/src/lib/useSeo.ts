import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description: string;
  /** Set for admin/internal pages so search engines don't index them. */
  noindex?: boolean;
}

const SITE_NAME = 'Green Barbet Adventures';
const SITE_URL = 'https://www.greenbarbetadventures.com';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// No react-helmet dependency needed for a site this size — plain DOM writes in an
// effect are enough, and every value is set unconditionally on every route change so
// nothing can leak from a previous page.
function useSeo({ title, description, noindex = false }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:url', `${SITE_URL}${window.location.pathname}`);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
  }, [title, description, noindex]);
}

export default useSeo;
