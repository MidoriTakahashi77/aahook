import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { AA, CategoryMetadata, IndexData } from '../types/aa';

/**
 * Fetches ASCII arts from GitHub repository
 */
export class GitHubFetcher {
  private baseUrl = 'https://raw.githubusercontent.com/MidoriTakahashi77/aahook/main/arts/';
  private cacheDir = path.join(process.env.HOME || '', '.aahook', 'cache');

  constructor() {
    this.ensureCacheDir();
  }

  /**
   * Fetch ASCII art content from GitHub
   */
  async fetchArt(category: string, name: string): Promise<string> {
    const url = `${this.baseUrl}${category}/${name}.txt`;
    return this.fetchText(url);
  }

  /**
   * Fetch category metadata
   */
  async fetchCategory(name: string): Promise<CategoryMetadata> {
    const url = `${this.baseUrl}${name}/META.json`;
    const content = await this.fetchText(url);
    return JSON.parse(content);
  }

  /**
   * Fetch index of all available arts
   */
  async fetchIndex(): Promise<IndexData> {
    const url = `${this.baseUrl}index.json`;
    
    // Try cache first
    const cached = await this.getCached<IndexData>('index');
    if (cached) {
      return cached;
    }

    try {
      const content = await this.fetchText(url);
      const index = JSON.parse(content);
      await this.setCached('index', index, 3600000); // Cache for 1 hour
      return index;
    } catch (error) {
      // If index.json doesn't exist, generate from known structure
      return this.generateDefaultIndex();
    }
  }

  /**
   * Fetch text content from URL
   */
  private fetchText(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000); // 10 second timeout

      https.get(url, (res) => {
        clearTimeout(timeout);
        
        if (res.statusCode === 404) {
          reject(new Error(`Not found: ${url}`));
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
          return;
        }

        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  /**
   * Get cached data
   */
  private async getCached<T>(key: string): Promise<T | null> {
    const cachePath = path.join(this.cacheDir, `${key}.json`);
    
    if (!fs.existsSync(cachePath)) {
      return null;
    }

    try {
      const stat = fs.statSync(cachePath);
      const content = fs.readFileSync(cachePath, 'utf8');
      const cache = JSON.parse(content);
      
      // Check expiration
      if (Date.now() - stat.mtimeMs > (cache.ttl || 3600000)) {
        fs.unlinkSync(cachePath);
        return null;
      }
      
      return cache.data as T;
    } catch {
      return null;
    }
  }

  /**
   * Set cached data
   */
  private async setCached<T>(key: string, data: T, ttl = 3600000): Promise<void> {
    const cachePath = path.join(this.cacheDir, `${key}.json`);
    const cache = { data, ttl };
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    if (fs.existsSync(this.cacheDir)) {
      const files = fs.readdirSync(this.cacheDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(this.cacheDir, file));
      });
    }
  }

  /**
   * Ensure cache directory exists
   */
  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Generate default index from known structure
   */
  private generateDefaultIndex(): IndexData {
    return {
      version: '1.0.0',
      updated: new Date().toISOString(),
      categories: [
        { name: 'animals', displayName: 'Animals 🐾', count: 2 },
        { name: 'celebrations', displayName: 'Celebrations 🎉', count: 2 },
        { name: 'developer', displayName: 'Developer 💻', count: 2 },
        { name: 'emotions', displayName: 'Emotions 😊', count: 3 }
      ],
      total: 9
    };
  }
}