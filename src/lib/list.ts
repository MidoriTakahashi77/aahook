import { loadConfig, Config, isInitialized } from './config';
import { showError } from './display';

/**
 * List configured hooks
 */
export function listCommand(): void {
  try {
    // Check if initialized
    if (!isInitialized()) {
      showError('aahook not initialized. Run \'aahook init\' first.');
      process.exit(1);
    }
    
    // Load configuration
    const config = loadConfig();
    
    // Display hooks
    displayHooks(config);
    
  } catch (error: any) {
    showError(`Failed to list hooks: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Display hooks in table format
 */
function displayHooks(config: Config): void {
  const hooks = config.hooks;
  
  // Check if there are any hooks
  if (!hooks || Object.keys(hooks).length === 0) {
    console.log('No hooks configured.');
    console.log('Edit ~/.aahook/config.json to add hooks.');
    return;
  }
  
  // Format and display table
  const table = formatTable(hooks);
  console.log(table);
}

/**
 * Format hooks as table
 */
function formatTable(hooks: Record<string, any>): string {
  const lines: string[] = [];
  
  // Calculate column widths
  let maxCommandWidth = 'Command'.length;
  let maxSuccessWidth = 'Success Art'.length;
  let maxErrorWidth = 'Error Art'.length;
  
  for (const [command, hook] of Object.entries(hooks)) {
    maxCommandWidth = Math.max(maxCommandWidth, command.length);
    maxSuccessWidth = Math.max(maxSuccessWidth, (hook.success || '(default)').length);
    maxErrorWidth = Math.max(maxErrorWidth, (hook.error || '(default)').length);
  }
  
  // Add padding
  maxCommandWidth += 2;
  maxSuccessWidth += 2;
  maxErrorWidth += 2;
  
  // Create header
  lines.push(
    'Command'.padEnd(maxCommandWidth) +
    'Success Art'.padEnd(maxSuccessWidth) +
    'Error Art'.padEnd(maxErrorWidth)
  );
  
  // Add separator
  lines.push(
    '-'.repeat(maxCommandWidth - 1) + ' ' +
    '-'.repeat(maxSuccessWidth - 1) + ' ' +
    '-'.repeat(maxErrorWidth - 1)
  );
  
  // Add rows
  for (const [command, hook] of Object.entries(hooks)) {
    const successArt = hook.success || '(default)';
    const errorArt = hook.error || '(default)';
    
    lines.push(
      command.padEnd(maxCommandWidth) +
      successArt.padEnd(maxSuccessWidth) +
      errorArt.padEnd(maxErrorWidth)
    );
  }
  
  return lines.join('\n');
}