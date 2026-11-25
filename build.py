#!/usr/bin/env python3
"""Rebuild index.html from styles.css and the JS source modules.

index.html is the self-contained page served on GitHub Pages. Its inline
<style> is styles.css and its 10 inline <script> blocks (excluding the
Three.js CDN tag) are, in order:
  physics.js, carbody.js, carspecs.js, audio.js, world.js, fx.js, network.js, roam.js, realmap.js, race.js
This script re-splices those files into index.html. Run it after editing a
module or the CSS:

  python3 build.py            # rewrite index.html in place
  python3 build.py --check    # only verify index.html is in sync (exit 1 if not)
"""
import re, sys

MODULES = ['physics.js', 'carbody.js', 'carspecs.js', 'audio.js',
           'world.js', 'fx.js', 'network.js', 'roam.js', 'realmap.js', 'race.js']

html = open('index.html', encoding='utf8').read()
css = open('styles.css', encoding='utf8').read()
mods = [open(m, encoding='utf8').read() for m in MODULES]

out, n = re.subn(r'<style>\n?.*?</style>',
                 lambda m: '<style>\n' + css + '</style>',
                 html, count=1, flags=re.S)
assert n == 1, 'style block not found'

it = iter(mods)
out, n = re.subn(r'<script>(?! src)\n?.*?</script>',
                 lambda m: '<script>\n' + next(it) + '\n</script>',
                 out, count=len(MODULES), flags=re.S)
assert n == len(MODULES), 'expected %d inline scripts, found %d' % (len(MODULES), n)

if '--check' in sys.argv:
    if out != html:
        sys.exit('index.html is NOT in sync with the source modules')
    print('index.html is in sync with styles.css and the source modules')
else:
    open('index.html', 'w', encoding='utf8').write(out)
    print('index.html rebuilt: %.1f KB' % (len(out.encode('utf8')) / 1024))
