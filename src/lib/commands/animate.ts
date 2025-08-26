import * as fs from 'fs/promises';
import * as path from 'path';
import { AnimationEngine } from '../animation/animation-engine';
import { ColorEngine } from '../color/color-engine';
import { AAManager } from '../aa-manager';
import { AnimateOptions, AnimationType } from '../../types/animation';
import { getConfigDir } from '../config';

/**
 * Animate command - Apply animations to ASCII arts
 */
export async function animateCommand(
  artName: string,
  options: AnimateOptions = {}
): Promise<void> {
  try {
    // Load art content using AAManager
    const manager = new AAManager();
    let content: string;
    
    try {
      const art = await manager.getLocal(artName);
      if (!art) {
        throw new Error(`Art not found: ${artName}`);
      }
      content = art.content;
    } catch (error) {
      console.error(`Art file not found: ${artName}`);
      console.log('Use "npx aahook gallery" to see available arts');
      process.exit(1);
    }

    // Apply color theme if specified
    if (options.theme) {
      const colorEngine = new ColorEngine();
      const themes = await colorEngine.listThemes();
      
      if (!themes.includes(options.theme)) {
        console.error(`Theme not found: ${options.theme}`);
        console.log(`Available themes: ${themes.join(', ')}`);
        process.exit(1);
      }

      // Load the theme first, then apply it
      const theme = await colorEngine.loadTheme(options.theme);
      content = colorEngine.applyTheme(content, theme);
    }

    // Prepare animation options
    const animationOptions = {
      timing: {
        fps: 30,
        loop: typeof options.loop === 'string' ? -1 : (options.loop || 1),
        charDelay: options.speed ? 1000 / options.speed : 20, // Faster default speed
        lineDelay: options.speed ? 1000 / options.speed : 50, // Faster default speed
      },
      effects: {
        direction: options.direction || 'top',
      },
      preview: options.preview,
      theme: options.theme,
    };

    // Create animation engine
    const engine = new AnimationEngine(animationOptions);

    // Determine animation type
    const animationType: AnimationType = options.type || 'typing';

    // Handle frame animation differently
    if (animationType === 'frames') {
      const frames = await loadFrames(artName);
      if (frames.length === 0) {
        console.error('No frames found for frame animation');
        process.exit(1);
      }
      await engine.animate(frames, 'frames');
    } else {
      await engine.animate(content, animationType);
    }

    // Save animation definition if requested
    if (options.save) {
      await saveAnimationDefinition(artName, options);
      console.log(`\nAnimation saved for ${artName}`);
    }

  } catch (error) {
    console.error('Animation failed:', error);
    process.exit(1);
  }
}

/**
 * List available animations
 */
export async function listAnimations(): Promise<void> {
  const animationsPath = path.join(getConfigDir(), 'animations');
  
  try {
    const files = await fs.readdir(animationsPath);
    const animations = files.filter(f => f.endsWith('.json'));
    
    if (animations.length === 0) {
      console.log('No saved animations found');
      return;
    }

    console.log('Available animations:');
    for (const anim of animations) {
      const name = anim.replace('.json', '');
      const definition = await loadAnimationDefinition(name);
      console.log(`  - ${name} (${definition.type})`);
    }
  } catch (error) {
    console.log('No animations directory found');
  }
}

/**
 * Load frames for frame animation
 */
async function loadFrames(baseName: string): Promise<string[]> {
  const frames: string[] = [];
  const artsDir = path.join(getConfigDir(), 'arts');
  
  // Look for numbered frame files (e.g., cat-1.txt, cat-2.txt)
  let frameNumber = 1;
  while (frameNumber <= 100) { // Max 100 frames
    const framePath = path.join(artsDir, `${baseName}-${frameNumber}.txt`);
    try {
      const content = await fs.readFile(framePath, 'utf-8');
      frames.push(content);
      frameNumber++;
    } catch {
      break;
    }
  }

  return frames;
}

/**
 * Save animation definition
 */
async function saveAnimationDefinition(
  artName: string,
  options: AnimateOptions
): Promise<void> {
  const animationsPath = path.join(getConfigDir(), 'animations');
  
  // Create animations directory if it doesn't exist
  await fs.mkdir(animationsPath, { recursive: true });

  const definition = {
    name: artName,
    version: '1.0.0',
    type: options.type || 'typing',
    fps: 30,
    loop: options.loop || 1,
    effects: {
      direction: options.direction,
    },
    timing: {
      speed: options.speed,
    },
    theme: options.theme,
  };

  const definitionPath = path.join(animationsPath, `${artName}.json`);
  await fs.writeFile(definitionPath, JSON.stringify(definition, null, 2));
}

/**
 * Load animation definition
 */
async function loadAnimationDefinition(name: string): Promise<any> {
  const animationsPath = path.join(getConfigDir(), 'animations');
  const definitionPath = path.join(animationsPath, `${name}.json`);
  
  const content = await fs.readFile(definitionPath, 'utf-8');
  return JSON.parse(content);
}