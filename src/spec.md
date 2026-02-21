# Specification

## Summary
**Goal:** Add payment-gated access control with admin management to restrict app access to paid users only.

**Planned changes:**
- Create an admin page at /admin that displays all users with their payment status
- Add toggle controls on admin page to mark users as paid or unpaid
- Implement backend storage for user payment status (defaults to unpaid for new users)
- Block unpaid users after Internet Identity authentication with contact message
- Enforce payment check on every app load for protected routes

**User-visible outcome:** Unpaid users will be blocked after signing in with a message to contact the admin. Admins can view all users and toggle their payment status to grant or revoke access.
