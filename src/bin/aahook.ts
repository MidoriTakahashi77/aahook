import * as fs from 'fs';
import * as path from 'path';
import { runWithHook } from '../lib/execute';
import { initCommand } from '../lib/init';
import { listCommand } from '../lib/list';
import { 
  galleryCommand, 
  installCommand, 
  previewCommand, 
  browseCommand,
  colorizeCommand,
  animateCommand,
  listAnimations
} from '../lib/commands';

function getVersion(): string {
  const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf8')
  );
  return packageJson.version;
}

function showHelp(): void {
  console.log(`
aahook - Display ASCII art when commands succeed or fail

Usage:
  aahook <command>        Execute command and show ASCII art based on result
  aahook init             Initialize aahook configuration
  aahook list             List configured hooks
  aahook gallery          Show installed ASCII arts
  aahook browse           Browse available ASCII arts in repository
  aahook install <art>    Install ASCII art from repository
  aahook preview <art>    Preview ASCII art
  aahook --help, -h       Show this help message
  aahook --version, -v    Show version information

ASCII Art Commands:
  aahook gallery [--category <name>] [--limit <n>]
    Show locally installed ASCII arts

  aahook browse [--no-cache]
    Browse available ASCII arts in the repository

  aahook install <category>/<name> [--overwrite] [--auto-config]
    Install ASCII art from repository

  aahook preview <name> [--remote]
    Preview ASCII art (local by default, --remote for repository)

  aahook colorize <name> [--theme <theme>] [--save]
    Apply color theme to ASCII art

  aahook animate <name> [--type <type>] [--speed <n>] [--loop <n>]
    Animate ASCII art with various effects

Examples:
  aahook init                    # Initialize ~/.aahook with default configuration
  aahook gallery                  # Show all installed ASCII arts
  aahook browse                   # Browse available arts online
  aahook install animals/cat      # Install cat ASCII art
  aahook preview cat              # Preview installed cat art
  aahook preview animals/dog --remote  # Preview dog art from repository

For more information, visit: https://github.com/MidoriTakahashi77/aahook
`);
}

function showVersion(): void {
  const version = getVersion();
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     @@@@@@    @@@@@@   @@   @@   @@@@@@   @@@@@@     ║
║    @@    @@  @@    @@  @@   @@  @@    @@  @@    @@   ║
║    @@@@@@@@  @@@@@@@@  @@@@@@@  @@    @@  @@    @@   ║
║    @@    @@  @@    @@  @@   @@  @@    @@  @@    @@   ║
║    @@    @@  @@    @@  @@   @@   @@@@@@   @@@@@@     ║
║                                                       ║
║    🎯 ASCII Art Hook for Your Commands! 🎯           ║
║                                                       ║
║    Version: ${version.padEnd(42)}║
║    Ready to make your terminal fun! ✨               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
}

function parseArgs(args: string[]): { command: string; options: any; params: string[] } {
  const command = args[0];
  const options: any = {};
  const params: string[] = [];
  
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        options[key] = args[i + 1];
        i++;
      } else {
        options[key] = true;
      }
    } else {
      params.push(args[i]);
    }
  }
  
  return { command, options, params };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const { command, options, params } = parseArgs(args);
  
  try {
    switch(command) {
      case '--help':
      case '-h':
        showHelp();
        break;
        
      case '--version':
      case '-v':
        showVersion();
        break;
        
      case 'init':
        await initCommand();
        break;
        
      case 'list':
        listCommand();
        break;
        
      case 'gallery':
        await galleryCommand({
          category: options.category,
          limit: options.limit ? parseInt(options.limit) : undefined
        });
        break;
        
      case 'browse':
        await browseCommand({
          cache: options['no-cache'] ? false : true
        });
        break;
        
      case 'install':
        if (params.length === 0) {
          console.error('Error: Please specify an art to install (e.g., animals/cat)');
          process.exit(1);
        }
        await installCommand(params[0], {
          overwrite: options.overwrite || false,
          autoConfig: options['auto-config'] || false
        });
        break;
        
      case 'preview':
        if (params.length === 0) {
          console.error('Error: Please specify an art to preview');
          process.exit(1);
        }
        await previewCommand(params[0], {
          remote: options.remote || false
        });
        break;
        
      case 'colorize':
        if (params.length === 0 && !options['list-themes']) {
          console.error('Error: Please specify an art to colorize');
          process.exit(1);
        }
        await colorizeCommand(params[0], {
          theme: options.theme,
          custom: options.custom,
          save: options.save || false,
          preview: options.preview || false,
          listThemes: options['list-themes'] || false,
          output: options.output
        });
        break;
        
      case 'animate':
        if (params.length === 0 && !options.list) {
          console.error('Error: Please specify an art to animate');
          process.exit(1);
        }
        if (options.list) {
          await listAnimations();
        } else {
          await animateCommand(params[0], {
            type: options.type as any,
            speed: options.speed ? parseInt(options.speed) : undefined,
            fps: options.fps ? parseInt(options.fps) : undefined,
            loop: options.loop ? parseInt(options.loop) : undefined,
            direction: options.direction as any,
            theme: options.theme,
            save: options.save || false,
            preview: options.preview || false
          });
        }
        break;
        
      default:
        // Execute command with hook
        runWithHook(args);
    }
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

main();