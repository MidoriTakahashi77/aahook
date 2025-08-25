import { GitHubFetcher } from '../github-fetcher';
import { BrowseOptions } from '../../types/aa';

/**
 * Browse available ASCII arts in repository
 */
export async function browseCommand(options: BrowseOptions = {}): Promise<void> {
  const fetcher = new GitHubFetcher();
  
  try {
    console.log('\n🌐 Fetching available ASCII arts from repository...');
    
    // Clear cache if requested
    if (options.cache === false) {
      await fetcher.clearCache();
      console.log('🗑️  Cache cleared');
    }
    
    // Fetch index
    const index = await fetcher.fetchIndex();
    
    console.log('\n🎨 === Available ASCII Arts ===\n');
    console.log(`📊 Total: ${index.total} arts in ${index.categories.length} categories`);
    console.log(`📅 Updated: ${new Date(index.updated).toLocaleDateString()}\n`);
    
    // Display categories
    for (const category of index.categories) {
      console.log(`📁 ${category.displayName}`);
      console.log(`   Category: ${category.name}`);
      console.log(`   Arts: ${category.count}`);
      
      // Fetch and display arts in this category
      try {
        const categoryMeta = await fetcher.fetchCategory(category.name);
        
        if (categoryMeta.arts && categoryMeta.arts.length > 0) {
          console.log('   Available arts:');
          
          for (const art of categoryMeta.arts) {
            console.log(`     • ${art.name} - ${art.description}`);
            if (art.tags.length > 0) {
              console.log(`       Tags: ${art.tags.join(', ')}`);
            }
          }
        }
      } catch {
        // If META.json doesn't exist, just show count
        console.log(`   (${category.count} arts available)`);
      }
      
      console.log();
    }
    
    // Show installation instructions
    console.log('─'.repeat(50));
    console.log('\n💡 How to use:');
    console.log('   Preview: npx aahook preview <category>/<name> --remote');
    console.log('   Install: npx aahook install <category>/<name>');
    console.log('   Example: npx aahook install animals/cat\n');
    
    // Show contribution instructions
    console.log('🤝 Want to contribute your ASCII art?');
    console.log('   Submit a PR to: https://github.com/MidoriTakahashi77/aahook');
    console.log('   Add your art in: arts/<category>/<name>.txt\n');
    
  } catch (error: any) {
    console.error(`\n❌ Failed to browse repository: ${error.message}`);
    console.error('💡 Check your internet connection and try again.\n');
    process.exit(1);
  }
}