#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { runWithHook } from '../lib/execute';

function getVersion(): string {
  const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf8')
  );
  return packageJson.version;
}

function showHelp(): void {
  console.log(`
aahook - Display ASCII art when commands succeed or fail

Usage:
  aahook <command>        Execute command and show ASCII art based on result
  aahook init             Initialize aahook configuration
  aahook list             List configured hooks
  aahook --help, -h       Show this help message
  aahook --version, -v    Show version information

Examples:
  aahook init            # Initialize ~/.aahook with default configuration
  aahook ls              # Run ls command with ASCII art
  aahook git push        # Run git push with custom success/error art

For more information, visit: https://github.com/yourusername/aahook
`);
}

function showVersion(): void {
  console.log(`aahook v${getVersion()}`);
}

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const firstArg = args[0];
  
  switch(firstArg) {
    case '--help':
    case '-h':
      showHelp();
      break;
      
    case '--version':
    case '-v':
      showVersion();
      break;
      
    case 'init':
      console.log('Init command not yet implemented');
      break;
      
    case 'list':
      console.log('List command not yet implemented');
      break;
      
    default:
      // Execute command with hook
      runWithHook(args);
  }
}

main();