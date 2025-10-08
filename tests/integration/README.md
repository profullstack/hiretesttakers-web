# Integration Tests

This directory contains comprehensive integration tests for TutorLinkup.com.

## Overview

Integration tests verify that different parts of the system work together correctly. These tests cover complete user workflows and service interactions.

## Test Structure

```
tests/integration/
├── README.md                    # This file
├── helpers/
│   └── test-helpers.js         # Utility functions for tests
├── mocks/
│   ├── cryptapi.mock.js        # Mock CryptAPI implementation
│   └── tatum.mock.js           # Mock Tatum API implementation
├── student-journey.test.js     # Complete student workflow tests
├── tutor-journey.test.js       # Complete tutor workflow tests
└── workflows.test.js           # Various service workflow tests
```

## Test Coverage

### Student Journey (6 tests)
- Complete student journey from signup to rating
- Payment failure handling
- Cancellation before payment
- Multiple applications handling
- Deadline enforcement
- Activity history tracking

### Tutor Journey (9 tests)
- Complete tutor journey from application to payment
- Application rejection handling
- Application withdrawal
- Performance metrics tracking
- Test cancellation by student
- Duplicate application prevention
- Leaderboard updates
- Payment delays
- Multi-tier commission calculations

### Service Workflows (21 tests)

#### Homework Help (2 tests)
- Complete homework help workflow
- Urgent request handling

#### Programming Help (2 tests)
- Complete programming task workflow
- Code review requests

#### Assignment Writing (1 test)
- Complete assignment writing workflow

#### Payment Flows (3 tests)
- Commission calculation for different tiers
- Refund handling
- Partial payments

#### Leaderboard (2 tests)
- Leaderboard updates after work completion
- User ranking logic

#### Job Offers (2 tests)
- Complete job offer process
- Job offer rejection

#### Messaging (2 tests)
- Message thread handling
- Message read status

#### Referrals (2 tests)
- Referral tracking and bonuses
- Tiered referral bonuses

#### Notifications (2 tests)
- Notification delivery for key events
- Notification preferences

#### Resources (3 tests)
- Resource access control
- Download tracking
- Resource ratings

## Running Tests

### Run all integration tests
```bash
pnpm test tests/integration
```

### Run specific test file
```bash
pnpm test tests/integration/student-journey.test.js
pnpm test tests/integration/tutor-journey.test.js
pnpm test tests/integration/workflows.test.js
```

### Run with coverage
```bash
pnpm test:coverage tests/integration
```

### Run in watch mode
```bash
pnpm test:watch tests/integration
```

## Mock APIs

### CryptAPI Mock
Located in `mocks/cryptapi.mock.js`, provides:
- Payment address creation
- Payment simulation
- Payment status tracking
- Callback simulation

### Tatum Mock
Located in `mocks/tatum.mock.js`, provides:
- Wallet generation
- Balance checking
- Transaction sending
- Transaction confirmation
- Fee estimation

## Test Helpers

The `helpers/test-helpers.js` file provides utility functions:

- `createTestUser()` - Create test users with authentication
- `createTestSession()` - Generate test sessions
- `cleanupTestData()` - Clean up after tests
- `waitFor()` - Wait for async conditions
- `createMock*()` - Create various mock data objects
- `advanceTime()` - Simulate time passage

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Cleanup**: All tests clean up after themselves using `afterEach`
3. **Mocking**: External APIs are mocked to avoid real API calls
4. **Assertions**: Clear, specific assertions for each test case
5. **Coverage**: Tests cover happy paths and error scenarios

## Adding New Tests

When adding new integration tests:

1. Create test file in `tests/integration/`
2. Import necessary helpers and mocks
3. Use `describe` blocks to group related tests
4. Use `beforeEach` for setup and `afterEach` for cleanup
5. Write clear test descriptions
6. Test both success and failure scenarios
7. Update this README with new test coverage

## Test Results

Last run: All 36 tests passing ✓

- Student Journey: 6/6 passing
- Tutor Journey: 9/9 passing
- Service Workflows: 21/21 passing

## Continuous Integration

These tests run automatically on:
- Every commit to main branch
- Every pull request
- Scheduled nightly builds

## Troubleshooting

### Tests failing locally
1. Ensure all dependencies are installed: `pnpm install`
2. Check Node.js version: `node --version` (should be 20+)
3. Clear test cache: `pnpm test --clearCache`

### Mock API issues
1. Check mock implementations in `mocks/` directory
2. Verify mock state is reset in `afterEach` hooks
3. Review mock method signatures match real APIs

### Timeout issues
1. Increase timeout in test file: `it('test', async () => {...}, 10000)`
2. Check for unresolved promises
3. Verify cleanup is happening properly

## Contributing

When contributing integration tests:
1. Follow existing test patterns
2. Keep tests focused and atomic
3. Use descriptive test names
4. Add comments for complex logic
5. Update this README