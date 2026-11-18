"""Stamp a new cache-busting version on every JS/CSS reference so phones fetch fresh files after a deploy.
Usage: python3 tools/bump-version.py"""
import re, time, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
v = time.strftime('%Y%m%d%H%M%S')
for f in [root / 'index.html', *root.glob('js/**/*.js')]:
    s = f.read_text()
    s2 = re.sub(r"""((?:from\s+|import\s*\(\s*|src=|href=)['"](?:\./|\.\./|js/|css/)[^'"?]+\.(?:js|css))(\?v=\w+)?(['"])""", rf"\1?v={v}\3", s)
    if s2 != s: f.write_text(s2)
print('version', v)
