# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2024-12-25

### Added
- 🎬 **Animation System**: Bring ASCII arts to life with smooth animations
  - 5 animation types: typing, fade, slide, frames, blink
  - Smooth, flicker-free rendering with terminal optimization
  - Direction control for fade and slide animations
  - Speed control with customizable delays
  - Integration with color themes for animated colored arts
- 📦 `animate` command: Apply animations to ASCII arts
- ⚡ Performance optimizations for smooth animations
- 🎮 Interrupt handling (Ctrl+C) during animations
- 💾 Animation settings persistence

### Changed
- Improved terminal rendering with better cursor control
- Enhanced animation performance with optimized frame rates
- Better fallback for non-interactive terminals

### Fixed
- Terminal output preservation after animations
- Smooth slide animations without screen artifacts
- Character-by-character fade animations

## [0.3.0] - 2024-12-25

### Added
- 🌈 **Color Theme System**: Apply beautiful colors to ASCII arts
  - 5 built-in themes: rainbow, neon, ocean, fire, retro
  - Support for ANSI color codes (16, 256, and true color)
  - 4 coloring modes: line, pattern, character, region
  - Custom theme support via JSON files
- 🎨 `colorize` command: Apply and save colored ASCII arts
- 🎯 Color helper utilities for ANSI escape sequences
- 📝 Theme file format for creating custom themes
- 📚 Comprehensive theme creation guide (docs/CREATE_THEME.md)
- 🎭 4 example custom themes: sunset, matrix, pastel, cyberpunk

### Changed
- Updated help documentation to include colorize command
- Enhanced test suite with color feature tests

### Fixed
- Pattern and character mode regex matching for themes

## [0.2.0] - 2024-12-25

### Added
- 🎨 **ASCII Art Management System**: Browse, install, preview, and manage ASCII arts from GitHub repository
- 📥 `browse` command: Explore available ASCII arts in the community repository
- 💾 `install` command: Download and configure ASCII arts from GitHub
- 🔍 `preview` command: Preview ASCII arts before installation (local and remote)
- 🖼️ `gallery` command: Display locally installed ASCII arts
- 🌐 **GitHub Integration**: Community-driven ASCII art sharing via Pull Requests
- 💾 **Caching System**: Smart caching for remote content fetching
- 📁 **Category Organization**: Arts organized into animals, celebrations, developer, and emotions categories
- 📝 **Metadata Support**: Each art includes author, tags, and suggested hooks
- 🌍 **Japanese Documentation**: Complete README_ja.md for Japanese users
- 📚 **Contributing Guide**: CONTRIBUTING.md with detailed contribution guidelines
- 🎨 **Art Creation Guide**: Comprehensive guide for creating ASCII arts (docs/CREATE_ART.md)
- 🧪 **Extended Test Coverage**: Added tests for all new commands

### Changed
- 🔧 **Hook Matching**: Improved command matching to support arguments (e.g., `git add .` now matches `git add` hook)
- 📦 **Project Structure**: Reorganized arts from `assets/arts/` to `arts/` with category-based structure
- 📖 **Documentation**: Significantly expanded README with new features and examples

### Fixed
- 🐛 Hook configuration not matching commands with arguments
- 🐛 Wildcard (*) hook support now working correctly

## [0.1.2] - 2024-12-19

### Fixed
- 📦 npm package distribution issue (dist folder not included)

### Added
- ✨ Luxurious ASCII art for --version command

### Changed
- 📖 Documentation updated to prioritize npx/bunx usage over global installation

## [0.1.1] - 2024-12-19

### Fixed
- 📦 Fixed npm package structure (changed lib/ to dist/)

## [0.1.0] - 2024-12-19

### Added
- 🎯 Initial release of aahook
- 🎨 Display ASCII art based on command success/failure
- ⚙️ JSON-based configuration system
- 🎨 Default ASCII arts: cat, dragon, success, error
- 📝 Commands: init, list, --help, --version
- 🔧 Hook system for custom command configurations
- 📦 Zero dependencies implementation
- 🧪 Comprehensive test suite
- 📖 Full documentation in English

### Features
- Execute any command with ASCII art feedback
- Customizable art files
- Per-command hook configuration
- Support for both npm and Bun package managers

---

## Upcoming Features (Roadmap)

- 🎬 Animation support for ASCII arts
- 🎨 Art templates with variables
- 🎮 Interactive art selection
- 🌈 Theme support
- 🌍 Internationalization (i18n)
- 📱 Better Windows compatibility

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

Special thanks to all contributors who help make terminals more fun! 🎉