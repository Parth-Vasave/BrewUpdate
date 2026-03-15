# Contributing to BrewUpdate

Thank you for your interest in contributing to BrewUpdate! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs
If you find a bug, please search the issue tracker to see if it has already been reported. If not, feel free to open a new issue with a clear description and steps to reproduce.

### Suggesting Enhancements
We love new ideas! If you have a feature suggestion, please open an issue to discuss it.

### Pull Requests
1. **Fork the repository** on GitHub.
2. **Clone your fork** locally.
3. **Create a branch** for your specific improvement.
4. **Set up the development environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
5. **Make your changes** and ensure the app launches correctly.
6. **Commit your changes** with a clear, descriptive message.
7. **Push to your fork** and **submit a Pull Request**.

## Project Structure

- `src/brewupdate/api.py`: Backend logic for Homebrew CLI interactions.
- `src/brewupdate/main.py`: PyWebView GUI initialization.
- `gui/`: HTML, CSS, and JavaScript frontend assets.

## Development Tips

- **Frontend**: The project uses Vanilla CSS and JavaScript with Tailwind CSS for rapid styling.
- **Backend**: All Homebrew interactions should be routed through the `Api` class to ensure consistent error handling and PATH resolution.

## Style Guide

- Follow PEP 8 for Python code.
- Use meaningful variable and function names.
- Keep the UI clean and minimalist, matching the existing "Amber/Dark" aesthetic.

---

By contributing, you agree that your contributions will be licensed under the project's MIT License.
