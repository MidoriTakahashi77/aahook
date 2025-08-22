import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Hook configuration for a command
 */
export interface HookConfig {
  success?: string;
  error?: string;
}

/**
 * Main configuration structure
 */
export interface Config {
  version: string;
  hooks: Record<string, HookConfig>;
}

// Configuration paths
export const CONFIG_DIR = path.join(os.homedir(), '.aahook');
export const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
export const ARTS_DIR = path.join(CONFIG_DIR, 'arts');

// Default configuration
export const DEFAULT_CONFIG: Config = {
  version: '0.1.0',
  hooks: {
    'git push': {
      success: 'dragon.txt',
      error: 'error.txt'
    },
    'ls': {
      success: 'cat.txt'
    },
    'npm test': {
      success: 'success.txt',
      error: 'error.txt'
    }
  }
};

/**
 * Load configuration from file
 * @throws Error if config file doesn't exist or is invalid
 */
export function loadConfig(): Config {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error('aahook not initialized. Run \'aahook init\' first.');
  }
  
  try {
    const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = JSON.parse(configContent) as Config;
    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid config.json format. Please check ~/.aahook/config.json');
    }
    throw error;
  }
}

/**
 * Save configuration to file
 */
export function saveConfig(config: Config): void {
  const configContent = JSON.stringify(config, null, 2);
  fs.writeFileSync(CONFIG_FILE, configContent, { mode: 0o600 });
}

/**
 * Validate configuration object
 */
export function validateConfig(config: any): config is Config {
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  if (!config.version || typeof config.version !== 'string') {
    return false;
  }
  
  if (!config.hooks || typeof config.hooks !== 'object') {
    return false;
  }
  
  return true;
}

/**
 * Get configuration directory path
 */
export function getConfigDir(): string {
  return CONFIG_DIR;
}

/**
 * Get arts directory path
 */
export function getArtsDir(): string {
  return ARTS_DIR;
}

/**
 * Check if aahook is initialized
 */
export function isInitialized(): boolean {
  return fs.existsSync(CONFIG_FILE);
}