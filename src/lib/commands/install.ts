import { AAManager } from '../aa-manager';
import { GitHubFetcher } from '../github-fetcher';
import { InstallOptions } from '../../types/aa';
import { loadConfig, saveConfig } from '../config';
import * as readline from 'readline';

/**
 * Install ASCII art from remote repository
 */
export async function installCommand(
  artPath: string,
  options: InstallOptions = {}
): Promise<void> {
  const manager = new AAManager();
  const fetcher = new GitHubFetcher();
  
  try {
    // Parse art path (format: category/name)
    const parts = artPath.split('/');
    if (parts.length !== 2) {
      throw new Error('Invalid art path. Use format: category/name');
    }
    
    const [category, name] = parts;
    
    // Check if already exists
    if (!options.overwrite && await manager.exists(name)) {
      console.log(`\n⚠️  ASCII art '${name}' already exists.`);
      console.log('💡 Use --overwrite flag to replace it.\n');
      return;
    }
    
    console.log(`\n📥 Installing ${category}/${name}...`);
    
    // Fetch ASCII art from GitHub
    const content = await fetcher.fetchArt(category, name);
    
    // Fetch metadata if available
    let metadata;
    try {
      const categoryMeta = await fetcher.fetchCategory(category);
      metadata = categoryMeta.arts?.find(a => a.name === name);
    } catch {
      // Metadata is optional
    }
    
    // Save locally
    const aa = {
      category,
      name,
      content,
      metadata
    };
    
    await manager.saveLocal(aa);
    console.log(`✅ Successfully installed '${name}'`);
    
    // Display the ASCII art
    console.log('\n🎨 Preview:');
    console.log('─'.repeat(40));
    console.log(content);
    console.log('─'.repeat(40));
    
    // Suggest hook configuration
    const suggestions = await manager.suggestHooks(aa);
    
    if (options.autoConfig && (suggestions.success || suggestions.error)) {
      // Auto-configure hooks
      const config = loadConfig();
      if (!config.hooks) {
        config.hooks = {};
      }
      // Set default hook for all commands
      config.hooks['*'] = {
        success: suggestions.success,
        error: suggestions.error
      };
      console.log(`\n🔗 Auto-configured hooks:`);
      if (suggestions.success) {
        console.log(`   Success: ${suggestions.success}`);
      }
      if (suggestions.error) {
        console.log(`   Error: ${suggestions.error}`);
      }
      saveConfig(config);
    } else if (suggestions.success || suggestions.error) {
      // Ask user for configuration
      console.log('\n💡 Suggested hook configuration:');
      
      if (suggestions.success) {
        console.log(`   Success hook: npx aahook config --success ${name}.txt`);
      }
      if (suggestions.error) {
        console.log(`   Error hook: npx aahook config --error ${name}.txt`);
      }
      
      if (!options.autoConfig) {
        const shouldConfig = await askYesNo('\nWould you like to apply these configurations?');
        
        if (shouldConfig) {
          const config = loadConfig();
          if (!config.hooks) {
            config.hooks = {};
          }
          // Set default hook for all commands
          config.hooks['*'] = {
            success: suggestions.success,
            error: suggestions.error
          };
          saveConfig(config);
          console.log('✅ Hook configuration updated');
        }
      }
    }
    
    console.log(`\n🎯 You can now use '${name}' in your hooks!\n`);
    
  } catch (error: any) {
    if (error.message.includes('Not found')) {
      console.error(`\n❌ ASCII art not found: ${artPath}`);
      console.error('💡 Use "npx aahook browse" to see available arts\n');
    } else {
      console.error(`\n❌ Installation failed: ${error.message}\n`);
    }
    process.exit(1);
  }
}

/**
 * Ask yes/no question
 */
function askYesNo(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}