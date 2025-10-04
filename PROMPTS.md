# Development Prompts for HireTestTakers.com

Use these prompts to continue development in focused sessions. Each prompt is designed to build one complete feature area with TDD.

---

## 🧪 Prompt 9: Integration & E2E Testing

```
Build comprehensive integration and end-to-end tests for HireTestTakers.com.

Requirements:
- Test complete user workflows
- Test API integrations
- Test payment flows
- Follow TDD principles

Test scenarios:
1. Complete hirer journey (signup → post test → hire → pay)
2. Complete test taker journey (signup → apply → complete → get paid)
3. Payment flow with commission split
4. Leaderboard updates
5. Job offer workflow
6. Message exchange
7. Avatar upload

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

## 🎨 Prompt 10: UI Polish & Components

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

## 🚀 Prompt 11: Production Deployment

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

### Recommended Order:

1. ✅ Authentication (COMPLETE)
2. 👤 Profiles & Onboarding (Prompt 2)
3. 📝 Test Listings (Prompt 3)
4. 📋 Applications (Prompt 4)
5. ✅ Messaging (COMPLETE)
6. 💰 Payments UI (Prompt 6)
7. 🏆 Leaderboard (Prompt 7)
8. 💼 Job Offers (Prompt 8)
9. 🧪 Testing (Prompt 9)
10. 🎨 UI Polish (Prompt 10)
11. 🚀 Deployment (Prompt 11)

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
- "Authentication is complete (see PROGRESS.md)"
- "Follow existing code patterns"
- "Use TDD, KISS, DRY principles"

---

## 🎯 Quick Start for Next Session

**Prompt for next session:**

```
Continue building HireTestTakers.com. Authentication is complete.

Next task: Build the user profiles and onboarding system using TDD.

[Paste Prompt 2 from PROMPTS.md]

Follow the existing code patterns from:
- tests/services/auth.test.js (test style)
- src/lib/services/auth.js (service style)
- Keep code DRY and KISS
```

---

**Each prompt is designed to be a focused 1-2 hour development session!**