#!/usr/bin/env bash
# Mapstone Supabase smoke test
# Usage:
#   SB_URL=https://xxxx.supabase.co SB_ANON=eyJ... bash scripts/test-supabase.sh
set -euo pipefail
URL="${SB_URL:-https://mffysunppwqscbljooda.supabase.co}"
KEY="${SB_ANON:-}"
CODE="${ACCESS_CODE:-mapstone-demo}"

if [ -z "$KEY" ]; then
  echo "SB_ANON (anon public key) 가 필요합니다. Settings > API > anon public"
  exit 2
fi

hdr=(-H "apikey: $KEY" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -H "Prefer: return=representation")

echo "== GET table =="
curl -sS "${hdr[@]}" "$URL/rest/v1/mapstone_boards?select=access_code,updated_at&limit=5" ; echo

echo "== UPSERT demo row =="
curl -sS -X POST "${hdr[@]}" \
  -H "Prefer: resolution=merge-duplicates,return=representation" \
  "$URL/rest/v1/mapstone_boards" \
  -d "{\"access_code\":\"$CODE\",\"payload\":{\"title\":\"demo\",\"cfg\":{\"months\":4},\"rows\":[],\"items\":[]},\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" ; echo

echo "== GET demo row =="
curl -sS "${hdr[@]}" "$URL/rest/v1/mapstone_boards?access_code=eq.$CODE&select=access_code,payload,updated_at" ; echo
