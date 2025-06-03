// openAlex/api.js
// api tech doc
// https://docs.openalex.org/api-entities/authors/author-object
import * as cache from '../utils/cache';

const BACKEND_ADDR = process.env.NODE_ENV === 'production' ? '/api': 'http://localhost:5001/api';

export const fetchScholars = async (searchTerm) => {
  if (!searchTerm.trim()) return [];

  const trimmedTerm = searchTerm.trim();
  const cachedResults = cache.getFetchCache(trimmedTerm);
  if (cachedResults) {
    console.log(`[Cache] fetched from cache for keyword: "${trimmedTerm}"`);
    return cachedResults;
  }

  console.log(`[OpenAlex] fetched from openalex api for keyword: "${trimmedTerm}"`);

  const encoded = encodeURIComponent(trimmedTerm);
  const endpoint = `${BACKEND_ADDR}/scholars?query=${encoded}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to get scholars for "${trimmedTerm}": ${response.status}`);
  }

  const data = await response.json();
  const results = data.results || [];
  cache.cacheFetch(trimmedTerm, results);
  return results;
};

export const getScholarInfo = async (scholarId) => {
  if (!scholarId) {
    throw new Error('Scholar ID must be provided');
  }

  const replaceId = scholarId.replace('https://openalex.org/', '');
  const cachedScholar = cache.getScholarsCache(replaceId);
  if (cachedScholar) {
    console.log(`[CACHE] get scholar info from cache for ID: "${replaceId}"`);
    return cachedScholar;
  }

  console.log(`[OpenAlex] get scholar info from openalex api for ID: "${replaceId}"`);
  const res = await fetch(`${BACKEND_ADDR}/scholars/${replaceId}`);

  if (!res.ok) {
    throw new Error(`Failed to get scholar details for "${replaceId}": ${res.status}`);
  }

  const scholarData = await res.json();
  cache.cacheScholars(replaceId, scholarData);
  return scholarData;
};
