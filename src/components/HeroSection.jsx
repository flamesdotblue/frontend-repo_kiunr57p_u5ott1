import React from 'react';
import Spline from '@splinetool/react-spline';
import { Leaf, Globe } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh] overflow-hidden bg-gradient-to-b from-rose-50 via-white to-emerald-50">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/M2rj0DQ6tP7dSzSz/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium shadow-sm">
            <Globe className="w-4 h-4" />
            <span>Track. Improve. Celebrate.</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Carbon Footprint Tracker
          </h1>
          <p className="max-w-2xl text-gray-600 text-sm md:text-base">
            Log your daily activities, visualize your impact, get personalized eco tips, and level up with gamified rewards — all in one sleek, responsive experience.
          </p>
          <div className="flex items-center gap-3">
            <a href="#activity" className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full shadow-lg transition-all">
              <Leaf className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Start Logging
            </a>
            <a href="#dashboard" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-5 py-2.5 rounded-full shadow border">
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
