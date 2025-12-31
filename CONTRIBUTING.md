# Contributing to Evidential Capture App

## 🔒 Restricted Access

This is a **proprietary government application** with restricted access. Contributions are limited to authorized developers only.

---

## 👥 Who Can Contribute?

Only the following individuals may contribute to this project:

- ✅ Authorized government developers
- ✅ Contracted development team members
- ✅ Security-cleared personnel with written authorization

**Unauthorized contributions will not be accepted.**

---

## 📋 Before You Start

1. **Security Clearance**: Ensure you have the appropriate security clearance level
2. **Authorization**: Obtain written authorization from the project lead
3. **NDA**: Sign the Non-Disclosure Agreement if not already done
4. **Access**: Request repository access through official channels

---

## 🔄 Development Workflow

### 1. Branch Naming Convention

Use the following format for branch names:

```
<type>/<ticket-number>-<brief-description>

Examples:
feature/ECA-123-add-hash-verification
bugfix/ECA-456-fix-screenshot-capture
hotfix/ECA-789-security-patch
```

**Types:**
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions or modifications

### 2. Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(screenshot): add SHA-256 hash generation

Implemented cryptographic hash generation for screenshots
to ensure evidence integrity and tamper detection.

Refs: ECA-123
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `security` - Security improvements

### 3. Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/ECA-123-description
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow coding standards
   - Add tests for new features

3. **Test Thoroughly**
   - Run all existing tests
   - Add new tests for your changes
   - Test on both Android and iOS
   - Verify security implications

4. **Submit Pull Request**
   - Fill out the PR template completely
   - Reference the ticket number
   - Describe changes in detail
   - Add screenshots/videos if UI changes

5. **Code Review**
   - Address all review comments
   - Make requested changes
   - Re-request review after updates

6. **Approval & Merge**
   - Requires approval from at least 2 reviewers
   - Security review for sensitive changes
   - Merge only after all checks pass

---

## 💻 Coding Standards

### JavaScript/TypeScript

- **Style Guide**: Follow Airbnb JavaScript Style Guide
- **Linting**: Use ESLint with project configuration
- **Formatting**: Use Prettier for consistent formatting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### React Native Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Optimize performance (useMemo, useCallback)
- Follow React Native performance guidelines
- Use TypeScript for type safety

### Backend (Node.js)

- Use async/await instead of callbacks
- Implement proper error handling
- Validate all inputs
- Use middleware for common functionality
- Follow RESTful API conventions

---

## 🔐 Security Guidelines

### Critical Security Rules

1. **Never commit sensitive data**
   - No API keys, passwords, or tokens
   - Use environment variables
   - Check .gitignore before committing

2. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database operations
   - Prevent SQL/NoSQL injection

3. **Authentication & Authorization**
   - Implement proper JWT validation
   - Check user permissions for all operations
   - Use secure password hashing (bcrypt)

4. **Data Encryption**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement proper key management

5. **Security Testing**
   - Test for common vulnerabilities
   - Perform security audits
   - Report security issues immediately

### Reporting Security Vulnerabilities

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email security@[government-domain].gov
2. Include detailed description
3. Provide steps to reproduce
4. Wait for acknowledgment before disclosure

---

## 🧪 Testing Requirements

### Required Tests

1. **Unit Tests**
   - Test individual functions
   - Mock external dependencies
   - Aim for >80% code coverage

2. **Integration Tests**
   - Test API endpoints
   - Test database operations
   - Test authentication flows

3. **End-to-End Tests**
   - Test complete user workflows
   - Test on real devices
   - Test both Android and iOS

### Running Tests

```bash
# Backend tests
cd BACKEND
npm test

# Frontend tests
cd FRONTEND
npm test

# Run with coverage
npm run test:coverage
```

---

## 📝 Documentation Requirements

All contributions must include:

1. **Code Comments**
   - Document complex logic
   - Explain why, not what
   - Use JSDoc for functions

2. **README Updates**
   - Update if adding new features
   - Document new environment variables
   - Update setup instructions if needed

3. **API Documentation**
   - Document new endpoints
   - Include request/response examples
   - Specify authentication requirements

---

## 🚀 Release Process

### Version Numbering

Follow Semantic Versioning (SemVer):

```
MAJOR.MINOR.PATCH

Example: 1.2.3
```

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version number bumped
- [ ] Release notes prepared
- [ ] Stakeholder approval obtained

---

## 📞 Getting Help

### Internal Resources

- **Project Lead**: [Name] - [email]
- **Technical Lead**: [Name] - [email]
- **Security Team**: security@[domain].gov
- **Documentation**: [Internal Wiki URL]

### Communication Channels

- **Slack**: #evidential-app-dev
- **Email**: dev-team@[domain].gov
- **Issue Tracker**: [Internal System URL]

---

## ⚖️ Legal & Compliance

### Code Ownership

All code contributed to this project becomes the property of [Government Entity] and is subject to the terms of the proprietary license.

### Compliance Requirements

- Follow government coding standards
- Comply with data protection regulations
- Adhere to evidence handling procedures
- Maintain audit trails for all changes

---

## 🙏 Acknowledgments

Thank you for contributing to the Evidential Capture App and helping ensure justice through technology.

---

**Last Updated**: 2025-12-31  
**Document Version**: 1.0.0
