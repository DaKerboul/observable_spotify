import sqlite3
conn = sqlite3.connect('spotify_analytics_compact.sqlite3')
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in cur.fetchall()]
print('TABLES:', tables)
for t in tables:
    cols = [d[0] for d in conn.execute('PRAGMA table_info(' + t + ')').fetchall()]
    print(t, '->', cols)
    row = conn.execute('SELECT * FROM ' + t + ' LIMIT 2').fetchall()
    print('  sample:', row)
