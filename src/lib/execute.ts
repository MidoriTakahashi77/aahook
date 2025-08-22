import { execSync } from 'child_process';
import { loadConfig, Config, HookConfig } from './config';
import { showArt } from './display';

/**
 * Command execution result
 */
export interface ExecutionResult {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
}

/**
 * Execute command and capture result
 */
export function executeCommand(args: string[]): ExecutionResult {
  const command = args.join(' ');
  const result: ExecutionResult = {
    command: command,
    exitCode: 0,
    stdout: '',
    stderr: ''
  };
  
  try {
    // Execute command and capture output
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      shell: true,
      windowsHide: true
    } as any);
    
    result.stdout = output;
    result.exitCode = 0;
    
    // Display the command output
    if (output) {
      process.stdout.write(output);
    }
    
  } catch (error: any) {
    // Command failed
    result.exitCode = error.status || 1;
    result.stderr = error.stderr || '';
    
    // Display error output
    if (error.stdout) {
      process.stdout.write(error.stdout);
    }
    if (error.stderr) {
      process.stderr.write(error.stderr);
    }
  }
  
  return result;
}

/**
 * Run command with hook support
 */
export function runWithHook(args: string[]): void {
  let config: Config | null = null;
  
  // Try to load config
  try {
    config = loadConfig();
  } catch (error: any) {
    // Config not found, just run the command without hooks
    console.error(error.message);
    const result = executeCommand(args);
    process.exit(result.exitCode);
    return;
  }
  
  // Execute the command
  const result = executeCommand(args);
  
  // Find matching hook
  const command = args.join(' ');
  const hook = findHook(config, command);
  
  if (hook) {
    // Determine which art to show
    const artFile = determineArtFile(hook, result.exitCode);
    if (artFile) {
      showArt(artFile);
    }
  }
  
  // Exit with the same code as the command
  process.exit(result.exitCode);
}

/**
 * Find hook configuration for command
 */
export function findHook(config: Config, command: string): HookConfig | null {
  if (!config || !config.hooks) {
    return null;
  }
  
  // Exact match only
  if (config.hooks[command]) {
    return config.hooks[command];
  }
  
  return null;
}

/**
 * Determine which art file to display
 */
export function determineArtFile(hook: HookConfig, exitCode: number): string | null {
  if (!hook) {
    return null;
  }
  
  if (exitCode === 0) {
    // Success
    return hook.success || null;
  } else {
    // Error
    return hook.error || null;
  }
}