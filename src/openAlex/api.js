// api tech doc
// https://docs.openalex.org/api-entities/authors/author-object
const BACKEND_ADDR = process.env.APP_ADDRESS || 'http://localhost:5001/api';

export const fetchScholars = async (searchTerm) => {
  if (!searchTerm.trim()) return [];

  const encoded = encodeURIComponent(searchTerm.trim());
  const endpoint = `${BACKEND_ADDR}/scholars?query=${encoded}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to get scholars: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
};

export const getScholarInfo = async (scholarId) => {
  if (!scholarId) {
    throw new Error('Scholar ID must be provided');
  }

  const replaceId = scholarId.replace('https://openalex.org/', '')
  const res = await fetch(`${BACKEND_ADDR}/scholars/${replaceId}`);

  if (!res.ok) {
    throw new Error(`Failed to get scholar details: ${res.status}`);
  }

  return await res.json();
};
