import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, any>;
  ogImage?: string;
}

const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const useSEO = ({ title, description, canonical, jsonLd, ogImage }: SEOOptions) => {
  useEffect(() => {
    document.title = title.length > 60 ? title.slice(0, 57) + '...' : title;

    if (description) {
      setMeta('description', description.slice(0, 160));
      setMeta('og:description', description.slice(0, 160), 'property');
    }
    setMeta('og:title', title, 'property');
    setMeta('og:type', 'article', 'property');
    if (ogImage) setMeta('og:image', ogImage, 'property');

    const href = canonical || window.location.href;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = href;

    let script: HTMLScriptElement | null = document.getElementById('page-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'page-jsonld';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, canonical, ogImage, JSON.stringify(jsonLd)]);
};
