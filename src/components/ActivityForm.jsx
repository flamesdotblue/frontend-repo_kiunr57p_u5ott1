import React, { useState } from 'react';
import { Calendar, Star } from 'lucide-react';

const dietFactors = {
  omnivore: 6.0, // kg CO2e/day baseline
  vegetarian: 3.0,
  vegan: 2.0,
};

const ActivityForm = ({ onAddEntry }) => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [miles, setMiles] = useState('');
  const [kwh, setKwh] = useState('');
  const [water, setWater] = useState('');
  const [diet, setDiet] = useState('omnivore');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const nonNeg = (v) => v === '' || (!isNaN(Number(v)) && Number(v) >= 0);
    if (!date) e.date = 'Choose a date';
    if (!nonNeg(miles)) e.miles = 'Enter a valid number';
    if (!nonNeg(kwh)) e.kwh = 'Enter a valid number';
    if (!nonNeg(water)) e.water = 'Enter a valid number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const milesNum = Number(miles || 0);
    const kwhNum = Number(kwh || 0);
    const waterNum = Number(water || 0);

    // Emission factors
    const car = 0.21; // kg CO2e/mile
    const elec = 0.92; // kg CO2e/kWh
    const waterFactor = 0.0003; // approx kg CO2e/liter (est.)

    const transport = milesNum * car;
    const electricity = kwhNum * elec;
    const waterEmissions = waterNum * waterFactor;
    const dietEmissions = dietFactors[diet] || 0;

    const total = transport + electricity + waterEmissions + dietEmissions;

    onAddEntry({
      date,
      miles: milesNum,
      kwh: kwhNum,
      water: waterNum,
      diet,
      emissions: { transport, electricity, water: waterEmissions, diet: dietEmissions, total },
    });

    setMiles('');
    setKwh('');
    setWater('');
  };

  return (
    <section id="activity" className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-semibold">Log today’s activities</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.date && <span className="text-xs text-rose-600">{errors.date}</span>}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Miles driven</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              placeholder="e.g., 12"
              className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.miles && <span className="text-xs text-rose-600">{errors.miles}</span>}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Electricity (kWh)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={kwh}
              onChange={(e) => setKwh(e.target.value)}
              placeholder="e.g., 8.5"
              className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.kwh && <span className="text-xs text-rose-600">{errors.kwh}</span>}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Water (liters)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              placeholder="e.g., 50"
              className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.water && <span className="text-xs text-rose-600">{errors.water}</span>}
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm text-gray-600">Diet type</span>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="omnivore">Omnivore</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </label>

          <div className="md:col-span-2 flex gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow transition-all"
            >
              Save entry
            </button>
            <button
              type="button"
              onClick={() => { setMiles(''); setKwh(''); setWater(''); }}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ActivityForm;
