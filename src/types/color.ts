/**
 * Color-related type definitions
 */

export interface ColorTheme {
  name: string;
  version: string;
  description: string;
  author?: string;
  colors: {
    mode: 'pattern' | 'line' | 'character' | 'region';
    rules: ColorRule[];
  };
}

export interface ColorRule {
  match: string | RegExp | LineRange | Region;
  color: ColorDefinition;
}

export interface ColorDefinition {
  fg?: string;  // Foreground color (hex, rgb, or ansi name)
  bg?: string;  // Background color
  style?: ColorStyle[];
}

export type ColorStyle = 'bold' | 'italic' | 'underline' | 'dim' | 'blink' | 'reverse' | 'hidden' | 'strikethrough';

export interface LineRange {
  start: number;
  end: number;
}

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ColorizeOptions {
  theme?: string;
  custom?: string;
  save?: boolean;
  preview?: boolean;
  listThemes?: boolean;
  output?: string;
}

export type AnsiColorCode = 
  | number  // 0-255 for 256 color mode
  | string; // Hex color for true color mode

export interface AnsiEscapeCode {
  fg?: AnsiColorCode;
  bg?: AnsiColorCode;
  styles?: number[];
}