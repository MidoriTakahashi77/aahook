# 🎯 aahook

![npm](https://img.shields.io/npm/dw/aahook)   <!-- 週ごとのDL数 -->
![npm](https://img.shields.io/npm/dm/aahook)   <!-- 月ごとのDL数 -->
![npm](https://img.shields.io/npm/dt/aahook)   <!-- 累計DL数 -->

Display ASCII art when your commands succeed or fail! Make your terminal more fun and expressive.

```bash
# Install-free usage with npx or bunx
npx aahook git push    # Shows dragon art on success 🐲
bunx aahook npm test   # Shows success/error art based on result ✨
```

## ✨ Features

- 🎨 Show custom ASCII art based on command success/failure
- ⚡ Zero dependencies, lightweight and fast
- 🔧 Easy configuration with JSON
- 📦 Simple npm installation
- 🌈 Customizable art files

## 📦 Installation

### 🚀 No Installation Required (Recommended)
```bash
# Using npx (comes with Node.js)
npx aahook <command>

# Using bunx (faster, comes with Bun)
bunx aahook <command>
```

### Optional: Global Installation
<details>
<summary>If you prefer to install globally...</summary>

#### Using npm
```bash
npm install -g aahook
```

#### Using Bun
```bash
bun add -g aahook

# Add to PATH (first time only)
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```
</details>

## 🚀 Quick Start

1. **Initialize aahook:**
```bash
npx aahook init
# or
bunx aahook init
```

2. **Run commands with ASCII art:**
```bash
# Using npx
npx aahook ls        # Shows cat art on success 🐱
npx aahook git push  # Shows dragon art on success 🐲
npx aahook npm test  # Shows success/error art ✨/💥

# Using bunx (faster)
bunx aahook ls
bunx aahook git push
bunx aahook npm test
```

## 📝 Usage

### Basic Commands

```bash
npx aahook <command>     # Execute command and show ASCII art
npx aahook init          # Initialize aahook configuration
npx aahook list          # List configured hooks
npx aahook --help        # Show help message
npx aahook --version     # Show version
```

### Real-world Examples

```bash
# Development workflow
npx aahook npm test          # Run tests with visual feedback
bunx aahook npm run build    # Build with success animation
npx aahook git push          # Push code with dragon celebration

# File operations
bunx aahook ls -la           # List files with cat art
npx aahook rm temp.txt       # Delete with feedback

# Quick aliases (add to .zshrc/.bashrc)
alias aa="npx aahook"        # Now use: aa npm test
alias aab="bunx aahook"      # Now use: aab git push
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

# Install dependencies (choose one)
npm install
bun install

# Build TypeScript
npm run build
bun run build

# Run tests
npm test
bun test

# Test locally without publishing
npm link          # Then use: aahook <command>
# or test directly
node bin/aahook.js --version
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

