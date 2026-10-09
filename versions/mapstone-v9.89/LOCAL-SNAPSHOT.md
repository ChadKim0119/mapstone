# MapStone v9.89 local snapshot

Saved from Git commit `7ca8223` (release `989`) on 2026-10-09.

This folder contains the v9.89 sources and rebuilt distribution. This historical snapshot remains v9.89. The main product uses the newer code from cc4d1b5, including the updated help guide and seven actual UI captures (display version v0.9.22).

Validation: `npm run build` succeeded; `npm test` passed all 163 tests.

Run from this folder:

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

Open http://127.0.0.1:4174/index.html. Port 4174 keeps browser-local data separate from the current product on port 4173.
