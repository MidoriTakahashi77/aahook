# Creating Custom Color Themes for aahook 🎨

This guide will help you create beautiful custom color themes for your ASCII arts!

## 📋 Table of Contents
- [Theme Structure](#theme-structure)
- [Color Modes](#color-modes)
- [Color Formats](#color-formats)
- [Style Options](#style-options)
- [Examples](#examples)
- [Testing Your Theme](#testing-your-theme)
- [Sharing Themes](#sharing-themes)

## 🏗️ Theme Structure

Every theme is a JSON file with the following structure:

```json
{
  "name": "theme-name",
  "version": "1.0.0",
  "description": "Brief description of your theme",
  "author": "Your name (optional)",
  "colors": {
    "mode": "line|pattern|character|region",
    "rules": [
      // Array of color rules
    ]
  }
}
```

## 🎯 Color Modes

### 1. Line Mode (`"mode": "line"`)
Colors entire lines based on line numbers.

```json
{
  "colors": {
    "mode": "line",
    "rules": [
      {
        "match": { "start": 0, "end": 2 },
        "color": { "fg": "#FF0000" }
      },
      {
        "match": { "start": 3, "end": 5 },
        "color": { "fg": "#00FF00" }
      }
    ]
  }
}
```

**Use cases**: Gradients, rainbow effects, horizon themes

### 2. Pattern Mode (`"mode": "pattern"`)
Colors text matching regex patterns or strings.

```json
{
  "colors": {
    "mode": "pattern",
    "rules": [
      {
        "match": "[0-9]",
        "color": { "fg": "#FFFF00", "style": ["bold"] }
      },
      {
        "match": "[A-Z]",
        "color": { "fg": "#00FFFF" }
      },
      {
        "match": "ERROR",
        "color": { "fg": "#FF0000", "bg": "#FFFF00" }
      }
    ]
  }
}
```

**Pattern syntax**:
- `[0-9]` - Any digit
- `[A-Z]` - Uppercase letters
- `[a-z]` - Lowercase letters
- `[!@#$%]` - Specific characters
- `"exact string"` - Exact string match

**Use cases**: Syntax highlighting, keyword emphasis, cyberpunk themes

### 3. Character Mode (`"mode": "character"`)
Colors specific individual characters.

```json
{
  "colors": {
    "mode": "character",
    "rules": [
      {
        "match": "@",
        "color": { "fg": "#FF0000", "style": ["bold"] }
      },
      {
        "match": "#",
        "color": { "fg": "#00FF00" }
      },
      {
        "match": "*",
        "color": { "fg": "#FFFF00", "style": ["blink"] }
      }
    ]
  }
}
```

**Use cases**: ASCII art with specific character meanings, fire/water themes

### 4. Region Mode (`"mode": "region"`)
Colors rectangular regions of the art.

```json
{
  "colors": {
    "mode": "region",
    "rules": [
      {
        "match": {
          "x": 0,      // Starting column (0-based)
          "y": 0,      // Starting row (0-based)
          "width": 20, // Width in characters
          "height": 1  // Height in lines
        },
        "color": { "fg": "#FFFFFF", "bg": "#0000FF" }
      }
    ]
  }
}
```

**Use cases**: Headers, footers, highlighting specific areas

## 🎨 Color Formats

### Named Colors (16 basic colors)
```json
"fg": "red"        // Basic colors
"fg": "brightRed"  // Bright variants
```

Available: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`
Bright: `gray`, `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite`

### 256 Color Mode
```json
"fg": "45"   // Color index 0-255 as string
```

### True Color (24-bit RGB)
```json
"fg": "#FF5733"           // Hex format
"fg": "rgb(255, 87, 51)"  // RGB format
```

### Background Colors
```json
"bg": "#000000"  // Same formats as foreground
```

## ✨ Style Options

Add visual effects to your colors:

```json
"style": ["bold", "italic", "underline"]
```

Available styles:
- `"bold"` - Bold text
- `"italic"` - Italic text (terminal support varies)
- `"underline"` - Underlined text
- `"dim"` - Dimmed/faded text
- `"blink"` - Blinking text (use sparingly!)
- `"reverse"` - Swap foreground/background
- `"hidden"` - Hidden text
- `"strikethrough"` - Crossed out text

## 📚 Examples

### Example 1: Sunset Gradient
```json
{
  "name": "sunset",
  "version": "1.0.0",
  "description": "Warm sunset gradient from red to purple",
  "author": "Nature Lover",
  "colors": {
    "mode": "line",
    "rules": [
      { "match": { "start": 0, "end": 0 }, "color": { "fg": "#FF6B6B" } },
      { "match": { "start": 1, "end": 1 }, "color": { "fg": "#FF8E53" } },
      { "match": { "start": 2, "end": 2 }, "color": { "fg": "#FE6B8B" } },
      { "match": { "start": 3, "end": 3 }, "color": { "fg": "#C56CC7" } },
      { "match": { "start": 4, "end": 99 }, "color": { "fg": "#8E44AD" } }
    ]
  }
}
```

### Example 2: Matrix Theme
```json
{
  "name": "matrix",
  "version": "1.0.0",
  "description": "Matrix-style green digital rain",
  "colors": {
    "mode": "pattern",
    "rules": [
      { "match": "[0-9]", "color": { "fg": "#00FF00", "style": ["bold"] } },
      { "match": "[A-Za-z]", "color": { "fg": "#00CC00" } },
      { "match": "[!@#$%^&*()]", "color": { "fg": "#00FF00", "bg": "#001100" } },
      { "match": "[|/\\-]", "color": { "fg": "#008800", "style": ["dim"] } }
    ]
  }
}
```

### Example 3: Error Highlighting
```json
{
  "name": "debug",
  "version": "1.0.0",
  "description": "Highlight errors and warnings",
  "colors": {
    "mode": "pattern",
    "rules": [
      { "match": "ERROR", "color": { "fg": "#FFFFFF", "bg": "#FF0000", "style": ["bold"] } },
      { "match": "WARNING", "color": { "fg": "#000000", "bg": "#FFFF00", "style": ["bold"] } },
      { "match": "INFO", "color": { "fg": "#00FFFF" } },
      { "match": "SUCCESS", "color": { "fg": "#00FF00", "style": ["bold"] } }
    ]
  }
}
```

### Example 4: Pastel Dreams
```json
{
  "name": "pastel",
  "version": "1.0.0",
  "description": "Soft pastel colors for a gentle look",
  "colors": {
    "mode": "line",
    "rules": [
      { "match": { "start": 0, "end": 0 }, "color": { "fg": "#FFB3BA" } },
      { "match": { "start": 1, "end": 1 }, "color": { "fg": "#FFDFBA" } },
      { "match": { "start": 2, "end": 2 }, "color": { "fg": "#FFFFBA" } },
      { "match": { "start": 3, "end": 3 }, "color": { "fg": "#BAFFC9" } },
      { "match": { "start": 4, "end": 99 }, "color": { "fg": "#BAE1FF" } }
    ]
  }
}
```

### Example 5: Cyberpunk
```json
{
  "name": "cyberpunk",
  "version": "1.0.0",
  "description": "Neon colors on dark background",
  "colors": {
    "mode": "character",
    "rules": [
      { "match": "@", "color": { "fg": "#FF00FF", "style": ["bold"] } },
      { "match": "#", "color": { "fg": "#00FFFF", "style": ["bold"] } },
      { "match": "*", "color": { "fg": "#FFFF00" } },
      { "match": "+", "color": { "fg": "#FF00FF" } },
      { "match": "-", "color": { "fg": "#00FFFF" } },
      { "match": "|", "color": { "fg": "#FF1493" } },
      { "match": "/", "color": { "fg": "#FF69B4" } },
      { "match": "\\", "color": { "fg": "#FF69B4" } }
    ]
  }
}
```

## 🧪 Testing Your Theme

### 1. Create your theme file
```bash
# Create themes directory
mkdir -p ~/.aahook/themes

# Create your theme
vim ~/.aahook/themes/my-theme.json
```

### 2. Test with different ASCII arts
```bash
# Test with built-in arts
npx aahook colorize cat --theme my-theme
npx aahook colorize dragon --theme my-theme
npx aahook colorize error --theme my-theme

# Test from any location
npx aahook colorize cat --custom ./path/to/theme.json
```

### 3. Save colored versions
```bash
npx aahook colorize cat --theme my-theme --save
```

### 4. Validate your theme
Check that your JSON is valid:
```bash
# Validate JSON syntax
python -m json.tool < ~/.aahook/themes/my-theme.json
```

## 🌍 Sharing Themes

### Option 1: Share the JSON file
Simply share your `.json` theme file with others. They can place it in their `~/.aahook/themes/` directory.

### Option 2: Contribute to aahook
1. Fork the [aahook repository](https://github.com/MidoriTakahashi77/aahook)
2. Add your theme to `src/lib/color/themes/`
3. Submit a Pull Request

### Option 3: Create a theme package
Create a GitHub repository with your theme collection:
```
my-aahook-themes/
├── README.md
├── themes/
│   ├── sunset.json
│   ├── matrix.json
│   └── cyberpunk.json
└── install.sh
```

## 💡 Tips and Tricks

### 1. Use Color Palette Generators
- [Coolors.co](https://coolors.co/) - Generate color palettes
- [Adobe Color](https://color.adobe.com/) - Create color schemes
- [ColorHunt](https://colorhunt.co/) - Browse color palettes

### 2. Test on Different Terminals
Colors may appear differently on various terminals:
- iTerm2 (macOS) - Full true color support
- Terminal.app (macOS) - 256 colors
- Windows Terminal - True color support
- VS Code Terminal - True color support

### 3. Consider Accessibility
- Ensure sufficient contrast
- Avoid relying solely on color for meaning
- Test with different terminal backgrounds (light/dark)

### 4. Performance Tips
- Line mode is fastest
- Pattern mode with complex regex can be slower
- Character mode is good for specific highlights
- Region mode is great for headers/footers

### 5. Combining Modes
Currently, each theme uses one mode. For complex effects, consider:
- Creating multiple themed versions
- Using pattern mode with careful regex ordering
- Layering effects with save and re-colorize

## 🎯 Common Use Cases

### Syntax Highlighting for Code
```json
{
  "mode": "pattern",
  "rules": [
    { "match": "function", "color": { "fg": "#FF00FF" } },
    { "match": "return", "color": { "fg": "#FF0000" } },
    { "match": "[0-9]+", "color": { "fg": "#00FF00" } }
  ]
}
```

### Holiday Themes
```json
{
  "name": "christmas",
  "mode": "line",
  "rules": [
    { "match": { "start": 0, "end": 1 }, "color": { "fg": "#FF0000" } },
    { "match": { "start": 2, "end": 3 }, "color": { "fg": "#00FF00" } },
    { "match": { "start": 4, "end": 99 }, "color": { "fg": "#FF0000" } }
  ]
}
```

### Status Indicators
```json
{
  "mode": "character",
  "rules": [
    { "match": "✓", "color": { "fg": "#00FF00", "style": ["bold"] } },
    { "match": "✗", "color": { "fg": "#FF0000", "style": ["bold"] } },
    { "match": "!", "color": { "fg": "#FFFF00", "style": ["blink"] } }
  ]
}
```

## 🚀 Advanced Techniques

### Gradient Generator Script
Create smooth gradients programmatically:
```javascript
// gradient-generator.js
const steps = 10;
const startColor = [255, 0, 0];  // Red
const endColor = [0, 0, 255];    // Blue

const rules = [];
for (let i = 0; i < steps; i++) {
  const ratio = i / (steps - 1);
  const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio);
  const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio);
  const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio);
  
  rules.push({
    match: { start: i, end: i },
    color: { fg: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}` }
  });
}

console.log(JSON.stringify({ rules }, null, 2));
```

---

Happy theming! 🎨 Share your creations with the community!