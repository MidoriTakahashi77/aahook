import * as fs from 'fs';
import * as path from 'path';

/**
 * Parsed command line arguments
 */
export interface ParsedArgs {
  command: string | null;
  args: string[];
}

/**
 * Ensure directory exists, create if not
 */
export function ensureDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true, mode: 0o700 });
  }
}

/**
 * Copy file from source to destination
 */
export function copyFile(src: string, dest: string): void {
  fs.copyFileSync(src, dest);
}

/**
 * Check if file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Get timestamp string for backup naming
 * @returns Timestamp in format YYYYMMDD-HHMMSS
 */
export function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}-${hour}${minute}${second}`;
}

/**
 * Parse command line arguments
 */
export function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  
  if (args.length === 0) {
    return { command: null, args: [] };
  }
  
  const firstArg = args[0];
  
  // Check for flags
  if (firstArg.startsWith('-')) {
    return { command: firstArg, args: args.slice(1) };
  }
  
  // Regular command
  return { command: args.join(' '), args: args };
}