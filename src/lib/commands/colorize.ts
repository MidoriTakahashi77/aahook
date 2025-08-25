import { AAManager } from '../aa-manager';
import { ColorEngine } from '../color/color-engine';
import { ColorizeOptions } from '../../types/color';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Apply color theme to ASCII art
 */
export async function colorizeCommand(
  artName: string,
  options: ColorizeOptions = {}
): Promise<void> {
  const manager = new AAManager();
  const engine = new ColorEngine();
  
  try {
    // List themes if requested
    if (options.listThemes) {
      const themes = await engine.listThemes();
      console.log('\n🎨 Available Color Themes:\n');
      for (const theme of themes) {
        console.log(`  • ${theme}`);
      }
      console.log('\n💡 Usage: npx aahook colorize <art> --theme <theme-name>\n');
      return;
    }
    
    // Get the ASCII art
    const art = await manager.getLocal(artName);
    if (!art) {
      console.error(`\n❌ ASCII art '${artName}' not found locally.`);
      console.error('💡 Use "npx aahook gallery" to see installed arts.');
      console.error('💡 Or install new art with "npx aahook install <category>/<name>"\n');
      return;
    }
    
    // Determine which theme to use
    let coloredArt: string;
    
    if (options.custom) {
      // Load custom theme file
      if (!fs.existsSync(options.custom)) {
        console.error(`\n❌ Custom theme file not found: ${options.custom}\n`);
        return;
      }
      
      console.log(`\n🎨 Applying custom theme: ${options.custom}...`);
      const customTheme = await engine.parseTheme(options.custom);
      coloredArt = engine.applyTheme(art.content, customTheme);
      
    } else if (options.theme) {
      // Load predefined theme
      console.log(`\n🎨 Applying theme: ${options.theme}...`);
      
      try {
        const theme = await engine.loadTheme(options.theme);
        coloredArt = engine.applyTheme(art.content, theme);
      } catch (error: any) {
        console.error(`\n❌ Theme '${options.theme}' not found.`);
        console.error('💡 Use "npx aahook colorize --list-themes" to see available themes.\n');
        return;
      }
      
    } else {
      // Default to rainbow theme
      console.log('\n🌈 Applying default rainbow theme...');
      const rainbowTheme = await engine.loadTheme('rainbow');
      coloredArt = engine.applyTheme(art.content, rainbowTheme);
    }
    
    // Display the colored art
    console.log('\n✨ Colored ASCII Art:\n');
    console.log('═'.repeat(50));
    console.log(coloredArt);
    console.log('═'.repeat(50));
    
    // Save if requested
    if (options.save) {
      const outputName = options.output || `${artName}-colored`;
      const savedPath = await engine.saveColoredArt(coloredArt, outputName);
      console.log(`\n✅ Saved colored art to: ${savedPath}`);
      console.log(`💡 Use it in hooks: npx aahook config --success colored/${outputName}.txt\n`);
    } else if (!options.preview) {
      console.log('\n💡 To save this colored version, add --save flag');
      console.log('💡 Example: npx aahook colorize cat --theme neon --save\n');
    }
    
  } catch (error: any) {
    console.error(`\n❌ Colorization failed: ${error.message}\n`);
    process.exit(1);
  }
}

/**
 * Create a custom theme interactively (future feature)
 */
export async function createThemeCommand(name: string): Promise<void> {
  console.log('\n🎨 Theme creator coming soon!');
  console.log('For now, create themes manually in ~/.aahook/themes/\n');
  
  const exampleTheme = {
    name: name,
    version: '1.0.0',
    description: 'Custom theme',
    author: 'Your name',
    colors: {
      mode: 'line',
      rules: [
        {
          match: { start: 0, end: 0 },
          color: { fg: '#FF0000' }
        }
      ]
    }
  };
  
  console.log('Example theme structure:');
  console.log(JSON.stringify(exampleTheme, null, 2));
  console.log('\nModes: line, pattern, character, region');
  console.log('Colors: hex (#RRGGBB), named (red, blue), or ANSI (0-255)\n');
}