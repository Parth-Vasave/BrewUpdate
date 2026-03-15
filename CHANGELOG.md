# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-15

### Added
- **Professional Project Structure**: Reorganized source code into a modular `src/brewupdate` package.
- **Modern UI Overhaul**: Redesigned the entire frontend with Tailwind CSS, supporting native Dark/Light modes.
- **Structured Package Info**: Redesigned the package details modal to show descriptions, dependencies, and metadata in a clean layout.
- **App Icons & Branding**: Integrated high-resolution icons and a minimalist project banner.
- **macOS Installer**: Added automated DMG creation for professional drag-and-drop installation.
- **Package Descriptions**: Added one-line descriptions for all installed packages in the dashboard.
- **Maintenance Tools**: Added GUI controls for `brew cleanup` and `brew doctor`.
- **Search & Discovery**: Integrated full Homebrew index search directly into the UI.

### Changed
- Refactored `brewupdate.py` into a slim entry point wrapper.
- Optimized app launch to hide internal developer tools by default.
- Improved Homebrew command execution with robust PATH handling for Apple Silicon and Intel Macs.

### Fixed
- Cache-busting for app icons to ensure UI updates are immediate.
- JSON parsing for various Homebrew CLI outputs.
