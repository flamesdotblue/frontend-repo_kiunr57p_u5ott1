import React, { useMemo, useState } from 'react';
import { Leaf, Trophy, Share2, Sun, Cloud, Globe } from 'lucide-react';

const shareText = (points, best, avg) =>
  encodeURIComponent(
    `I just earned ${points} eco-points on my Carbon Tracker! Best day: ${best.toFixed(1)} kg CO₂e, Avg: ${avg.toFixed(1)} kg. Join me in going greener!`
  );

const getRecommendations = (latest) => {
  if (!latest) return [
    'Log your first day to unlock personalized eco tips!',
    'Try setting a weekly goal to reduce emissions by 10%.',
  ];
  const tips = [];
  const { transport, electricity, water, diet, total } = latest.emissions;
  if (transport > electricity && transport > diet) tips.push('Consider carpooling or biking for short trips to cut transport emissions.');
  if (electricity > transport && electricity > diet) tips.push('Switch to LED bulbs and unplug idle devices to save electricity.');
  if (diet > transport && diet > electricity) tips.push('Try a vegetarian day or reduce red meat to lower diet emissions.');
  if (water > 0.5) tips.push('Take shorter showers and fix leaks to save water.');
  if (total > 20) tips.push('Set a goal to reduce by 15% this week — small changes add up!');
  if (!tips.length) tips.push('Great balance! Maintain your habits and aim for a new personal best.');
  return tips;
};

const EcoPanel = ({ entries }) => {
  const [city, setCity] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [weather, setWeather] = useState(null);
  const latest = entries[entries.length - 1];

  const totals = useMemo(() => {
    const t = entries.reduce((acc, e) => {
      acc.points += Math.max(0, 50 - Math.round(e.emissions.total)); // fewer emissions => more points
      acc.best = Math.min(acc.best, e.emissions.total);
      acc.sum += e.emissions.total;
      return acc;
    }, { points: 0, best: Number.POSITIVE_INFINITY, sum: 0 });
    const avg = entries.length ? t.sum / entries.length : 0;
    const best = entries.length ? t.best : 0;
    return { points: t.points, avg, best };
  }, [entries]);

  const recs = useMemo(() => getRecommendations(latest), [latest]);

  const fetchWeather = async () => {
    if (!apiKey || !city) return;
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
      const data = await res.json();
      setWeather({
        temp: data?.main?.temp,
        desc: data?.weather?.[0]?.main,
      });
    } catch {
      setWeather(null);
    }
  };

  const message = useMemo(() => {
    if (!weather) return null;
    const sunny = weather.desc && weather.desc.toLowerCase().includes('clear');
    const rain = weather.desc && weather.desc.toLowerCase().includes('rain');
    if (sunny) return 'Sunny day — consider biking or a walking errand to earn bonus eco-points!';
    if (rain) return 'Rainy vibes — batch errands or use public transit where possible.';
    return 'Mild weather — plan a low-carbon activity like a local walk.';
  }, [weather]);

  const whatsapp = `https://api.whatsapp.com/send?text=${shareText(totals.points, totals.best, totals.avg)}`;
  const twitter = `https://twitter.com/intent/tweet?text=${shareText(totals.points, totals.best, totals.avg)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://example.com')}`;

  // Simple zero waste checklist
  const [zeroWaste, setZeroWaste] = useState({ reusableBag: false, bottle: false, compost: false, recycle: false });
  const zwCount = Object.values(zeroWaste).filter(Boolean).length;

  // Simple eco goals
  const [goals, setGoals] = useState({ miles: 10, kwh: 2, water: 10 });

  const treeRewards = Math.floor(totals.points / 200); // every 200 pts = 1 tree badge

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold">Personalized recommendations</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
            {recs.map((r, i) => <li key={i}>{r}</li>)}
          </ul>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 bg-emerald-50/60">
              <p className="text-xs text-emerald-900 mb-2">Weather-based tip</p>
              <div className="flex items-center gap-2 mb-2">
                {weather?.desc?.toLowerCase().includes('clear') ? <Sun className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                <span className="text-sm">{weather ? `${weather.desc} • ${Math.round(weather.temp)}°C` : 'Enter a city and API key to fetch weather.'}</span>
              </div>
              <div className="flex gap-2">
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (e.g., London)" className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="OpenWeather API Key" className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button onClick={fetchWeather} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">Fetch</button>
              </div>
              {message && <p className="mt-2 text-sm text-emerald-900">{message}</p>}
            </div>

            <div className="rounded-xl border p-4 bg-white">
              <p className="text-xs text-gray-500 mb-2">Zero waste tracker</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['Reusable bag', 'reusableBag'],
                  ['Refilled bottle', 'bottle'],
                  ['Composted', 'compost'],
                  ['Recycled', 'recycle'],
                ].map(([label, key]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input type="checkbox" checked={zeroWaste[key]} onChange={(e) => setZeroWaste({ ...zeroWaste, [key]: e.target.checked })} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm">Great job! {zwCount} zero-waste actions today.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Gamification</h3>
          </div>
          <div className="rounded-xl border p-4 bg-amber-50/60">
            <p className="text-xs text-amber-900">Eco-points</p>
            <p className="text-3xl font-bold text-amber-700">{totals.points}</p>
            <p className="text-xs text-amber-900">Best day: {totals.best ? totals.best.toFixed(1) : '—'} kg • Avg: {totals.avg.toFixed(1)} kg</p>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium">Badges</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">Starter</span>
              {totals.points >= 200 && <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Saver</span>}
              {totals.points >= 500 && <span className="px-2 py-1 rounded-full text-xs bg-rose-100 text-rose-800">Champion</span>}
              {treeRewards > 0 && <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{treeRewards} Tree{treeRewards>1?'s':''}</span>}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium">Eco goal planner</p>
            <div className="space-y-2 mt-2">
              {['miles','kwh','water'].map((k) => (
                <label key={k} className="flex items-center justify-between gap-2 text-sm">
                  <span className="capitalize">Reduce {k}</span>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" value={goals[k]} onChange={(e)=>setGoals({...goals,[k]:Number(e.target.value)})} className="w-20 rounded-lg border px-2 py-1" />
                    <span className="text-gray-500 text-xs">per day</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Share your progress</p>
            <div className="flex gap-2">
              <a href={twitter} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border hover:bg-gray-50 inline-flex items-center gap-2 text-sm"><Share2 className="w-4 h-4"/>Twitter</a>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border hover:bg-gray-50 inline-flex items-center gap-2 text-sm">WhatsApp</a>
              <a href={linkedin} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border hover:bg-gray-50 inline-flex items-center gap-2 text-sm">LinkedIn</a>
            </div>
          </div>

          <div className="mt-6 rounded-xl border p-4 bg-emerald-50/60">
            <p className="text-xs text-emerald-900 mb-1">Eco tips feed</p>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Wash laundry on cold — saves energy with similar results.</li>
              <li>Plan meals to minimize food waste and packaging.</li>
              <li>Charge devices during off-peak hours where available.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcoPanel;
