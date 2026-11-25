#!/usr/bin/env python3
"""Build realmap-data.json from raw OSM tiles (tile_*.xml fetched once from
the OSM API). Roads: motorway/trunk/primary/secondary/tertiary + links, with
bridge/layer tags. Water: riverbank polygons (the Nile). Coordinates are
quantized to decimeters relative to the area origin. One-off preprocessing:
the game loads the resulting static JSON, no runtime API calls.
Data: (c) OpenStreetMap contributors, ODbL 1.0."""
import xml.etree.ElementTree as ET, json, glob, math, sys

TILES = sys.argv[1] if len(sys.argv) > 1 else 'tile_*.xml'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'realmap-data.json'
LAT0, LON0 = 30.06, 31.23  # area origin (Zamalek south)

nodes, ways, tls = {}, {}, []
for f in sorted(glob.glob(TILES)):
    r = ET.parse(f).getroot()
    for n in r.findall('node'):
        nodes[n.get('id')] = (float(n.get('lat')), float(n.get('lon')))
        if any(t.get('k') == 'highway' and t.get('v') == 'traffic_signals'
               for t in n.findall('tag')):
            tls.append((float(n.get('lat')), float(n.get('lon'))))
    for w in r.findall('way'):
        wid = w.get('id')
        if wid in ways: continue
        ways[wid] = ({t.get('k'): t.get('v') for t in w.findall('tag')},
                     [nd.get('ref') for nd in w.findall('nd')])

def xy(lat, lon):  # meters, x east, -z north
    return ((lon - LON0) * 111320 * math.cos(math.radians(LAT0)),
            -(lat - LAT0) * 110540)

KEEP = {'motorway': 0, 'motorway_link': 0, 'trunk': 1, 'trunk_link': 1,
        'primary': 2, 'primary_link': 2, 'secondary': 3, 'secondary_link': 3,
        'tertiary': 4, 'tertiary_link': 4}
out_ways, water, lms = [], [], []
for wid, (tags, refs) in ways.items():
    pts = [nodes[r2] for r2 in refs if r2 in nodes]
    nm = tags.get('name', '')
    if any(k in nm for k in ('برج القاهرة', 'ميدان التحرير', 'قلعة صلاح الدين', 'قصر عابدين')) and pts:
        la = sum(p[0] for p in pts) / len(pts); lo = sum(p[1] for p in pts) / len(pts)
        x, z = xy(la, lo)
        if not any(l2[0] == nm for l2 in lms): lms.append([nm, round(x), round(z)])
    h = tags.get('highway')
    if h in KEEP and len(pts) >= 2:
        # outside the core district keep only major roads (size budget)
        mla = sum(p[0] for p in pts) / len(pts); mlo = sum(p[1] for p in pts) / len(pts)
        core = 30.03 <= mla <= 30.078 and 31.198 <= mlo <= 31.262
        if not core and KEEP[h] > 3: continue
        lv = tags.get('layer', '0')
        flat = []
        for la, lo in pts:
            x, z = xy(la, lo); flat += [round(x * 10), round(z * 10)]
        out_ways.append([KEEP[h],
                         1 if tags.get('bridge') in ('yes', 'viaduct') else 0,
                         int(lv) if lv.lstrip('-').isdigit() else 0,
                         nm[:40], flat])
    elif (tags.get('waterway') == 'river' or tags.get('water') == 'river') and len(pts) >= 2:
        flat = []
        for la, lo in pts:
            x, z = xy(la, lo); flat += [round(x * 10), round(z * 10)]
        water.append(flat)  # Nile centerline/bank polylines; rendered as wide ribbons

px, pz = xy(29.9792, 31.1342)  # the Pyramids of Giza
if not any(l2[0] == 'الأهرامات' for l2 in lms):
    lms.append(['الأهرامات', round(px), round(pz)])
seen = set(); tl_out = []
for la, lo in tls:
    x, z = xy(la, lo)
    k = (round(x / 60), round(z / 60))  # cluster signals within ~60m
    if k in seen: continue
    seen.add(k); tl_out.append([round(x), round(z)])
out = {'v': 1, 'lm': lms, 'w': out_ways, 'n': water, 'tl': tl_out}
json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
import os
print('roads:', len(out_ways), 'bridges:', sum(1 for w in out_ways if w[1]),
      'water polys:', len(water), 'landmarks:', lms, 'signals:', len(tl_out))
print('size KB:', os.path.getsize(OUT) // 1024)
