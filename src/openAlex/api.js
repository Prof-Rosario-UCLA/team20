export const fetchScholars = async (searchTerm) => {
  if (!searchTerm.trim()) return [];

  const query = encodeURIComponent(searchTerm.trim());
  const url = `https://api.openalex.org/authors?filter=display_name.search:${query}&per_page=10`;

  const response = await fetch(url);
  const data = await response.json();
  return data.results ?? [];
};