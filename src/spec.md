# Specification

## Summary
**Goal:** Fix admin authorization and implement manual payment gate with Zelle verification workflow.

**Planned changes:**
- Fix admin page authorization to properly register and verify the admin Principal ID on first visit
- Block sign-in functionality for users without 'Paid' status and display error message "No sign in without up to date payment"
- Add user management interface to admin page showing all registered users with toggle controls to mark users as Paid/Unpaid

**User-visible outcome:** Admin can access the admin panel after signing in, manually toggle users to 'Paid' status after receiving Zelle payments, and only users marked as 'Paid' can sign in to the application.
