# Development Prompts for HireTestTakers.com

Use these prompts to continue development in focused sessions. Each prompt is designed to build one complete feature area with TDD.

**Status:** Core features (Prompts 1-9) are complete. Integration & E2E Testing (Prompt 10) is complete. UI Polish & Components (Prompt 11) is complete. Remaining work: Prompt 12.

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

11. 🎨 UI Polish & Components (Prompt 11) - **NEXT**
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
- "Core features (Prompts 1-9) and Integration Testing (Prompt 10) are complete"
- "Follow existing code patterns"
- "Use TDD, KISS, DRY principles"
- "Reference PRD-v2.md for full requirements"

---

## 🎯 Quick Start for Next Session

**Prompt for next session:**

```
Continue building HireTestTakers.com. Core features (Prompts 1-9) and Integration Testing (Prompt 10) are complete.

Next task: Build UI Polish & Components (Prompt 11).

[Paste Prompt 11 from PROMPTS.md]

Follow the existing code patterns from:
- tests/integration/ (integration test style)
- src/lib/components/ (component style)
- Keep code DRY and KISS
- Reference PRD-v2.md for requirements
```

---

**Each prompt is designed to be a focused 1-3 hour development session!**