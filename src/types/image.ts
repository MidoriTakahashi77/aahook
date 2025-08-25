/**
 * Image conversion-related type definitions
 */

export interface ConversionConfig {
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  charset: CharacterSet;
  colorMode: ColorMode;
  algorithm: ConversionAlgorithm;
  contrast?: number;    // -100 to 100
  brightness?: number;   // -100 to 100
  invert?: boolean;
  threshold?: number;    // For binary conversion (0-255)
}

export type CharacterSet = 'ascii' | 'extended' | 'blocks' | 'braille' | 'custom';

export type ColorMode = 'bw' | 'grayscale' | 'color';

export type ConversionAlgorithm = 'brightness' | 'edge' | 'dither' | 'pattern';

export interface ConvertOptions {
  width?: number;
  height?: number;
  charset?: CharacterSet;
  algorithm?: ConversionAlgorithm;
  contrast?: number;
  brightness?: number;
  color?: boolean;
  save?: string;
  preview?: boolean;
  invert?: boolean;
}

export interface ImageData {
  width: number;
  height: number;
  data: Uint8Array | Buffer;
  channels: number;
}

export interface Pixel {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface CharacterMapping {
  charset: string;
  name: CharacterSet;
  description: string;
}

// Predefined character sets for different detail levels
export const CHARACTER_SETS: Record<CharacterSet, string> = {
  ascii: ' .:-=+*#%@',
  extended: ' ░▒▓█',
  blocks: ' ▁▂▃▄▅▆▇█',
  braille: '⠀⠁⠂⠃⠄⠅⠆⠇⡀⡁⡂⡃⡄⡅⡆⡇⢀⢁⢂⢃⢄⢅⢆⢇⣀⣁⣂⣃⣄⣅⣆⣇',
  custom: '' // User-defined
};