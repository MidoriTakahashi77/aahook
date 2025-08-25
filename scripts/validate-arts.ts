#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

/**
 * ASCII Art Security Validator
 * Checks for potentially malicious control characters and escape sequences
 */

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationSummary {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  errors: ValidationResult[];
  warnings: ValidationResult[];
}

class ArtValidator {
  private readonly artsDir: string;
  private readonly results: ValidationResult[] = [];
  
  // Dangerous patterns to check
  private readonly dangerousPatterns = {
    // ANSI escape sequences that could hijack terminal
    ansiCursorControl: /\x1b\[[0-9;]*[HfABCDEFGJKSTsu]/g,
    ansiEraseScreen: /\x1b\[[0-9;]*[JK]/g,
    ansiDeviceControl: /\x1b\[[\?!][0-9;]*[a-zA-Z]/g,
    
    // Terminal control sequences
    bellCharacter: /\x07/g,
    escapeCharacter: /\x1b(?!\[)/g,
    
    // Other control characters (except newline, tab, carriage return)
    controlChars: /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,
    
    // Shell command injection attempts
    shellCommands: /(\$\(|`|&&|\|\||;|\n\s*(rm|curl|wget|sh|bash|eval|exec))/g,
    
    // Unicode direction override characters (could hide malicious code)
    unicodeOverride: /[\u202A-\u202E\u2066-\u2069]/g,
  };
  
  // Allowed ANSI color codes (safe)
  private readonly allowedAnsiColors = /\x1b\[(0|[34][0-7]|[019]|2[1-9]|[34]9|[56]0)m/g;
  
  constructor(artsDir: string = path.join(process.cwd(), 'arts')) {
    this.artsDir = artsDir;
  }
  
  /**
   * Validate a single art file
   */
  private validateFile(filePath: string): ValidationResult {
    const relativePath = path.relative(this.artsDir, filePath);
    const result: ValidationResult = {
      file: relativePath,
      valid: true,
      errors: [],
      warnings: []
    };
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check file size (max 10KB for ASCII art)
      const fileSize = Buffer.byteLength(content, 'utf8');
      if (fileSize > 10240) {
        result.errors.push(`File too large: ${fileSize} bytes (max: 10240)`);
        result.valid = false;
      }
      
      // Check line length (max 120 characters)
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.length > 120) {
          result.warnings.push(`Line ${index + 1} too long: ${line.length} chars (recommended max: 120)`);
        }
      });
      
      // Check for dangerous patterns
      for (const [name, pattern] of Object.entries(this.dangerousPatterns)) {
        const matches = content.match(pattern);
        if (matches) {
          // Filter out allowed ANSI colors from escape sequences
          if (name === 'escapeCharacter') {
            const dangerous = matches.filter(m => {
              const testStr = m + content.substring(content.indexOf(m) + 1, content.indexOf(m) + 10);
              return !testStr.match(this.allowedAnsiColors);
            });
            if (dangerous.length > 0) {
              result.errors.push(`Dangerous escape sequences found: ${name}`);
              result.valid = false;
            }
          } else {
            result.errors.push(`Dangerous pattern found: ${name} (${matches.length} occurrences)`);
            result.valid = false;
          }
        }
      }
      
      // Check for non-printable characters
      const nonPrintable = content.match(/[^\x20-\x7E\n\r\t]/g);
      if (nonPrintable) {
        // Allow common emoji and UTF-8 characters
        const filtered = nonPrintable.filter(char => {
          const code = char.charCodeAt(0);
          // Allow emoji range and common UTF-8 symbols
          return !(code >= 0x1F300 && code <= 0x1F9FF) && // Emoji
                 !(code >= 0x2600 && code <= 0x27BF) &&  // Misc symbols
                 !(code >= 0x2000 && code <= 0x206F);    // General punctuation
        });
        
        if (filtered.length > 0) {
          const codes = filtered.slice(0, 5).map(c => `0x${c.charCodeAt(0).toString(16)}`);
          result.warnings.push(`Non-printable characters found: ${codes.join(', ')}${filtered.length > 5 ? '...' : ''}`);
        }
      }
      
      // Check for suspicious URLs
      const urls = content.match(/https?:\/\/[^\s]+/g);
      if (urls) {
        const suspicious = urls.filter(url => {
          // Allow GitHub and npm URLs
          return !url.includes('github.com') && !url.includes('npmjs.com');
        });
        if (suspicious.length > 0) {
          result.warnings.push(`External URLs found: ${suspicious.join(', ')}`);
        }
      }
      
    } catch (error: any) {
      result.errors.push(`Failed to read file: ${error.message}`);
      result.valid = false;
    }
    
    return result;
  }
  
  /**
   * Recursively find all .txt files in arts directory
   */
  private findArtFiles(dir: string): string[] {
    const files: string[] = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip hidden directories
          if (!entry.name.startsWith('.')) {
            files.push(...this.findArtFiles(fullPath));
          }
        } else if (entry.isFile() && entry.name.endsWith('.txt')) {
          files.push(fullPath);
        }
      }
    } catch (error: any) {
      console.error(`Error reading directory ${dir}: ${error.message}`);
    }
    
    return files;
  }
  
  /**
   * Validate all art files
   */
  public validate(): ValidationSummary {
    const files = this.findArtFiles(this.artsDir);
    
    for (const file of files) {
      const result = this.validateFile(file);
      this.results.push(result);
    }
    
    const errors = this.results.filter(r => !r.valid);
    const warnings = this.results.filter(r => r.warnings.length > 0);
    
    return {
      totalFiles: files.length,
      validFiles: this.results.filter(r => r.valid).length,
      invalidFiles: errors.length,
      errors,
      warnings
    };
  }
  
  /**
   * Print validation report
   */
  public printReport(summary: ValidationSummary): void {
    console.log('\n🔍 ASCII Art Validation Report\n');
    console.log('═'.repeat(50));
    
    console.log(`📊 Summary:`);
    console.log(`   Total files: ${summary.totalFiles}`);
    console.log(`   ✅ Valid: ${summary.validFiles}`);
    console.log(`   ❌ Invalid: ${summary.invalidFiles}`);
    console.log(`   ⚠️  Warnings: ${summary.warnings.length}`);
    
    if (summary.errors.length > 0) {
      console.log('\n❌ Errors:');
      for (const result of summary.errors) {
        console.log(`\n   File: ${result.file}`);
        for (const error of result.errors) {
          console.log(`      ❌ ${error}`);
        }
      }
    }
    
    if (summary.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      for (const result of summary.warnings) {
        if (result.warnings.length > 0) {
          console.log(`\n   File: ${result.file}`);
          for (const warning of result.warnings) {
            console.log(`      ⚠️  ${warning}`);
          }
        }
      }
    }
    
    console.log('\n' + '═'.repeat(50));
    
    if (summary.invalidFiles > 0) {
      console.log('\n❌ Validation FAILED');
      console.log('   Fix the errors above before committing.\n');
    } else if (summary.warnings.length > 0) {
      console.log('\n⚠️  Validation PASSED with warnings');
      console.log('   Consider addressing the warnings above.\n');
    } else {
      console.log('\n✅ Validation PASSED');
      console.log('   All ASCII art files are safe!\n');
    }
  }
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2);
  const artsDir = args[0] || path.join(process.cwd(), 'arts');
  
  if (!fs.existsSync(artsDir)) {
    console.error(`❌ Arts directory not found: ${artsDir}`);
    process.exit(1);
  }
  
  const validator = new ArtValidator(artsDir);
  const summary = validator.validate();
  validator.printReport(summary);
  
  // Exit with error code if validation failed
  process.exit(summary.invalidFiles > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  main();
}

export { ArtValidator, ValidationResult, ValidationSummary };