# TODO: Display All Employees on Admin Dashboard

## Completed Tasks
- [x] Analyze AdminDashboard.jsx and identify endpoint mismatch
- [x] Add new GET endpoint '/api/admin/employees' in Backend/main.py
- [x] Endpoint queries users table for role='employee'
- [x] Returns {"employees": [list of employee data]} format
- [x] Add missing '/api/admin/profile' endpoint for admin profile fetching
- [x] Add '/api/admin/profile' PUT endpoint for profile updates
- [x] Add '/api/admin/change-password' POST endpoint for password changes
- [x] Add '/api/admin/reset-password' POST endpoint for admin to reset employee passwords
- [x] Implementation complete - admin dashboard should now display all employees and settings should work

## Summary
Fixed multiple missing endpoints:
1. '/api/admin/employees' - displays all employees in admin dashboard
2. '/api/admin/profile' - fetches admin profile data for settings tab
3. '/api/admin/profile' (PUT) - updates admin profile information
4. '/api/admin/change-password' - changes admin password with validation
5. '/api/admin/reset-password' - allows admin to reset employee passwords

The admin dashboard employees tab and settings tab should now work properly.
