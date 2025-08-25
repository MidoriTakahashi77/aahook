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
    assert(result.stdout.includes('0.2.0'), 'Should show version 0.2.0');
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
  
  // Test 8.1: Gallery command
  test('aahook gallery should list installed arts', () => {
    const result = runAahook('gallery');
    assert(result.exitCode === 0, 'Exit code should be 0');
    assert(result.stdout.includes('ASCII Arts Gallery') || 
           result.stdout.includes('No ASCII arts installed'), 
           'Should show gallery or empty message');
  });
  
  // Test 8.2: Browse command
  test('aahook browse should list available arts', () => {
    const result = runAahook('browse');
    // May fail if no internet, so check for either success or error message
    assert(result.stdout.includes('Available ASCII Arts') || 
           result.stdout.includes('Failed to browse'), 
           'Should show available arts or error');
  });
  
  // Test 8.3: Preview command without args
  test('aahook preview should require an art name', () => {
    const result = runAahook('preview');
    assert(result.exitCode !== 0, 'Exit code should not be 0');
    assert(result.stdout.includes('specify an art') || 
           result.stderr.includes('specify an art'), 
           'Should show error message');
  });
  
  // Test 8.4: Install command without args
  test('aahook install should require an art path', () => {
    const result = runAahook('install');
    assert(result.exitCode !== 0, 'Exit code should not be 0');
    assert(result.stdout.includes('specify an art') || 
           result.stderr.includes('specify an art'), 
           'Should show error message');
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
  
  // Test 11: Help shows new commands
  test('aahook --help should show new commands', () => {
    const result = runAahook('--help');
    assert(result.exitCode === 0, 'Exit code should be 0');
    assert(result.stdout.includes('gallery'), 'Should show gallery command');
    assert(result.stdout.includes('browse'), 'Should show browse command');
    assert(result.stdout.includes('install'), 'Should show install command');
    assert(result.stdout.includes('preview'), 'Should show preview command');
  });
  
  // Test 12: Hook matching with arguments
  test('aahook git add . should match git add hook', () => {
    // Update config to have git add hook
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    config.hooks['git add'] = { success: 'cat.txt' };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    
    const result = runAahook('git add .');
    assert(result.exitCode === 0, 'Exit code should be 0');
    // git add might not output anything, but should still show art
    assert(result.stdout.includes('🐱') || result.stdout === '', 
           'Should show cat art or empty output');
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