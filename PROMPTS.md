# Development Prompts for HireTestTakers.com

Use these prompts to continue development in focused sessions. Each prompt is designed to build one complete feature area with TDD.

**Status:** Core features (Prompts 1-8) are complete. Remaining work: Prompts 9-12.

---

## 🔔 Prompt 9: Notification & Alert System

```
Build a comprehensive notification system for all user activities using TDD.

Requirements:
- Real-time notifications
- Email notifications
- In-app notifications
- Notification preferences
- Notification history
- Push notifications (future)

Database Schema:
- Add notifications table
- Add notification_preferences table
- Add notification_types table
- Add notification_templates table

Features to implement:
1. Create notifications for key events
2. Send email notifications
3. Display in-app notifications
4. Mark notifications as read
5. Configure notification preferences
6. Batch notifications
7. Notification history

Notification Types:
- New application received
- Application approved/rejected
- Service completed
- Payment received
- New message
- Rating received
- Revision requested
- Job offer received
- Referral bonus earned

Service Layer (src/lib/services/notification.js):
- createNotification(userId, type, data)
- getNotifications(userId, filters)
- markAsRead(notificationId)
- markAllAsRead(userId)
- getUnreadCount(userId)
- updatePreferences(userId, preferences)
- sendEmailNotification(userId, type, data)

API Routes:
- GET /api/notifications - Get notifications
- GET /api/notifications/unread-count - Get unread count
- PUT /api/notifications/[id]/read - Mark as read
- PUT /api/notifications/mark-all-read - Mark all read
- GET /api/notifications/preferences - Get preferences
- PUT /api/notifications/preferences - Update preferences

UI Components:
- NotificationBell.svelte
- NotificationList.svelte
- NotificationItem.svelte
- NotificationPreferences.svelte
- NotificationToast.svelte

Pages:
- /notifications - Notification center
- /notifications/preferences - Notification settings

Follow TDD:
1. Write notification service tests
2. Implement notification system
3. Build email integration
4. Create preference system
5. Build UI components
6. Test real-time updates
7. Test email delivery

Deliverables:
- Notification system
- Email integration
- Preference management
- Real-time updates
- All tests passing
```

---

## 🧪 Prompt 10: Integration & E2E Testing

```
Build comprehensive integration and end-to-end tests for HireTestTakers.com.

Requirements:
- Test complete user workflows
- Test API integrations
- Test payment flows
- Follow TDD principles

Test scenarios:
1. Complete student journey (signup → request service → hire → pay → rate)
2. Complete tutor journey (signup → apply → complete → get paid)
3. Homework help workflow
4. Programming help workflow
5. Assignment writing workflow
6. Payment flow with commission split
7. Leaderboard updates
8. Job offer workflow
9. Message exchange
10. Referral system
11. Notification delivery
12. Resource access

Deliverables:
- Integration tests in tests/integration/
- E2E tests for critical paths
- API integration tests
- Database integration tests
- Mock external APIs (CryptAPI, Tatum)

Tools:
- Mocha for test runner
- Chai for assertions
- Supertest for API testing (if needed)
```

---

## 🎨 Prompt 11: UI Polish & Components

```
Build reusable UI components and polish the interface for HireTestTakers.com.

Requirements:
- Consistent design system
- Reusable components
- Mobile responsive
- Accessibility (ARIA labels, keyboard nav)
- Follow DRY principles

Components to build:
1. Button (primary, secondary, outline, danger)
2. Input (text, email, password, number)
3. Select (single, multi-select)
4. Modal/Dialog
5. Alert/Toast notifications
6. Loading spinner
7. Pagination
8. Table
9. Card
10. Badge
11. Avatar
12. Navigation header
13. Footer
14. Sidebar
15. File upload
16. Code editor
17. Rich text editor

Deliverables:
- Component library in src/lib/components/
- Component tests
- Storybook (optional)
- Design system documentation
- Responsive layouts
- Dark mode (optional)

Use:
- Svelte 5 features
- CSS variables for theming
- Semantic HTML
```

---

## 🚀 Prompt 12: Production Deployment

```
Deploy HireTestTakers.com to production on Railway.

Requirements:
- Use existing Railway configuration
- Set up persistent volumes
- Configure all environment variables
- Run database migrations
- Test in production

Steps:
1. Install Railway CLI
2. Initialize Railway project
3. Create persistent volumes (db, uploads)
4. Set all environment variables
5. Deploy application
6. Run migrations
7. Test all features
8. Set up monitoring
9. Configure custom domain (optional)
10. Set up CI/CD (optional)

Use existing:
- railway.json and railway.toml
- DEPLOYMENT.md guide
- Database migrations in supabase/migrations/

Verify:
- All tests passing
- Build successful
- Database connected
- Volumes mounted
- All features working
```

---

## 📊 Usage Instructions

### How to Use These Prompts:

1. **Copy the prompt** for the feature you want to build
2. **Start a new Roo session** (or continue in current)
3. **Paste the prompt** as your task
4. **Roo will build** the feature with TDD
5. **Repeat** for each feature group

### Remaining Work:

9. 🔔 Notification System (Prompt 9) - **NEXT**
10. 🧪 Integration & E2E Testing (Prompt 10)
11. 🎨 UI Polish & Components (Prompt 11)
12. 🚀 Production Deployment (Prompt 12)

### Tips:

- **One feature at a time** - Focus on completing each fully
- **Follow TDD** - Tests first, then implementation
- **Keep it DRY** - Reuse existing utilities and components
- **KISS** - Simple, focused code
- **Test often** - Run `pnpm test` frequently
- **Build often** - Run `pnpm run build` to catch errors

### Context to Provide:

When starting a new session, mention:
- "Continue HireTestTakers.com development"
- "Core features (Prompts 1-8) are complete"
- "Follow existing code patterns"
- "Use TDD, KISS, DRY principles"
- "Reference PRD-v2.md for full requirements"

---

## 🎯 Quick Start for Next Session

**Prompt for next session:**

```
Continue building HireTestTakers.com. Core features (Prompts 1-8) are complete.

Next task: Build the Notification & Alert System using TDD (Prompt 9).

[Paste Prompt 9 from PROMPTS.md]

Follow the existing code patterns from:
- tests/services/referral.test.js (test style)
- src/lib/services/referral.js (service style)
- Keep code DRY and KISS
- Reference PRD-v2.md for requirements
```

---

**Each prompt is designed to be a focused 1-3 hour development session!**