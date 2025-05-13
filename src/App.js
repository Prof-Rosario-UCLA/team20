// App.js
import React, { useState } from 'react';

const App = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      // does loading work
      // await new Promise((res) => setTimeout(res, 1000));

      // Placeholder data
      setResults([
        {
          id: 1, name: 'Yuri Kim', university: 'UCLA', research_interest: 'Computer Science',
        },
      ]);
    } catch (err) {
      console.error('Failed to fetch results:', err);
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

        {loading && (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Loading the profiles...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <section className="mt-10" aria-label="Search Results">
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <ul className="space-y-4">
              {results.map((r) => (
                <li key={r.id} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <h4 className="text-md font-bold">{r.name}</h4>
                  <p className="text-sm">{r.university}</p>
                  <p className="text-sm text-gray-600">Research Interest: {r.research_interest}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

      </main>
      
      <footer className="p-4 mt-4 bg-gray-100">
        <p>&copy; 2025 Academic Profile Explorer</p>
      </footer>
    </div>
  );
};

export default App;