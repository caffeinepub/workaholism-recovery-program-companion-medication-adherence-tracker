# Specification

## Summary
**Goal:** Build core NFL Combine Tracker functionality with admin payment management, authentication gates, user contact cards, combine entry tracking, and a basic leaderboard.

**Planned changes:**
- Add admin panel page displaying all users with payment status toggle switches (paid/unpaid)
- Implement authentication gate blocking unpaid users from login with payment instructions error message
- Add landing page with Zelle payment instructions (Matt Rossin, phone 3527348440) and contact information (Instagram @thenewbruce1, phone/email details)
- Store admin principal ID (i67ts-e55ut-cg7iv-w4qa6-f63qo-pgevo-7zqec-cevgk-5nm7d-xjryz-mae) for access control
- Create Contact Card page for users to enter real name, NFL Combine Tracker username, and optional contact information
- Create New Entry page for users to input NFL Combine drill statistics with notes field
- Implement basic LeaderBoard page displaying all users ranked by combine performance from #1 down

**User-visible outcome:** Users see payment instructions and contact info on landing page. Unpaid users cannot login and receive payment error message. Paid users can create contact cards, submit combine entries with notes, and view ranked leaderboard. Admin can toggle any user's payment status in admin panel.
