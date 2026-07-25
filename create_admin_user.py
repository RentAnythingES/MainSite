import os
import json
import urllib.request
from pathlib import Path

root = Path(__file__).resolve().parent
env_path = root / '.env.local'
raw = env_path.read_text(encoding='utf-8')
obj = {}
for line in raw.splitlines():
    line = line.strip()
    if not line or line.startswith('#') or '=' not in line:
        continue
    k, v = line.split('=', 1)
    obj[k] = v

url = obj.get('NEXT_PUBLIC_SUPABASE_URL')
key = obj.get('SUPABASE_SERVICE_ROLE_KEY')
if not url or not key:
    raise SystemExit('Missing Supabase env values')

payload = {
    'email': 'admin@rentanything.es',
    'password': 'RentAnything2026!',
    'email_confirm': True,
    'app_metadata': {'role': 'admin'},
    'user_metadata': {'email_verified': True}
}
body = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(
    f'{url}/auth/v1/admin/users',
    data=body,
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {key}',
        'apikey': key,
    },
    method='POST'
)
try:
    with urllib.request.urlopen(req, timeout=60) as r:
        print('status', r.status)
        print(r.read().decode('utf-8', 'ignore'))
except Exception as e:
    print('ERROR', type(e).__name__, e)
    if hasattr(e, 'read'):
        try:
            print(e.read().decode('utf-8', 'ignore'))
        except Exception:
            pass
