/**
 * Color Engine for applying themes to ASCII art
 */

import * as fs from 'fs';
import * as path from 'path';
import { 
  ColorTheme, 
  ColorRule, 
  ColorDefinition, 
  LineRange, 
  Region 
} from '../../types/color';
import { colorize, stripAnsi } from './ansi-helper';

export class ColorEngine {
  private themesDir: string;
  private cachedThemes: Map<string, ColorTheme> = new Map();

  constructor(themesDir?: string) {
    this.themesDir = themesDir || path.join(
      process.env.HOME || '',
      '.aahook',
      'themes'
    );
  }

  /**
   * Apply a color theme to ASCII art
   */
  public applyTheme(art: string, theme: ColorTheme): string {
    // Strip existing colors first
    const cleanArt = stripAnsi(art);
    
    switch (theme.colors.mode) {
      case 'line':
        return this.applyLineColors(cleanArt, theme.colors.rules);
      case 'pattern':
        return this.applyPatternColors(cleanArt, theme.colors.rules);
      case 'character':
        return this.applyCharacterColors(cleanArt, theme.colors.rules);
      case 'region':
        return this.applyRegionColors(cleanArt, theme.colors.rules);
      default:
        return cleanArt;
    }
  }

  /**
   * Parse and validate a theme file
   */
  public async parseTheme(themePath: string): Promise<ColorTheme> {
    try {
      const content = fs.readFileSync(themePath, 'utf8');
      const theme = JSON.parse(content) as ColorTheme;
      
      if (this.validateTheme(theme)) {
        // Convert string patterns to RegExp if they look like regex patterns
        if (theme.colors.mode === 'pattern') {
          for (const rule of theme.colors.rules) {
            if (typeof rule.match === 'string' && rule.match.startsWith('[') && rule.match.endsWith(']')) {
              // Convert regex pattern string to RegExp
              (rule as any).match = new RegExp(rule.match, 'g');
            }
          }
        }
        return theme;
      } else {
        throw new Error('Invalid theme format');
      }
    } catch (error: any) {
      throw new Error(`Failed to parse theme: ${error.message}`);
    }
  }

  /**
   * Load a predefined or custom theme
   */
  public async loadTheme(name: string): Promise<ColorTheme> {
    // Check cache first
    if (this.cachedThemes.has(name)) {
      return this.cachedThemes.get(name)!;
    }

    // Try to load from themes directory
    const themePath = path.join(this.themesDir, `${name}.json`);
    if (fs.existsSync(themePath)) {
      const theme = await this.parseTheme(themePath);
      this.cachedThemes.set(name, theme);
      return theme;
    }

    // Try to load from built-in themes (in src directory during development)
    const srcPath = path.join(__dirname, '..', '..', '..', 'src', 'lib', 'color', 'themes', `${name}.json`);
    if (fs.existsSync(srcPath)) {
      const theme = await this.parseTheme(srcPath);
      this.cachedThemes.set(name, theme);
      return theme;
    }
    
    // Try to load from built-in themes (in dist directory for production)
    const builtInPath = path.join(__dirname, 'themes', `${name}.json`);
    if (fs.existsSync(builtInPath)) {
      const theme = await this.parseTheme(builtInPath);
      this.cachedThemes.set(name, theme);
      return theme;
    }

    throw new Error(`Theme not found: ${name}`);
  }

  /**
   * Validate theme structure
   */
  public validateTheme(theme: any): theme is ColorTheme {
    if (!theme || typeof theme !== 'object') return false;
    if (!theme.name || !theme.version || !theme.colors) return false;
    if (!theme.colors.mode || !Array.isArray(theme.colors.rules)) return false;
    
    const validModes = ['pattern', 'line', 'character', 'region'];
    if (!validModes.includes(theme.colors.mode)) return false;
    
    return true;
  }

  /**
   * Strip all color codes from ASCII art
   */
  public stripColors(art: string): string {
    return stripAnsi(art);
  }

  /**
   * Apply colors based on line numbers
   */
  private applyLineColors(art: string, rules: ColorRule[]): string {
    const lines = art.split('\n');
    const coloredLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let colored = false;
      
      for (const rule of rules) {
        if (this.isLineRange(rule.match)) {
          const range = rule.match as LineRange;
          if (i >= range.start && i <= range.end) {
            coloredLines.push(colorize(lines[i], rule.color));
            colored = true;
            break;
          }
        }
      }
      
      if (!colored) {
        coloredLines.push(lines[i]);
      }
    }

    return coloredLines.join('\n');
  }

  /**
   * Apply colors based on patterns
   */
  private applyPatternColors(art: string, rules: ColorRule[]): string {
    // Process character by character to avoid overlapping replacements
    let result = '';
    let skipNext = 0;
    
    for (let i = 0; i < art.length; i++) {
      if (skipNext > 0) {
        skipNext--;
        continue;
      }
      
      const char = art[i];
      let matched = false;
      
      for (const rule of rules) {
        if (rule.match instanceof RegExp) {
          // Test if this character matches the pattern
          if (rule.match.test(char)) {
            result += colorize(char, rule.color);
            matched = true;
            break;
          }
        } else if (typeof rule.match === 'string') {
          // Check if string starts at current position
          if (art.substr(i, rule.match.length) === rule.match) {
            result += colorize(rule.match, rule.color);
            skipNext = rule.match.length - 1;
            matched = true;
            break;
          }
        }
      }
      
      if (!matched) {
        result += char;
      }
    }

    return result;
  }

  /**
   * Apply colors character by character
   */
  private applyCharacterColors(art: string, rules: ColorRule[]): string {
    let result = '';
    
    for (let i = 0; i < art.length; i++) {
      const char = art[i];
      let colored = false;
      
      for (const rule of rules) {
        if (typeof rule.match === 'string' && char === rule.match) {
          result += colorize(char, rule.color);
          colored = true;
          break;
        }
      }
      
      if (!colored) {
        result += char;
      }
    }

    return result;
  }

  /**
   * Apply colors to specific regions
   */
  private applyRegionColors(art: string, rules: ColorRule[]): string {
    const lines = art.split('\n');
    const grid: string[][] = lines.map(line => line.split(''));
    
    for (const rule of rules) {
      if (this.isRegion(rule.match)) {
        const region = rule.match as Region;
        
        for (let y = region.y; y < Math.min(region.y + region.height, grid.length); y++) {
          for (let x = region.x; x < Math.min(region.x + region.width, grid[y].length); x++) {
            if (grid[y][x]) {
              grid[y][x] = colorize(grid[y][x], rule.color);
            }
          }
        }
      }
    }
    
    return grid.map(row => row.join('')).join('\n');
  }

  /**
   * Type guards
   */
  private isLineRange(match: any): match is LineRange {
    return match && typeof match === 'object' && 
           'start' in match && 'end' in match;
  }

  private isRegion(match: any): match is Region {
    return match && typeof match === 'object' && 
           'x' in match && 'y' in match && 
           'width' in match && 'height' in match;
  }

  /**
   * List available themes
   */
  public async listThemes(): Promise<string[]> {
    const themes: string[] = [];
    
    // List from themes directory
    if (fs.existsSync(this.themesDir)) {
      const files = fs.readdirSync(this.themesDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          themes.push(file.replace('.json', ''));
        }
      }
    }
    
    // Add built-in themes
    const builtInThemes = ['rainbow', 'neon', 'ocean', 'fire', 'retro'];
    for (const theme of builtInThemes) {
      if (!themes.includes(theme)) {
        themes.push(theme);
      }
    }
    
    return themes;
  }

  /**
   * Save a colored ASCII art
   */
  public async saveColoredArt(art: string, name: string): Promise<string> {
    const outputDir = path.join(
      process.env.HOME || '',
      '.aahook',
      'arts',
      'colored'
    );
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `${name}.txt`);
    fs.writeFileSync(outputPath, art, 'utf8');
    
    return outputPath;
  }
}