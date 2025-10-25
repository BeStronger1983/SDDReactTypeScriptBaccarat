<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Added new principle: Documentation Language Standards
- Modification: Added mandatory language requirement (zh-TW for specs/docs, English for constitution)
- Templates requiring updates: ✅ All templates will enforce zh-TW for specifications and plans
- Follow-up TODOs: None
-->

# React Live Casino Constitution

## Core Principles

### I. Code Quality Excellence

**All code MUST meet the following non-negotiable quality standards:**

- **Type Safety**: TypeScript MUST be used with strict mode enabled. No `any` types unless explicitly justified and documented.
- **Code Reviews**: All code changes MUST be peer-reviewed before merging. Reviews MUST verify adherence to all constitutional principles.
- **Linting & Formatting**: Code MUST pass ESLint and Prettier checks without warnings. Formatting rules are enforced automatically.
- **Documentation**: Public APIs, complex logic, and business rules MUST be documented with JSDoc comments.
- **Clean Code**: Functions MUST be single-purpose, readable, and maintainable. Cyclomatic complexity > 10 requires refactoring.
- **Version Control**: Commits MUST be atomic and have descriptive messages following Conventional Commits format.

**Rationale**: High-quality code reduces bugs, improves maintainability, and enables confident refactoring. Type safety catches errors at compile-time rather than runtime in production.

### II. Comprehensive Testing Standards (NON-NEGOTIABLE)

**Testing is mandatory and MUST follow Test-Driven Development (TDD) principles:**

- **Test Coverage**: Minimum 80% code coverage for all new features. Critical paths (payment, betting, authentication) MUST have 95%+ coverage.
- **Test Pyramid**: Unit tests (70%) > Integration tests (20%) > E2E tests (10%).
- **TDD Workflow**: Tests written first → Approved by team → Tests fail → Implementation → Tests pass → Refactor.
- **Test Quality**: Tests MUST be isolated, deterministic, fast, and readable. No shared state between tests.
- **Integration Tests Required For**:
  - API contract changes
  - Real-time WebSocket communication
  - Payment processing flows
  - Game state synchronization
  - Authentication & authorization flows
- **E2E Tests Required For**:
  - Critical user journeys (signup, deposit, play, withdraw)
  - Cross-browser compatibility verification
  - Mobile responsive behavior

**Rationale**: Casino applications handle real money and require absolute reliability. TDD ensures requirements are clear before implementation and provides a safety net for refactoring.

### III. User Experience Consistency

**User experience MUST be consistent, accessible, and intuitive across all platforms:**

- **Design System**: All UI components MUST use the shared design system with consistent spacing, typography, colors, and animations.
- **Accessibility**: WCAG 2.1 Level AA compliance is MANDATORY. All interactive elements MUST be keyboard accessible and screen-reader friendly.
- **Responsive Design**: All interfaces MUST work seamlessly on mobile (320px+), tablet (768px+), and desktop (1024px+).
- **Performance Feedback**: User actions MUST receive immediate visual feedback (loading states, success/error messages, optimistic updates).
- **Error Handling**: All error states MUST display user-friendly messages with clear recovery actions. Never expose technical stack traces.
- **Internationalization**: All user-facing text MUST be externalized and translation-ready. Support for multiple currencies and locales.

**Rationale**: Consistent UX builds user trust and reduces cognitive load. Accessibility is both a legal requirement and moral imperative. Mobile-first ensures broad market reach.

### IV. Performance Requirements

**Application performance MUST meet strict benchmarks for optimal user experience:**

- **Initial Load**: First Contentful Paint (FCP) < 1.5s, Largest Contentful Paint (LCP) < 2.5s on 3G networks.
- **Interactivity**: Time to Interactive (TTI) < 3.5s. First Input Delay (FID) < 100ms.
- **Bundle Size**: JavaScript bundles MUST be code-split. Initial bundle < 200KB gzipped. Lazy-load non-critical features.
- **API Response Time**: 95th percentile API response time < 500ms. Critical APIs (betting, balance) < 200ms.
- **Real-time Latency**: WebSocket message latency < 100ms for game state updates. Handle network interruptions gracefully.
- **Memory Management**: No memory leaks. Maximum heap size growth < 10MB per hour during active gameplay.
- **Rendering Performance**: Maintain 60 FPS during animations. Virtualize long lists. Debounce/throttle expensive operations.

**Rationale**: Casino users expect instant responsiveness. Slow performance leads to user frustration, abandoned sessions, and lost revenue. Performance is a feature, not an afterthought.

### V. Documentation Language Standards

**All project documentation MUST adhere to strict language requirements:**

- **Specifications**: All specification documents (`.specify/specs/*.md`) MUST be written in Traditional Chinese (zh-TW).
- **Plans**: All planning documents (`.specify/plans/*.md`) MUST be written in Traditional Chinese (zh-TW).
- **User-Facing Documentation**: All user manuals, help pages, and end-user documentation MUST be written in Traditional Chinese (zh-TW).
- **Constitution Exception**: This constitution document (`.specify/memory/constitution.md`) MUST remain in English to ensure universal technical standards comprehension.
- **Code Comments**: Technical code comments MAY be in English for international developer collaboration. JSDoc documentation MUST be in English.
- **Commit Messages**: MUST follow Conventional Commits format in English (e.g., `feat:`, `fix:`).
- **Pull Request Descriptions**: MUST be in English for code review purposes.

**Rationale**: Traditional Chinese as the primary language for specifications and plans ensures alignment with the target market (Taiwan/Hong Kong) and reduces misunderstandings in business requirements. English constitution maintains technical precision and enables international developer onboarding.

## Security & Compliance Standards

**Security and regulatory compliance are paramount:**

- **Authentication**: Multi-factor authentication MUST be supported. Session management MUST follow OWASP best practices.
- **Data Protection**: All sensitive data MUST be encrypted at rest and in transit (TLS 1.3+). PII handling MUST comply with GDPR/CCPA.
- **Input Validation**: All user input MUST be validated and sanitized server-side. Prevent XSS, CSRF, SQL injection.
- **Audit Logging**: All financial transactions, game outcomes, and administrative actions MUST be logged immutably.
- **Dependency Security**: Dependencies MUST be scanned for vulnerabilities. Critical vulnerabilities MUST be patched within 48 hours.
- **Responsible Gaming**: MUST implement deposit limits, self-exclusion, and reality checks as per regulatory requirements.

**Rationale**: Security breaches can result in financial loss, legal liability, and permanent reputation damage. Compliance violations can lead to license revocation.

## Development Workflow & Quality Gates

**All changes MUST pass through defined quality gates:**

1. **Local Development**:
   - Pre-commit hooks MUST run linting, type-checking, and unit tests
   - Developers MUST test changes locally across different browsers
   
2. **Pull Request Requirements**:
   - All tests MUST pass (unit, integration, E2E)
   - Code coverage MUST not decrease
   - At least one peer approval required
   - No merge conflicts
   - Branch naming: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`

3. **CI/CD Pipeline**:
   - Automated testing on multiple Node versions
   - Security vulnerability scanning
   - Performance budgets enforcement
   - Accessibility testing with axe-core
   - Visual regression testing for UI changes

4. **Deployment Gates**:
   - Staging deployment MUST precede production by at least 24 hours
   - Product owner approval required for feature releases
   - Rollback plan documented for major changes
   - Feature flags for gradual rollout of risky changes

**Rationale**: Systematic quality gates prevent defects from reaching production and maintain codebase health over time.

## Governance

This constitution supersedes all other development practices and policies. All team members MUST understand and comply with these principles.

**Amendment Process**:
- Constitution changes require team consensus (80%+ agreement)
- Proposed amendments MUST be documented with rationale
- Version MUST be bumped according to semantic versioning:
  - MAJOR: Breaking changes to core principles
  - MINOR: New principles or significant expansions
  - PATCH: Clarifications, typo fixes, non-semantic changes
- Migration plan required for breaking changes

**Compliance & Enforcement**:
- Code reviews MUST verify constitutional compliance
- Violations MUST be addressed before merge
- Repeated violations require team discussion and remediation
- Constitution MUST be reviewed quarterly for relevance

**Continuous Improvement**:
- Principles MUST evolve with technology and business needs
- Team MUST retrospect on principle effectiveness
- Metrics MUST be tracked to measure adherence (test coverage, performance budgets, accessibility scores)

**Version**: 1.1.0 | **Ratified**: 2025-10-25 | **Last Amended**: 2025-10-25
