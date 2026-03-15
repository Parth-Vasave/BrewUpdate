<p align="center">
  <img src="docs/media/banner.png" width="100%" alt="BrewUpdate Banner">
</p>

<h1 align="center">BrewUpdate</h1>

<p align="center">
  <strong>A premium, lightweight macOS GUI for Homebrew Package Manager.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-macOS-orange?style=flat-square&logo=apple" alt="Platform">
  <img src="https://img.shields.io/badge/Built%20with-Python%20%26%20JS-blue?style=flat-square" alt="Built With">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## Overview

**BrewUpdate** is a modern, sleek desktop application designed to simplify package management on macOS. It provides a beautiful interface to interact with Homebrew, allowing you to easily discover, install, update, and maintain your system packages without touching the terminal.

<p align="center">
  <img src="docs/media/logo.png" width="200" alt="BrewUpdate Logo" style="border-radius: 20px;">
</p>

## Features

- **Premium Dashboard**: Instant overview of packages and pending updates.
- **Package Explorer**: Browse installed formulae and casks with ease.
- **Discover**: Search the entire Homebrew index directly from the app.
- **System Maintenance**: Built-in tools for `brew cleanup` and `brew doctor`.
- **Native macOS Menus**: Full support for standard macOS menus including "Check for Updates".
- **Dark Mode**: Gorgeous amber-themed UI with full dark/light support.
- **🛠️ Knowledge Base**: View detailed dependencies and licenses.

## Installation

### macOS (Recommended)
1. **Download**: Get the latest `BrewUpdate.dmg` from the [Releases](https://github.com/Parth-Vasave/BrewUpdate/releases) page.
2. **Install**: Open the `.dmg` file and drag **BrewUpdate** to your **Applications** folder.
3. **Launch**: Open BrewUpdate from your Applications or via Spotlight.

---

## Getting Started (Development)

### Prerequisites

- [Homebrew](https://brew.sh/) must be installed on your macOS system.
- Python 3.x

### Running from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/Parth-Vasave/BrewUpdate.git
   ```
2. Install dependencies:
   ```bash
   pip install pywebview pyinstaller
   ```
3. Launch the app:
   ```bash
   python brewupdate.py
   ```

## Project Structure

```text
BrewUpdate/
├── docs/                 # Project documentation & media
├── src/                  # Python source code
│   └── brewupdate/       # Package source
│       ├── ui/           # Frontend (HTML/CSS/JS)
│       ├── assets/       # Bundle assets (Icons)
│       ├── api.py        # Homebrew logic
│       └── main.py       # App entry
├── scripts/              # Build & automation scripts
└── brewupdate.spec       # PyInstaller configuration
```

## Development

The application is built using a Python backend and a Vanilla CSS/JS frontend, bridged seamlessly using `pywebview`.

### Building the Standalone App

```bash
pyinstaller brewupdate.spec --clean -y
```

---
