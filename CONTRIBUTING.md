# Contributing to aahook 🎯

Thank you for your interest in contributing to aahook! We welcome contributions from everyone, especially new ASCII arts that make terminals more fun.

## 🎨 Contributing ASCII Art

The easiest way to contribute is by adding new ASCII art! See our [ASCII Art Creation Guide](docs/CREATE_ART.md) for detailed instructions.

### Quick Steps:
1. Fork this repository
2. Create your art file in `arts/<category>/<name>.txt`
3. Update `arts/<category>/META.json` with metadata
4. Run `npm run generate-index` to update the catalog
5. Submit a Pull Request

## 💻 Contributing Code

### Prerequisites
- Node.js 18+ or Bun
- TypeScript knowledge
- Git

### Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/aahook.git
cd aahook

# Install dependencies
npm install  # or bun install

# Build the project
npm run build

# Run tests
npm test

# Test your changes locally
npm link
aahook --version
```

### Code Style
- Use TypeScript for all new code
- Follow existing code patterns
- Keep functions small and focused
- Add types for all parameters and return values
- Write descriptive commit messages

### Testing
Before submitting a PR:
```bash
# Run all tests
npm test

# Build to check for TypeScript errors
npm run build

# Test the CLI locally
node dist/bin/aahook.js --help
```

## 📝 Pull Request Process

1. **Fork & Clone**: Fork the repository and clone it locally
2. **Branch**: Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit**: Make your changes with clear commit messages
   ```bash
   git commit -m "feat: add unicorn ASCII art"
   ```
4. **Push**: Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
5. **PR**: Open a Pull Request with:
   - Clear title and description
   - Screenshots/examples if adding visual features
   - Reference any related issues

### Commit Message Format
We use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

Examples:
```
feat: add rainbow ASCII art for build success
fix: correct hook matching for git commands
docs: update installation instructions
```

## 🏗️ Project Structure

```
aahook/
├── src/               # TypeScript source code
│   ├── bin/          # CLI entry point
│   ├── lib/          # Core libraries
│   │   ├── commands/ # CLI commands (browse, install, etc.)
│   │   └── ...       # Other utilities
│   └── types/        # TypeScript type definitions
├── arts/             # ASCII art repository
│   ├── animals/      # Animal category
│   ├── celebrations/ # Celebration category
│   ├── developer/    # Developer category
│   └── emotions/     # Emotion category
├── test/             # Test files
└── docs/             # Documentation
```

## 🎯 Areas for Contribution

### High Priority
- 🎨 New ASCII arts (always welcome!)
- 🌍 Internationalization (i18n)
- 📱 Windows compatibility improvements
- 🧪 More test coverage

### Feature Ideas
- Animation support for ASCII arts
- Art templates with variables
- Interactive art selection
- Art categories expansion
- Theme support

### Documentation
- Translate README to other languages
- Add more examples
- Video tutorials
- Blog posts about usage

## 🤝 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Getting Help

- **Questions**: Open an issue with the `question` label
- **Bugs**: Open an issue with the `bug` label
- **Features**: Open an issue with the `enhancement` label
- **Discussion**: Use GitHub Discussions

## 🌟 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Given a shoutout on social media (if desired)

Thank you for making terminals more fun! 🎉