import * as fs from 'fs';
import * as path from 'path';
import { AA, AAMetadata, HookSuggestion } from '../types/aa';
import { CONFIG_DIR, ARTS_DIR, loadConfig, saveConfig, HookConfig } from './config';

/**
 * Manages local ASCII arts
 */
export class AAManager {
  private localArtsDir = ARTS_DIR;

  /**
   * List all local ASCII arts
   */
  async listLocal(): Promise<AA[]> {
    const arts: AA[] = [];
    
    if (!fs.existsSync(this.localArtsDir)) {
      return arts;
    }

    const files = fs.readdirSync(this.localArtsDir);
    
    for (const file of files) {
      if (file.endsWith('.txt')) {
        const name = file.replace('.txt', '');
        const content = fs.readFileSync(
          path.join(this.localArtsDir, file), 
          'utf8'
        );
        
        arts.push({
          category: 'local',
          name,
          content
        });
      }
    }

    return arts;
  }

  /**
   * Get a specific local ASCII art
   */
  async getLocal(name: string): Promise<AA | null> {
    const filePath = path.join(this.localArtsDir, `${name}.txt`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    return {
      category: 'local',
      name,
      content
    };
  }

  /**
   * Save ASCII art locally
   */
  async saveLocal(aa: AA): Promise<void> {
    if (!fs.existsSync(this.localArtsDir)) {
      fs.mkdirSync(this.localArtsDir, { recursive: true });
    }

    const filePath = path.join(this.localArtsDir, `${aa.name}.txt`);
    fs.writeFileSync(filePath, aa.content, 'utf8');
  }

  /**
   * Check if ASCII art exists locally
   */
  async exists(name: string): Promise<boolean> {
    const filePath = path.join(this.localArtsDir, `${name}.txt`);
    return fs.existsSync(filePath);
  }

  /**
   * Delete local ASCII art
   */
  async deleteLocal(name: string): Promise<boolean> {
    const filePath = path.join(this.localArtsDir, `${name}.txt`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    
    return false;
  }

  /**
   * Add ASCII art to config
   */
  async addToConfig(name: string, hooks: HookConfig): Promise<void> {
    try {
      const config = loadConfig();
      
      // Add or update hook configuration
      if (hooks.success || hooks.error) {
        config.hooks[name] = hooks;
        saveConfig(config);
      }
    } catch (error) {
      // If config doesn't exist, create default
      const defaultConfig = {
        version: '0.1.0',
        hooks: {
          [name]: hooks
        }
      };
      saveConfig(defaultConfig);
    }
  }

  /**
   * Suggest hooks for ASCII art based on metadata
   */
  async suggestHooks(aa: AA): Promise<HookConfig> {
    const suggestions: HookConfig = {};

    if (aa.metadata?.suggestedHooks) {
      if (aa.metadata.suggestedHooks.success) {
        suggestions.success = aa.name + '.txt';
      }
      if (aa.metadata.suggestedHooks.error) {
        suggestions.error = aa.name + '.txt';
      }
    } else {
      // Default suggestions based on category
      switch (aa.category) {
        case 'celebrations':
          suggestions.success = aa.name + '.txt';
          break;
        case 'emotions':
          if (aa.name.includes('error') || aa.name.includes('sad')) {
            suggestions.error = aa.name + '.txt';
          } else {
            suggestions.success = aa.name + '.txt';
          }
          break;
        case 'developer':
          suggestions.success = aa.name + '.txt';
          break;
        case 'animals':
          suggestions.success = aa.name + '.txt';
          break;
      }
    }

    return suggestions;
  }

  /**
   * Get suggested commands for an ASCII art
   */
  async getSuggestedCommands(aa: AA): Promise<HookSuggestion[]> {
    const suggestions: HookSuggestion[] = [];

    if (aa.metadata?.suggestedHooks) {
      if (aa.metadata.suggestedHooks.success) {
        aa.metadata.suggestedHooks.success.forEach(cmd => {
          suggestions.push({ command: cmd, type: 'success' });
        });
      }
      if (aa.metadata.suggestedHooks.error) {
        aa.metadata.suggestedHooks.error.forEach(cmd => {
          suggestions.push({ command: cmd, type: 'error' });
        });
      }
    }

    return suggestions;
  }

  /**
   * List all local ASCII arts with full paths
   */
  async listLocalWithPaths(): Promise<Map<string, string>> {
    const artPaths = new Map<string, string>();
    
    if (!fs.existsSync(this.localArtsDir)) {
      return artPaths;
    }

    const files = fs.readdirSync(this.localArtsDir);
    
    for (const file of files) {
      if (file.endsWith('.txt')) {
        const name = file.replace('.txt', '');
        artPaths.set(name, path.join(this.localArtsDir, file));
      }
    }

    return artPaths;
  }
}