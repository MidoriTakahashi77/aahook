import { AAManager } from '../aa-manager';
import { GalleryOptions } from '../../types/aa';

/**
 * Display local ASCII arts gallery
 */
export async function galleryCommand(options: GalleryOptions = {}): Promise<void> {
  const manager = new AAManager();
  
  try {
    const arts = await manager.listLocal();
    
    if (arts.length === 0) {
      console.log('\n📭 No ASCII arts installed yet.');
      console.log('💡 Try: npx aahook install animals/cat');
      console.log('💡 Or browse available arts: npx aahook browse\n');
      return;
    }
    
    console.log('\n🎨 === Local ASCII Arts Gallery ===\n');
    
    let displayed = 0;
    const limit = options.limit || arts.length;
    
    for (const art of arts) {
      if (displayed >= limit) break;
      
      if (!options.category || art.category === options.category) {
        console.log(`📌 [${art.name}]`);
        console.log('─'.repeat(30));
        console.log(art.content);
        console.log('─'.repeat(30));
        console.log();
        displayed++;
      }
    }
    
    console.log(`📊 Showing ${displayed} of ${arts.length} arts`);
    
    if (displayed < arts.length) {
      console.log(`💡 Use 'npx aahook gallery --limit ${arts.length}' to see all\n`);
    }
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}