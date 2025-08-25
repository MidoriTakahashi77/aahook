# Creating ASCII Art for aahook 🎨

This guide will help you create and contribute ASCII art to aahook!

## 📋 Table of Contents
- [Art Guidelines](#art-guidelines)
- [Categories](#categories)
- [File Structure](#file-structure)
- [Step-by-Step Guide](#step-by-step-guide)
- [Tips for Great ASCII Art](#tips-for-great-ascii-art)
- [Testing Your Art](#testing-your-art)
- [Examples](#examples)

## 🎯 Art Guidelines

### Size Recommendations
- **Width**: 40-60 characters (max 80)
- **Height**: 5-15 lines (max 20)
- **Why**: Fits well in most terminal windows

### Content Guidelines
- Keep it family-friendly
- Make it expressive and fun
- Consider the context (success/error)
- Add emoji for extra personality
- Include a message when appropriate

### Technical Requirements
- UTF-8 encoding
- Unix line endings (LF, not CRLF)
- No trailing whitespace
- End file with a newline

## 📁 Categories

Choose the most appropriate category for your art:

### animals 🐾
- Cats, dogs, birds, etc.
- Suitable for general success messages
- Keep them cute and friendly

### celebrations 🎉
- Party themes, confetti, fireworks
- Perfect for successful deployments
- Build completions, test passes

### developer 💻
- Code-related themes
- Debugging, deploying, coding
- Git operations, CI/CD themes

### emotions 😊
- Happy, sad, surprised, error faces
- Good for various command outcomes
- Error states should be sympathetic

## 📂 File Structure

```
arts/
├── <category>/
│   ├── META.json         # Category metadata
│   └── <your-art>.txt    # Your ASCII art file
```

### META.json Structure
```json
{
  "name": "animals",
  "displayName": "Animals 🐾",
  "description": "Cute animal ASCII arts",
  "arts": [
    {
      "name": "unicorn",
      "displayName": "Magical Unicorn",
      "description": "A magical unicorn for special successes",
      "author": "Your Name",
      "tags": ["magical", "success", "special"],
      "suggestedHooks": {
        "success": ["npm publish", "git tag"],
        "error": []
      }
    }
  ]
}
```

## 📝 Step-by-Step Guide

### 1. Fork and Clone
```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/aahook.git
cd aahook
```

### 2. Create Your Art File
```bash
# Choose your category and name
touch arts/animals/unicorn.txt
```

### 3. Design Your ASCII Art
```txt
✨ Magical Success! ✨
       \
        \
         \\
          \\
           >\/7
       _.-(6'  \
      (=___._/` \
           )  \ |
          /   / |
         /    > /
        j    < _\
    _.-' :      ``.
    \ r=._\        `.
   <`\\_  \         .`-.
    \ r-7  `-. ._  ' .  `\
     \`,      `-.`7  7)   )
      \/         \|  \'  / `-._
                 ||    .'
                  \\  (
                   >\  >
               ,.-' >.'
              <.'_.''
                <'
```

### 4. Update META.json
Add your art's metadata to `arts/<category>/META.json`:
```json
{
  "name": "unicorn",
  "displayName": "Magical Unicorn",
  "description": "A magical unicorn for special successes",
  "author": "Your Name",
  "tags": ["magical", "success", "special"],
  "suggestedHooks": {
    "success": ["npm publish", "git tag"]
  }
}
```

### 5. Generate Index
```bash
npm run generate-index
```

### 6. Test Your Art
```bash
# Build the project
npm run build

# Test locally
npx aahook preview animals/unicorn --remote

# Install and test
npx aahook install animals/unicorn
npx aahook gallery
```

### 7. Commit and Push
```bash
git add arts/animals/unicorn.txt
git add arts/animals/META.json
git add arts/index.json
git commit -m "feat: add unicorn ASCII art"
git push origin main
```

### 8. Create Pull Request
Open a PR on GitHub with:
- Title: `feat: add [name] ASCII art`
- Description: Include a preview of your art
- Mention what commands it's good for

## 💡 Tips for Great ASCII Art

### Use ASCII Art Generators
- [ASCII Art Generator](https://patorjk.com/software/taag/)
- [Text to ASCII](https://www.text-image.com/convert/ascii.html)
- [Image to ASCII](https://www.ascii-art-generator.org/)

### Add Personality
```txt
Good:  🎉 Success! 🎉
       \(^o^)/

Better: 🎉 Woohoo! Build passed! 🎉
         \(^o^)/
          |   |
         /     \
        Party time!
```

### Consider Context
- **Success**: Celebratory, happy, encouraging
- **Error**: Sympathetic, helpful, not mocking
- **Warning**: Cautious, informative

### Use Box Drawing Characters
```txt
╔════════════════╗
║  Deploy Done!  ║
╚════════════════╝
```

### Combine Emoji and ASCII
```txt
🚀 Launching to production! 🚀
     |
    / \
   |---|
   |   |
   |   |
  /|   |\
 / |   | \
```

## 🧪 Testing Your Art

### Local Testing
```bash
# Preview without installing
cat arts/animals/unicorn.txt

# Test with actual command
npx aahook echo "test"
```

### Size Testing
```bash
# Check width (should be < 80)
awk '{print length}' arts/animals/unicorn.txt | sort -n | tail -1

# Check height (should be < 20)
wc -l arts/animals/unicorn.txt
```

## 📚 Examples

### Simple Success Art
```txt
✅ Done! ✅
   Great job!
```

### Animated Feel
```txt
🎯 Target Hit! 🎯
    \  |  /
     \ | /
   --- * ---
     / | \
    /  |  \
```

### Error with Empathy
```txt
😔 Oh no! Something went wrong...
    Don't worry, we can fix this!
    
    Check the error message above ↑
```

### Deployment Theme
```txt
🚢 Shipping to production! 🚢
       |    |    |
      )_)  )_)  )_)
     )___))___))___)\
    )____)____)_____)\\\
  _____|____|____|____\\\\_
  \                   /
~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

## 🎉 Congratulations!

You're ready to create awesome ASCII art for aahook! Remember:
- Have fun with it
- Be creative
- Think about the user's experience
- Test your art before submitting

Happy creating! 🎨