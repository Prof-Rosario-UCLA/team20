// openAlex/api.js
// api tech doc
// https://docs.openalex.org/api-entities/authors/author-object
import * as cache from '../utils/cache';

const BACKEND_ADDR = process.env.APP_ADDRESS || 'http://localhost:5001/api';

export const fetchScholars = async (searchTerm) => {
  if (!searchTerm.trim()) return [];

  const cachedResults = cache.getFetchCache(searchTerm.trim());
  if (cachedResults) {
    console.log('[Cache] fetched from cache');
    return cachedResults;
  }

  console.log('[OpenAlex] fetched from openalex api');

  const encoded = encodeURIComponent(searchTerm.trim());
  const endpoint = `${BACKEND_ADDR}/scholars?query=${encoded}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to get scholars: ${response.status}`);
  }

  const data = await response.json();
  const results = data.results || [];
  cache.cacheFetch(searchTerm.trim(), results);
  return results;
};

export const getScholarInfo = async (scholarId) => {
  if (!scholarId) {
    throw new Error('Scholar ID must be provided');
  }

  const replaceId = scholarId.replace('https://openalex.org/', '');
  const cachedScholar = cache.getScholarsCache(replaceId);
  if (cachedScholar) {
    console.log('[CACHE] get scholar info from cache');
    return cachedScholar;
  }

  console.log('[OpenAlex] get scholar info from openalex api');
  const res = await fetch(`${BACKEND_ADDR}/scholars/${replaceId}`);

  if (!res.ok) {
    throw new Error(`Failed to get scholar details: ${res.status}`);
  }

  const scholarData = await res.json();
  cache.cacheScholars(replaceId, scholarData);
  return scholarData;
};
