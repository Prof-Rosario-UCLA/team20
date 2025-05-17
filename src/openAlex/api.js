// api tech doc
// https://docs.openalex.org/api-entities/authors/author-object
export const fetchScholars = async (searchTerm) => {
  if (!searchTerm.trim()) return [];

  const query = encodeURIComponent(searchTerm.trim());
  const url = `https://api.openalex.org/authors?filter=display_name.search:${query}&per_page=10`;

  const response = await fetch(url);
  const data = await response.json();
  return data.results ?? [];
};

export const getScholarInfo = async (id) => {
  if (!id) throw new Error('Missing scholar ID');

  const base = 'https://api.openalex.org';
  const [infoRes, worksRes] = await Promise.all([
    fetch(`${base}/authors/${id}`),
    fetch(`${base}/works?filter=author.id:${id}&per_page=5&sort=publication_date:desc`)
  ]);

  const info = await infoRes.json();
  const works = await worksRes.json();

  return { ...info, works: works.results || [] };
};