# Contributing to ASCEND

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Code of Conduct

- Be respectful and inclusive
- No harassment, discrimination, or hate speech
- Give constructive feedback
- Help others learn and grow

## How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/ascend-app.git
cd ascend-app
git remote add upstream https://github.com/aryandadhich333-blip/ascend-app.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes
- Follow existing code style
- Write clear, readable code
- Add comments for complex logic
- Test your changes

### 4. Commit & Push
```bash
git add .
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

### 5. Create Pull Request
- Provide clear description
- Reference related issues
- Include screenshots if applicable
- Wait for review

## Development Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Format with Prettier
- Write meaningful variable names

### Example:
```typescript
// Good ✅
const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const achievements = await Achievement.find({ userId });
  return achievements;
};

// Bad ❌
const getAch = async (id) => {
  const a = await Achievement.find({ userId: id });
  return a;
};
```

## Commit Message Format

```
type(scope): subject

body

footer
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Dependencies, build

### Examples
```
feat(quests): add quest difficulty filter
fix(auth): resolve JWT token validation bug
docs(api): update endpoint documentation
```

## Bug Reports

When reporting bugs, include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos
- System information

## Feature Requests

When suggesting features:
- Clear use case
- Why it's needed
- Potential implementation
- Mockups if applicable

## Review Process

1. Automated checks (linting, tests)
2. Code review by maintainers
3. Feedback and revisions
4. Approval and merge

## Areas for Contribution

### High Priority
- Bug fixes
- Performance improvements
- Documentation
- UI/UX improvements

### Medium Priority
- New features
- API enhancements
- Testing improvements

### Help Needed
- Mobile development
- DevOps/deployment
- AI/ML features
- Design

## Resources

- [Setup Guide](./SETUP.md)
- [API Documentation](./API.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

## Questions?

- Open an issue
- Email: aryandadhich333@gmail.com
- GitHub Discussions

## License

By contributing, you agree your code is licensed under MIT.

---

**Happy contributing! 🚀**
