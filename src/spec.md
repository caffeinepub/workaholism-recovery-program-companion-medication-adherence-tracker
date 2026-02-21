# Specification

## Summary
**Goal:** Expand the NFL Combine Tracker to capture all standard combine statistics and display them in a comprehensive public leaderboard with numerical rankings.

**Planned changes:**
- Add fields for all NFL Combine measurements and drills (40-yard dash, bench press reps, vertical jump, broad jump, 3-cone drill, 20-yard shuttle, 60-yard shuttle, height, weight, arm length, hand size, wingspan) to the backend data model
- Update the entry form to include input fields for all combine statistics with validation
- Display all tracked statistics in entry detail and public entry views
- Enhance the Published page leaderboard to show usernames and rank entries numerically (1, 2, 3, etc.) based on the selected sorting metric
- Update benchmark comparison to support all newly tracked statistics with performance level indicators
- Extend guest mode localStorage to support all new combine statistics

**User-visible outcome:** Users can record complete NFL Combine profiles with all standard measurements and drills, view comprehensive statistics for each entry, and see a public leaderboard that ranks all entries numerically from best to worst with usernames displayed.
