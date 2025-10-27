import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import ActivityForm from './components/ActivityForm';
import Dashboard from './components/Dashboard';
import EcoPanel from './components/EcoPanel';

function App() {
  const [entries, setEntries] = useState([]);

  const addEntry = (entry) => {
    // Merge on date: replace if same date exists
    setEntries((prev) => {
      const others = prev.filter((e) => e.date !== entry.date);
      return [...others, entry].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
  };

  return (
    <div className="font-inter text-gray-900">
      <HeroSection />
      <ActivityForm onAddEntry={addEntry} />
      <Dashboard entries={entries} />
      <EcoPanel entries={entries} />
      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-sm text-gray-500">
        Built with care for the planet. Spin the globe above and start your low-carbon journey.
      </footer>
    </div>
  );
}

export default App;
