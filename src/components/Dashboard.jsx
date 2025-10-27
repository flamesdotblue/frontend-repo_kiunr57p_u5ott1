import React, { useMemo, useState } from 'react';

// Simple SVG charts without external deps
const BarChart = ({ data, labels, color = '#059669' }) => {
  const max = Math.max(1, ...data);
  const height = 160;
  const barW = 28;
  const gap = 16;
  const width = data.length * (barW + gap) + gap;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      {data.map((v, i) => {
        const h = (v / max) * (height - 24);
        const x = gap + i * (barW + gap);
        const y = height - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx={6} fill={color} opacity={0.9} />
            <text x={x + barW / 2} y={height - 4} textAnchor="middle" fontSize="10" fill="#64748b">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const LineChart = ({ data, color = '#ef4444' }) => {
  const max = Math.max(1, ...data);
  const height = 160;
  const width = Math.max(240, data.length * 40);
  const points = data.map((v, i) => {
    const x = (i / Math.max(1, data.length - 1)) * (width - 24) + 12;
    const y = height - (v / max) * (height - 24) - 6;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
      {data.map((v, i) => {
        const x = (i / Math.max(1, data.length - 1)) * (width - 24) + 12;
        const y = height - (v / max) * (height - 24) - 6;
        return <circle key={i} cx={x} cy={y} r={3.5} fill={color} />
      })}
    </svg>
  );
};

const periodize = (entries, period = 'daily') => {
  const byKey = new Map();
  entries.forEach((e) => {
    const d = new Date(e.date);
    const key = period === 'monthly'
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      : period === 'weekly'
        ? `${d.getFullYear()}-W${getWeek(d)}`
        : e.date;
    byKey.set(key, (byKey.get(key) || 0) + (e.emissions?.total || 0));
  });
  const labels = Array.from(byKey.keys());
  const data = labels.map((k) => Number(byKey.get(k).toFixed(2)));
  return { labels, data };
};

function getWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date - yearStart) / 86400000) + 1)/7);
}

const Dashboard = ({ entries }) => {
  const [tab, setTab] = useState('daily');
  const { labels, data } = useMemo(() => periodize(entries, tab), [entries, tab]);
  const total = entries.reduce((s, e) => s + (e.emissions?.total || 0), 0);
  const avg = entries.length ? total / entries.length : 0;

  return (
    <section id="dashboard" className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold">Your impact dashboard</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('daily')} className={`px-3 py-1.5 rounded-full border text-sm ${tab==='daily' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-gray-50'}`}>Daily</button>
            <button onClick={() => setTab('weekly')} className={`px-3 py-1.5 rounded-full border text-sm ${tab==='weekly' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-gray-50'}`}>Weekly</button>
            <button onClick={() => setTab('monthly')} className={`px-3 py-1.5 rounded-full border text-sm ${tab==='monthly' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-gray-50'}`}>Monthly</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
            <h4 className="text-sm text-emerald-900 mb-2">Carbon footprint ({tab})</h4>
            <BarChart data={data} labels={labels} />
          </div>
          <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-100">
            <h4 className="text-sm text-rose-900 mb-2">Trend</h4>
            <LineChart data={data} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500">Entries</p>
            <p className="text-xl font-semibold">{entries.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500">Total CO₂e</p>
            <p className="text-xl font-semibold">{total.toFixed(2)} kg</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500">Avg/day</p>
            <p className="text-xl font-semibold">{avg.toFixed(2)} kg</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500">Best day</p>
            <p className="text-xl font-semibold">{entries.length ? Math.min(...entries.map(e => e.emissions.total)).toFixed(2) : '—'} kg</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
