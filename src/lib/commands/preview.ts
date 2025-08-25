import { AAManager } from '../aa-manager';
import { GitHubFetcher } from '../github-fetcher';
import { PreviewOptions } from '../../types/aa';

/**
 * Preview ASCII art (local or remote)
 */
export async function previewCommand(
  artPath: string,
  options: PreviewOptions = {}
): Promise<void> {
  const manager = new AAManager();
  
  try {
    let content: string;
    let source: string;
    
    if (options.remote) {
      // Preview from remote repository
      const fetcher = new GitHubFetcher();
      
      // Parse art path (format: category/name)
      const parts = artPath.split('/');
      if (parts.length !== 2) {
        throw new Error('Invalid art path. Use format: category/name');
      }
      
      const [category, name] = parts;
      
      console.log(`\n🔍 Fetching ${category}/${name} from repository...`);
      content = await fetcher.fetchArt(category, name);
      source = 'Remote Repository';
      
      // Also fetch and display metadata if available
      try {
        const categoryMeta = await fetcher.fetchCategory(category);
        const metadata = categoryMeta.arts?.find(a => a.name === name);
        
        if (metadata) {
          console.log(`\n📋 Metadata:`);
          console.log(`   Name: ${metadata.displayName}`);
          console.log(`   Description: ${metadata.description}`);
          console.log(`   Author: ${metadata.author}`);
          if (metadata.tags.length > 0) {
            console.log(`   Tags: ${metadata.tags.join(', ')}`);
          }
        }
      } catch {
        // Metadata is optional
      }
      
    } else {
      // Preview from local installation
      const art = await manager.getLocal(artPath);
      
      if (!art) {
        console.log(`\n❌ ASCII art '${artPath}' not found locally.`);
        console.log('💡 Try with --remote flag to preview from repository.');
        console.log('💡 Or use "npx aahook gallery" to see installed arts.\n');
        return;
      }
      
      content = art.content;
      source = 'Local Installation';
    }
    
    // Display the ASCII art
    console.log(`\n🎨 Preview (${source}):`);
    console.log('═'.repeat(50));
    console.log(content);
    console.log('═'.repeat(50));
    
    if (options.remote) {
      console.log(`\n💡 To install this art, run:`);
      console.log(`   npx aahook install ${artPath}\n`);
    } else {
      console.log(`\n💡 To use this art in hooks:`);
      console.log(`   npx aahook config --success ${artPath}.txt`);
      console.log(`   npx aahook config --error ${artPath}.txt\n`);
    }
    
  } catch (error: any) {
    if (error.message.includes('Not found')) {
      console.error(`\n❌ ASCII art not found: ${artPath}`);
      if (options.remote) {
        console.error('💡 Use "npx aahook browse" to see available arts in repository\n');
      } else {
        console.error('💡 Use "npx aahook gallery" to see installed arts\n');
      }
    } else {
      console.error(`\n❌ Preview failed: ${error.message}\n`);
    }
    process.exit(1);
  }
}