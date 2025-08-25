#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

interface IndexData {
  version: string;
  updated: string;
  categories: CategoryInfo[];
  total: number;
}

interface CategoryInfo {
  name: string;
  displayName: string;
  count: number;
}

/**
 * Generate index.json for arts directory
 */
function generateIndex(): void {
  const artsDir = path.join(__dirname, '..', 'arts');
  const indexPath = path.join(artsDir, 'index.json');
  
  const categories: CategoryInfo[] = [];
  let totalArts = 0;

  // Read all directories in arts/
  const dirs = fs.readdirSync(artsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const dir of dirs) {
    const categoryPath = path.join(artsDir, dir);
    const metaPath = path.join(categoryPath, 'META.json');
    
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      
      // Count .txt files in directory
      const artFiles = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.txt'));
      
      categories.push({
        name: meta.name,
        displayName: meta.displayName,
        count: artFiles.length
      });
      
      totalArts += artFiles.length;
    }
  }

  const index: IndexData = {
    version: '1.0.0',
    updated: new Date().toISOString(),
    categories,
    total: totalArts
  };

  // Write index.json
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  
  console.log(`✅ Generated index.json`);
  console.log(`📊 Categories: ${categories.length}`);
  console.log(`🎨 Total arts: ${totalArts}`);
}

// Run if called directly
if (require.main === module) {
  generateIndex();
}

export { generateIndex };