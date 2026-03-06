import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export function Head({ title, description, image, url, keywords }) {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = title || `${settings.site_name} - ${settings.site_description}`;

    const updateMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`) ||
        document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description || settings.site_description);
    updateMeta('keywords', keywords || `${settings.site_name}, streaming, filmes, vídeos`);
    updateMeta('og:title', title || settings.site_name);
    updateMeta('og:description', description || settings.site_description);
    updateMeta('og:type', 'website');
    updateMeta('og:url', url || window.location.href);
    if (image) {
      updateMeta('og:image', image);
    }

  }, [title, description, image, url, keywords]);

  return null;
}
