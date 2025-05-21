// App.js
import React, { useState, useEffect } from 'react';
import { fetchScholars } from './openAlex/api';
import ScholarDetail from './ScholarDetail';
import { authorize, LoginForm, CookieNotice } from './auth/auth';

const App = () => {
  const { userID, loginVisible, setLoginVisible, handleLogin, handleLogout, askAcceptCookies, acceptCookies } = authorize();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [activeScholarId, setActiveScholarId] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('csrf');
    setCsrfToken(token || '');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (csrfToken !== sessionStorage.getItem('csrf')) {
      setError('Security validation failed');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveScholarId(null);

    try {
      const scholarData = await fetchScholars(trimmed);
      setResults(scholarData);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to fetch scholars');
    } finally {
      setLoading(false);
    }
  };

  const clearOptions = () => {setQuery(''); setResults([]); setError(null); setActiveScholarId(null);};

  const selectScholar = (scholar) => {
    setActiveScholarId(scholar.id);
  };

  const goBackToList = () => {
    setActiveScholarId(null);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 text-gray-800 overflow-hidden">
      {loginVisible && ( <LoginForm 
          onLogin={handleLogin} 
          onCancel={() => setLoginVisible(false)} 
        />
      )}
      
      {askAcceptCookies && (<CookieNotice onAccept={acceptCookies} />)}

      <header className="bg-blue-700 text-white py-2 px-4 shadow flex items-center justify-between">
        <h1 className="text-xl font-bold truncate">Academic Scholars Profile Explorer</h1>
        <div>
          {userID ? (
            <div className="flex items-center">
              <span className="mr-2">User: {userID.id}</span>
              <button 
                onClick={handleLogout}
                className="bg-blue-700 px-4 py-2 hover:bg-blue-800"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setLoginVisible(true)}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              Log In
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col p-3 overflow-hidden">
        {!activeScholarId ? (
          <>
            <section aria-label="Scholar Search" className="mb-2">
              <h2 className="text-xl font-semibold mb-1">Find Academic Profiles</h2>
              <p className="text-sm text-gray-600 mb-2">Search your scholar of interest.</p>

              <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                <input type="hidden" name="_csrf" value={csrfToken} />
                
                <input
                  type="text"
                  className="flex-grow h-8 px-2 border border-gray-300 rounded-lg"
                  placeholder="Search scholars"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Scholar search input"
                />
                <div className="flex justify-end items-center gap-1">
                  {query && (
                    <button
                      type="button"
                      onClick={clearOptions}
                      className="h-8 px-5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-8 px-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>
            </section>

            {error && (
              <div className="p-2 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-2">
                <p className="text-gray-500">Loading the profiles...</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <section className="mt-2 flex-grow overflow-hidden" aria-label="Search Results">
                <h3 className="text-lg font-semibold mb-4">Results</h3>
                <ul className="space-y-2 overflow-y-auto h-[calc(100vh-200px)] pb-2">
                  {results.map((scholar) => (
                    <li
                      key={scholar.id}
                      className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:bg-blue-50 cursor-pointer"
                      onClick={() => selectScholar(scholar)}
                    >
                      <h4 className="text-md font-bold truncate">
                        {scholar.display_name.replace(/[<>]/g, '')}
                      </h4>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>Pubs: {scholar.works_count}</span>
                        <span>Total Citations {scholar.cited_by_count}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!loading && query && results.length === 0 && (
              <div className="mt-8 text-center py-2">
                <p className="text-gray-500 py-2">No scholars matched your search.</p>
              </div>
            )}
          </>
        ) : (
          <ScholarDetail
            scholarId={activeScholarId}
            onBack={goBackToList}
          />
        )}
      </main>

    </div>
  );
};

export default App;