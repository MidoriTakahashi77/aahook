import * as fs from 'fs';
import * as path from 'path';
import { ARTS_DIR } from './config';

/**
 * Display ASCII art from file
 */
export function showArt(artFile: string | undefined): void {
  if (!artFile) {
    return;
  }
  
  const artPath = path.join(ARTS_DIR, artFile);
  
  try {
    const artContent = loadArtFile(artPath);
    if (artContent) {
      console.log('\n' + artContent + '\n');
    }
  } catch (error) {
    showError(`Art file '${artFile}' not found. Command executed successfully.`);
  }
}

/**
 * Load art file content
 * @returns Art content or null if not found
 */
export function loadArtFile(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    return null;
  }
}

/**
 * Display error message
 */
export function showError(message: string): void {
  console.error(`\n🚨 ${message}\n`);
}

/**
 * Display info message
 */
export function showInfo(message: string): void {
  console.log(`ℹ️  ${message}`);
}

/**
 * Display success message
 */
export function showSuccess(message: string): void {
  console.log(`✅ ${message}`);
}