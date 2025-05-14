// App.js
import React, { useState } from 'react';
import { fetchScholars } from './openAlex/api';

const App = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    
    try {
      const scholarData = await fetchScholars(query);
      setResults(scholarData);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to fetch scholars');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-blue-700 text-white py-5 px-6 shadow">
        <h1 className="text-xl font-bold">Academic Scholars Profile Explorer</h1>
      </header>

      <main className="flex-grow px-6 py-8">
        <section aria-label="Scholar Search">
          <h2 className="text-xl font-semibold mb-3">Find Academic Profiles</h2>
          <p className="text-sm text-gray-600 mb-6"> Search your scholr of interest to explore their research.</p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="text"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Search scholars"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search scholars"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </section>

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Loading the profiles...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <section className="mt-10" aria-label="Search Results">
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <ul className="space-y-4">
              {results.map((scholar) => (
                <li key={scholar.id} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <h4 className="text-md font-bold">{scholar.display_name}</h4>
                  <p className="text-sm">{scholar.last_known_institution?.display_name || 'Institution unknown'}</p>
                  <p className="text-sm text-gray-600">Works count: {scholar.works_count || 0}</p>
                  <p className="text-sm text-gray-600">Citations: {scholar.cited_by_count || 0}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!loading && query && results.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500">No scholars found.</p>
          </div>
        )}
      </main>
      
      <footer className="p-4 mt-4 bg-gray-100">
        <p>&copy; 2025 Academic Profile Explorer</p>
      </footer>
    </div>
  );
};

export default App;