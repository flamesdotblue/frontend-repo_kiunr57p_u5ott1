import React, { useState } from 'react';
import { Leaf, Menu, X, User } from 'lucide-react';

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onClick }) => (
    <>
      <a href="#activity" onClick={onClick} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-50">Log</a>
      <a href="#dashboard" onClick={onClick} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-50">Dashboard</a>
      <a href="#eco" onClick={onClick} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-50">Eco</a>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="#" className="inline-flex items-center gap-2 font-semibold text-emerald-700">
          <Leaf className="w-5 h-5" />
          EcoTrack
        </a>
        <nav className="hidden md:flex items-center gap-1 text-gray-700">
          <NavLinks />
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border hover:bg-gray-50">
            <User className="w-4 h-4" /> Sign in
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-2 flex flex-col gap-1">
          <NavLinks onClick={() => setOpen(false)} />
          <button className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border w-max"> <User className="w-4 h-4"/> Sign in</button>
        </div>
      )}
    </header>
  );
};

export default NavBar;
