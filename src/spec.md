# Specification

## Summary
**Goal:** Refocus the app into an NFL Combine performance tracker that works immediately in guest mode, supports full drill/measurement logging, shows history/trends and benchmark comparisons, and enables shareable/publishable Combine result cards.

**Planned changes:**
- Add a Guest (local only) mode with clear UI labeling and localStorage persistence, alongside existing Internet Identity sign-in.
- Implement a Combine entry flow for standard NFL Combine drills and measurements (40-yard dash with splits if provided, vertical, broad, bench reps, 20-yard shuttle, 3-cone, and measurements like height/weight/wingspan(or arm length)/hand size), including validation, timestamp/date, and optional notes.
- Add Combine history list and entry detail views, plus simple drill-specific trend charts over time (at least 40-yard dash, vertical jump, bench reps), working for both guest and signed-in data sources.
- Display benchmark reference values/ranges next to drills and indicate Above/Near/Below using accessible text.
- Add sharing mode: a “Combine Card” view for an entry suitable for screenshots; for signed-in users, support publishing/unpublishing an entry and generating a stable public share URL and a simple public feed/view.
- Update navigation, landing, and branding to be Combine-focused (Dashboard, New Entry, History, Share/Published) and deprioritize existing recovery-related pages; ensure all user-facing text is in English.
- Extend the Motoko backend to store per-user Combine entries and publicly readable published entries, with access control and upgrade-safe state/migration for new storage.

**User-visible outcome:** Users can track NFL Combine performance either as a signed-in user (synced to the backend) or as “Guest (local only)” (saved in the browser), review history and trends, compare results to benchmarks, and generate shareable Combine Cards—with signed-in users able to publish entries for public viewing via share links.
