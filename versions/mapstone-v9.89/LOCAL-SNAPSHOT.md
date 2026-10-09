# MapStone v9.89 local snapshot

Saved from Git commit `7ca8223` (release `989`) on 2026-10-09.

This folder contains the v9.89 sources and rebuilt distribution. The snapshot was saved while the main checkout was v0.9.22. The main product was subsequently restored to v9.89 at the user's request; later revisions remain recoverable in Git history.

Validation: `npm run build` succeeded; `npm test` passed all 163 tests.

Run from this folder:

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

Open http://127.0.0.1:4174/index.html. Port 4174 keeps browser-local data separate from the current product on port 4173.
