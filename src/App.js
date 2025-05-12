// App.js
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Academic Scholars Profile Explorer</h1>
      </header>
      
      <main>
        <section id="search" aria-label="Scholar Search">
          <h2>Search Scholars</h2>
          <p>Search your scholar of interest to explore their research.</p>
          <div role="search">
            <p>TODO: implement search form</p>
          </div>
        </section>
      </main>
      
      <footer>
        <p>&copy; 2025 Academic Profile Explorer</p>
      </footer>
    </div>
  );
}

export default App;