# 🎯 aahook

Display ASCII art when your commands succeed or fail! Make your terminal more fun and expressive.

## ✨ Features

- 🎨 Show custom ASCII art based on command success/failure
- ⚡ Zero dependencies, lightweight and fast
- 🔧 Easy configuration with JSON
- 📦 Simple npm installation
- 🌈 Customizable art files

## 📦 Installation

```bash
npm install -g aahook
```

## 🚀 Quick Start

1. **Initialize aahook:**
```bash
aahook init
```

2. **Run commands with ASCII art:**
```bash
aahook ls        # Shows cat art on success
aahook git push  # Shows dragon art on success
aahook npm test  # Shows success/error art based on result
```

## 📝 Usage

### Basic Commands

```bash
aahook <command>     # Execute command and show ASCII art
aahook init          # Initialize aahook configuration
aahook list          # List configured hooks
aahook --help        # Show help message
aahook --version     # Show version
```

### Examples

```bash
# Simple command execution
aahook ls

# Git operations with custom art
aahook git push origin main

# NPM scripts
aahook npm run build
```

## ⚙️ Configuration

Configuration is stored in `~/.aahook/config.json`:

```json
{
  "version": "0.1.0",
  "hooks": {
    "git push": {
      "success": "dragon.txt",
      "error": "error.txt"
    },
    "ls": {
      "success": "cat.txt"
    },
    "npm test": {
      "success": "success.txt",
      "error": "error.txt"
    }
  }
}
```

## 🎨 Default ASCII Arts

### Success (cat.txt)
```
🐱 Done! 🐱
   /\_/\  
  ( o.o ) 
   > ^ <
```

### Error (error.txt)
```
💥 Oops! 💥
    (╯°□°）╯
   Something went wrong...
   Check the error above ↑
```

### Git Push Success (dragon.txt)
```
🐲 Push successful! 🐲
     /|   /|  
    ( :v:  )
     |(_)|
  Your code flies to the repo!
```

## 🎯 Custom Art

1. Create your ASCII art file in `~/.aahook/arts/`
2. Update `~/.aahook/config.json` to use your art:

```json
{
  "hooks": {
    "your-command": {
      "success": "your-art.txt",
      "error": "your-error-art.txt"
    }
  }
}
```

## 📁 File Structure

```
~/.aahook/
├── config.json       # Hook configuration
└── arts/            # ASCII art files
    ├── success.txt
    ├── error.txt
    ├── dragon.txt
    └── cat.txt
```

## 🧪 Development

```bash
# Clone the repository
git clone https://github.com/MidoriTakahashi77/aahook.git
cd aahook

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Link for local development
npm link
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this in your projects!

## 🌟 Support

If you find this tool useful, please consider giving it a star on GitHub!

---

Made with ❤️ for developers who love fun terminals