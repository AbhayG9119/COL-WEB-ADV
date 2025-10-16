# TODO: Debug /api/users Endpoint Errors

## Current Status
- Backend server running
- Admin user exists in DB
- JWT token valid
- Errors: 403 Forbidden and 500 Internal Server Error on GET /api/users

## Steps to Complete
- [x] Verify logged-in user's role (should be 'admin')
- [x] Check database connection and model accessibility
- [x] Test /api/users endpoint directly via browser or curl
- [x] Add logging to auth.js and userController.js for debugging
- [ ] Use browser_action to simulate request and check console logs
- [ ] Identify root cause (403: not admin, 500: DB query failure)
- [ ] Fix the issue (update user role or fix DB queries)
- [ ] Test the fix
