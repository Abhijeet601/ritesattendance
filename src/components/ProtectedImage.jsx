import { useEffect, useState } from 'react';
import api from '../api/axios';

export function ProtectedImage({ path, alt, ...props }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    let objectUrl = '';
    if (!path) return undefined;
    api.get('/api/media', { params: { path }, responseType: 'blob' })
      .then(({ data }) => {
        objectUrl = URL.createObjectURL(data);
        setUrl(objectUrl);
      })
      .catch(() => setUrl(''));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [path]);

  return url ? <img src={url} alt={alt} {...props} /> : null;
}

export async function downloadProtectedFile(path) {
  const response = await api.get('/api/media', { params: { path }, responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  window.open(url, '_blank', 'noopener,noreferrer');
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
