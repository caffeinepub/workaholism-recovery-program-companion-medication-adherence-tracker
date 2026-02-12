# Specification

## Summary
**Goal:** Add clear, English-only disclaimers about non-legal/non-religious guidance and no guarantees, plus a new “Staying Safe & Out of Trouble” area with a user-editable personal plan.

**Planned changes:**
- Expand the existing disclaimers UI to include three explicit sections: Not Legal Advice, Not Religious/Spiritual Authority, and No Guarantees/Limitations (rejecting “perfect/100%/eternal” compliance promises), and show them wherever disclaimers are currently rendered.
- Add a new authenticated route/page: “Staying Safe & Out of Trouble,” discoverable from the main app navigation, containing a short pause checklist, grounding steps, and a prominent link/button to the existing `/crisis-help` page.
- Add a per-user “commitments & boundaries” plan editor on the new page, with save success/failure feedback.
- Implement Motoko backend authenticated, caller-scoped read/write methods to persist the plan privately per signed-in principal.

**User-visible outcome:** Signed-in users can open a new “Staying Safe & Out of Trouble” page to follow practical, non-judgmental self-management steps, jump to Crisis/Help, and save/update a private personal commitments & boundaries plan—alongside clearer disclaimers stating the app is not legal or religious authority and cannot guarantee outcomes.
