/**
 * ANSI color code helper utilities
 */

import { ColorDefinition, ColorStyle, AnsiColorCode } from '../../types/color';

// ANSI escape sequence prefix
const ESC = '\x1b[';
const RESET = '\x1b[0m';

// Style codes
const STYLE_CODES: Record<ColorStyle, number> = {
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  blink: 5,
  reverse: 7,
  hidden: 8,
  strikethrough: 9
};

// Basic 16 colors
const BASIC_COLORS: Record<string, number> = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97
};

/**
 * Apply ANSI color codes to text
 */
export function colorize(text: string, color: ColorDefinition): string {
  if (!color.fg && !color.bg && (!color.style || color.style.length === 0)) {
    return text;
  }

  const codes: string[] = [];

  // Add style codes
  if (color.style) {
    for (const style of color.style) {
      if (STYLE_CODES[style]) {
        codes.push(STYLE_CODES[style].toString());
      }
    }
  }

  // Add foreground color
  if (color.fg) {
    const fgCode = parseColor(color.fg, 'fg');
    if (fgCode) codes.push(fgCode);
  }

  // Add background color
  if (color.bg) {
    const bgCode = parseColor(color.bg, 'bg');
    if (bgCode) codes.push(bgCode);
  }

  if (codes.length === 0) {
    return text;
  }

  return `${ESC}${codes.join(';')}m${text}${RESET}`;
}

/**
 * Parse color string to ANSI code
 */
function parseColor(color: string, type: 'fg' | 'bg'): string | null {
  const offset = type === 'bg' ? 10 : 0;

  // Check if it's a basic color name
  if (BASIC_COLORS[color]) {
    return (BASIC_COLORS[color] + offset).toString();
  }

  // Check if it's a number (256 color mode)
  const colorNum = parseInt(color, 10);
  if (!isNaN(colorNum) && colorNum >= 0 && colorNum <= 255) {
    return type === 'fg' ? `38;5;${colorNum}` : `48;5;${colorNum}`;
  }

  // Check if it's a hex color (true color mode)
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    if (rgb) {
      return type === 'fg' 
        ? `38;2;${rgb.r};${rgb.g};${rgb.b}`
        : `48;2;${rgb.r};${rgb.g};${rgb.b}`;
    }
  }

  // Check if it's an rgb() format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return type === 'fg'
      ? `38;2;${r};${g};${b}`
      : `48;2;${r};${g};${b}`;
  }

  return null;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Strip ANSI codes from text
 */
export function stripAnsi(text: string): string {
  // Regex to match all ANSI escape sequences
  const ansiRegex = /\x1b\[[0-9;]*m/g;
  return text.replace(ansiRegex, '');
}

/**
 * Get terminal color support level
 * 0 = no color, 1 = basic 16 colors, 2 = 256 colors, 3 = true color
 */
export function getColorSupport(): number {
  if (process.env.NO_COLOR) return 0;
  if (process.env.FORCE_COLOR === '0') return 0;
  if (process.env.FORCE_COLOR === '1') return 1;
  if (process.env.FORCE_COLOR === '2') return 2;
  if (process.env.FORCE_COLOR === '3') return 3;

  if (!process.stdout.isTTY) return 0;

  if (process.platform === 'win32') {
    // Windows 10 build 14931+ supports true color
    return 3;
  }

  if (process.env.COLORTERM === 'truecolor') return 3;
  if (process.env.TERM === 'xterm-256color') return 2;
  if (process.env.TERM && /^xterm|^screen|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) return 1;

  return 0;
}

/**
 * Create a gradient between two colors
 */
export function createGradient(startColor: string, endColor: string, steps: number): string[] {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);
  
  if (!start || !end) {
    return [];
  }

  const gradient: string[] = [];
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(start.r + (end.r - start.r) * ratio);
    const g = Math.round(start.g + (end.g - start.g) * ratio);
    const b = Math.round(start.b + (end.b - start.b) * ratio);
    
    gradient.push(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
  }
  
  return gradient;
}

/**
 * Apply rainbow colors to text
 */
export function rainbow(text: string): string {
  const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
  const stripped = stripAnsi(text);
  let result = '';
  let colorIndex = 0;
  
  for (let i = 0; i < stripped.length; i++) {
    if (stripped[i] === '\n' || stripped[i] === ' ') {
      result += stripped[i];
    } else {
      result += colorize(stripped[i], { fg: colors[colorIndex % colors.length] });
      colorIndex++;
    }
  }
  
  return result;
}