#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Test configuration
const AAHOOK_BIN = path.join(__dirname, '..', 'bin', 'aahook.js');
const CONFIG_DIR = path.join(os.homedir(), '.aahook');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const TEST_BACKUP_DIR = `${CONFIG_DIR}.test-backup-${Date.now()}`;

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

// Test results
let passedTests = 0;
let failedTests = 0;

/**
 * Run a test
 */
function test(name, fn) {
  try {
    fn();
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}${error.message}${colors.reset}`);
    failedTests++;
  }
}

/**
 * Assert helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Execute aahook command
 */
function runAahook(args, options = {}) {
  try {
    const result = execSync(`node ${AAHOOK_BIN} ${args}`, {
      encoding: 'utf8',
      ...options
    });
    return { stdout: result, exitCode: 0 };
  } catch (error) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.status || 1
    };
  }
}

/**
 * Backup existing configuration
 */
function backupConfig() {
  if (fs.existsSync(CONFIG_DIR)) {
    console.log(`${colors.yellow}Backing up existing ~/.aahook...${colors.reset}`);
    fs.renameSync(CONFIG_DIR, TEST_BACKUP_DIR);
  }
}

/**
 * Restore configuration
 */
function restoreConfig() {
  // Remove test config
  if (fs.existsSync(CONFIG_DIR)) {
    fs.rmSync(CONFIG_DIR, { recursive: true, force: true });
  }
  
  // Restore backup
  if (fs.existsSync(TEST_BACKUP_DIR)) {
    console.log(`${colors.yellow}Restoring original ~/.aahook...${colors.reset}`);
    fs.renameSync(TEST_BACKUP_DIR, CONFIG_DIR);
  }
}

/**
 * Main test suite
 */
function runTests() {
  console.log('\n🧪 Running aahook tests...\n');
  
  // Test 1: Version command
  test('aahook --version should show version', () => {
    const result = runAahook('--version');
    assert(result.exitCode === 0, 'Exit code should be 0');
    assert(result.stdout.includes('0.1.0'), 'Should show version 0.1.0');
  });
  
  // Test 2: Help command
  test('aahook --help should show help', () => {
    const result = runAahook('--help');
    assert(result.exitCode === 0, 'Exit code should be 0');
    assert(result.stdout.includes('Usage:'), 'Should show usage');
    assert(result.stdout.includes('aahook init'), 'Should show init command');
  });
  
  // Test 3: Init command
  test('aahook init should create configuration', () => {
    const result = runAahook('init', { input: 'n\n' });
    assert(result.exitCode === 0, 'Exit code should be 0');
    assert(fs.existsSync(CONFIG_DIR), 'Config directory should exist');
    assert(fs.existsSync(CONFIG_FILE), 'Config file should exist');
    assert(fs.existsSync(path.join(CONFIG_DIR, 'arts')), 'Arts directory should exist');
  });
  
  // Test 4: List command
  test('aahook list should show configured hooks', () => {
    const result = runAahook('list');
    assert(result.exitCode === 0, 'Exit code should be 0');
    assert(result.stdout.includes('Command'), 'Should show table header');
    assert(result.stdout.includes('git push'), 'Should show git push hook');
    assert(result.stdout.includes('dragon.txt'), 'Should show dragon art');
  });
  
  // Test 5: Execute command with success
  test('aahook ls should execute and show success art', () => {
    const result = runAahook('ls');
    assert(result.exitCode === 0, 'Exit code should be 0');
    assert(result.stdout.includes('🐱'), 'Should show cat emoji');
    assert(result.stdout.includes('Done!'), 'Should show success message');
  });
  
  // Test 6: Execute command without hook
  test('aahook echo test should execute without art', () => {
    const result = runAahook('echo test');
    assert(result.exitCode === 0, 'Exit code should be 0');
    assert(result.stdout.includes('test'), 'Should show echo output');
    assert(!result.stdout.includes('🐱'), 'Should not show cat art');
  });
  
  // Test 7: Error handling - command not found
  test('aahook invalid-cmd should handle error', () => {
    const result = runAahook('invalid-cmd');
    assert(result.exitCode !== 0, 'Exit code should not be 0');
  });
  
  // Test 8: Config file validation
  test('Config file should have correct structure', () => {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    assert(config.version === '0.1.0', 'Should have correct version');
    assert(typeof config.hooks === 'object', 'Should have hooks object');
    assert(config.hooks['git push'], 'Should have git push hook');
  });
  
  // Test 9: Art files exist
  test('Art files should be created', () => {
    const artsDir = path.join(CONFIG_DIR, 'arts');
    assert(fs.existsSync(path.join(artsDir, 'success.txt')), 'success.txt should exist');
    assert(fs.existsSync(path.join(artsDir, 'error.txt')), 'error.txt should exist');
    assert(fs.existsSync(path.join(artsDir, 'dragon.txt')), 'dragon.txt should exist');
    assert(fs.existsSync(path.join(artsDir, 'cat.txt')), 'cat.txt should exist');
  });
  
  // Test 10: Reinitialize prompt
  test('aahook init should prompt when already initialized', () => {
    const result = runAahook('init', { input: 'n\n' });
    assert(result.stdout.includes('already exists') || result.stdout.includes('cancelled'), 
           'Should show already exists message or cancellation');
  });
}

/**
 * Main execution
 */
function main() {
  try {
    // Backup existing configuration
    backupConfig();
    
    // Run tests
    runTests();
    
    // Print summary
    console.log('\n' + '='.repeat(40));
    console.log(`Tests passed: ${colors.green}${passedTests}${colors.reset}`);
    if (failedTests > 0) {
      console.log(`Tests failed: ${colors.red}${failedTests}${colors.reset}`);
    }
    console.log('='.repeat(40) + '\n');
    
    // Restore configuration
    restoreConfig();
    
    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error(`${colors.red}Test suite failed: ${error.message}${colors.reset}`);
    restoreConfig();
    process.exit(1);
  }
}

// Run tests
main();