// Smoke tests for the game logic modules (no Three.js needed).
// Run: node test/smoke.mjs
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const window = {};
global.window = window;

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } };

for (const f of ['physics.js', 'carspecs.js', 'carbody.js']) {
  eval(readFileSync(join(root, f), 'utf8'));
}
const S = window.SS;

// Track
const tk = new S.Track(S.TRACK_PTS, 3.5);
ok(tk.len > 3000 && tk.len < 6000, 'track length sane: ' + Math.round(tk.len));
ok(tk.N > 500, 'track point count: ' + tk.N);
const loc = tk.locate(tk.P[0].x, tk.P[0].z);
ok(Math.abs(loc.d) < 0.01, 'locate on centerline');

// Speed profile used by the AI
const prof = tk.profile(50, 1.0, 3.0, 7);
ok(prof.length === tk.N && Math.min(...prof) > 3 && Math.max(...prof) <= 50, 'ai profile bounded');

// Acceleration: every car hits 100 km/h in a believable time, and its top speed
for (const d of S.CARS) {
  const v = new S.Vehicle(d);
  v.opt = { man: false, abs: true, tcs: true, sa: true };
  const inp = { steer: 0, thr: 1, brk: 0, hb: 0 };
  let t100 = null, top = 0;
  const h = 1 / 120;
  for (let t = 0; t < 40; t += h) {
    v.step(h, inp);
    if (t100 === null && v.vx * 3.6 >= 100) t100 = t;
    top = Math.max(top, v.vx * 3.6);
  }
  ok(t100 !== null && t100 > 3 && t100 < 15, d.id + ' 0-100 in ' + (t100 && t100.toFixed(1)) + 's');
  ok(top > 120 && top < 260, d.id + ' top speed ' + Math.round(top) + ' km/h');
  ok(v.gear >= 3, d.id + ' shifted to gear ' + (v.gear + 1));
}

// Steering: car turns when steered
{
  const v = new S.Vehicle(S.CARS[0]);
  v.opt = { man: false, abs: true, tcs: true, sa: true };
  for (let t = 0; t < 3; t += 1 / 120) v.step(1 / 120, { steer: 0, thr: 1, brk: 0, hb: 0 });
  const h0 = v.h;
  for (let t = 0; t < 1; t += 1 / 120) v.step(1 / 120, { steer: 1, thr: 0, brk: 0, hb: 0 });
  ok(Math.abs(v.h - h0) > 0.15, 'steering turns the car: ' + (v.h - h0).toFixed(2) + ' rad');
}

// Braking stops the car
{
  const v = new S.Vehicle(S.CARS[0]);
  v.opt = { man: false, abs: true, tcs: true, sa: true };
  for (let t = 0; t < 5; t += 1 / 120) v.step(1 / 120, { steer: 0, thr: 1, brk: 0, hb: 0 });
  let tStop = null;
  for (let t = 0; t < 20; t += 1 / 120) {
    v.step(1 / 120, { steer: 0, thr: 0, brk: 1, hb: 0 });
    if (v.vx < 0.5) { tStop = t; break; }
  }
  ok(tStop !== null && tStop < 10, 'brakes stop the car in ' + (tStop && tStop.toFixed(1)) + 's');
}

// Car body generator produces valid geometry for every shape
for (const key of ['sedan', 'van', 'boxy']) {
  const b = S.carBody(S.SPECS[key]);
  ok(b.pos.length > 1000 && b.idx.length > 1000, key + ' body geometry');
  ok(b.glass.idx.length > 30, key + ' glass geometry');
  let finite = true;
  for (let i = 0; i < b.pos.length; i++) if (!isFinite(b.pos[i])) { finite = false; break; }
  ok(finite, key + ' vertices finite');
}

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
