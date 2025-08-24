import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { 
  CONFIG_DIR, 
  CONFIG_FILE, 
  ARTS_DIR, 
  DEFAULT_CONFIG,
  saveConfig 
} from './config';
import { 
  ensureDirectory, 
  copyFile, 
  fileExists, 
  getTimestamp 
} from './utils';
import { showSuccess, showInfo, showError } from './display';

/**
 * Initialize aahook configuration
 */
export async function initCommand(): Promise<void> {
  try {
    // Check if already initialized
    if (fileExists(CONFIG_DIR)) {
      const shouldReinitialize = await checkExisting();
      if (!shouldReinitialize) {
        console.log('Initialization cancelled.');
        return;
      }
      
      // Create backup
      await createBackup();
    }
    
    // Create environment
    await createEnvironment();
    
    // Show success message
    showSuccess('aahook initialized successfully!');
    showInfo('📁 Created ~/.aahook with sample arts');
    showInfo('🎯 Try: aahook ls');
    showInfo('⚙️  Edit ~/.aahook/config.json to customize');
    
  } catch (error: any) {
    showError(`Initialization failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Check if aahook is already initialized
 */
async function checkExisting(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('~/.aahook already exists. Reinitialize? (y/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Create backup of existing configuration
 */
async function createBackup(): Promise<void> {
  const timestamp = getTimestamp();
  const backupDir = `${CONFIG_DIR}.backup-${timestamp}`;
  
  showInfo(`Creating backup at ${backupDir}`);
  
  // Rename existing directory
  fs.renameSync(CONFIG_DIR, backupDir);
  
  showInfo('Backup created successfully');
}

/**
 * Create aahook environment
 */
async function createEnvironment(): Promise<void> {
  // Create directories
  createDirectories();
  
  // Copy default arts
  await copyDefaultArts();
  
  // Create sample configuration
  createSampleConfig();
}

/**
 * Create necessary directories
 */
function createDirectories(): void {
  ensureDirectory(CONFIG_DIR);
  ensureDirectory(ARTS_DIR);
}

/**
 * Copy default art files
 */
async function copyDefaultArts(): Promise<void> {
  const assetsDir = path.join(__dirname, '..', '..', 'assets', 'arts');
  const artFiles = ['success.txt', 'error.txt', 'dragon.txt', 'cat.txt'];
  
  for (const artFile of artFiles) {
    const srcPath = path.join(assetsDir, artFile);
    const destPath = path.join(ARTS_DIR, artFile);
    
    if (fileExists(srcPath)) {
      copyFile(srcPath, destPath);
    } else {
      // Create default art content if source doesn't exist
      createDefaultArt(artFile, destPath);
    }
  }
}

/**
 * Create default art content
 */
function createDefaultArt(filename: string, destPath: string): void {
  let content = '';
  
  switch(filename) {
    case 'success.txt':
      content = `✨ Success! ✨
    ∩───∩
   (  ◕   ◕ )
    ∪ ─── ∪
   Task completed!`;
      break;
      
    case 'error.txt':
      content = `💥 Oops! 💥
    (╯°□°）╯
   Something went wrong...
   Check the error above ↑`;
      break;
      
    case 'dragon.txt':
      content = `🐲 Push successful! 🐲
     /|   /|  
    ( :v:  )
     |(_)|
  Your code flies to the repo!`;
      break;
      
    case 'cat.txt':
      content = `🐱 Done! 🐱
   /\\_/\\  
  ( o.o ) 
   > ^ <`;
      break;
  }
  
  fs.writeFileSync(destPath, content, 'utf8');
}

/**
 * Create sample configuration
 */
function createSampleConfig(): void {
  saveConfig(DEFAULT_CONFIG);
}