// App.js
import React from 'react';

function App() {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl">Academic Scholars Profile Explorer</h1>
      </header>
      
      <main className="p-4">
        <section id="search" aria-label="Scholar Search">
          <h2>Search Scholars</h2>
          <p>Search your scholar of interest to explore their research.</p>
          <div role="search" className="mt-4">
          <p>TODO: implement search form</p>
          </div>
        </section>
      </main>
      
      <footer className="p-4 mt-4 bg-gray-100">
        <p>&copy; 2025 Academic Profile Explorer</p>
      </footer>
    </div>
  );
}

export default App;