import { Renderer } from './renderer';
import { TimingController } from './timing-controller';
import { AnimationType, AnimationOptions, Direction } from '../../types/animation';

/**
 * Main animation engine for rendering various animation types
 */
export class AnimationEngine {
  private renderer: Renderer;
  private timingController: TimingController;
  private interrupted: boolean = false;

  constructor(private options: AnimationOptions = {}) {
    this.renderer = new Renderer();
    this.timingController = new TimingController(options.timing);
    this.setupInterruptHandler();
  }

  /**
   * Animate content with specified animation type
   */
  async animate(
    content: string | string[],
    type: AnimationType = 'typing'
  ): Promise<void> {
    // Check if terminal supports animation
    if (!this.renderer.supportsAnimation() && !this.options.preview) {
      // Fallback to static display
      this.renderer.write(Array.isArray(content) ? content.join('\n') : content);
      return;
    }

    this.interrupted = false;

    switch (type) {
      case 'typing':
        await this.animateTyping(content as string);
        break;
      case 'fade':
        await this.animateFade(content as string);
        break;
      case 'frames':
        await this.animateFrames(content as string[]);
        break;
      case 'blink':
        await this.animateBlink(content as string);
        break;
      case 'slide':
        await this.animateSlide(content as string);
        break;
      default:
        this.renderer.write(Array.isArray(content) ? content.join('\n') : content);
    }
  }

  /**
   * Typing animation - display characters one by one
   */
  private async animateTyping(content: string): Promise<void> {
    this.renderer.hideCursor();
    const chars = content.split('');
    const delay = Math.max(10, this.timingController.getCharDelay()); // Minimum 10ms delay

    for (let i = 0; i < chars.length && !this.interrupted; i++) {
      this.renderer.write(chars[i]);
      if (chars[i] !== '\n') {
        await this.timingController.wait(delay);
      }
    }

    // Ensure content ends with a newline
    if (!content.endsWith('\n')) {
      this.renderer.write('\n');
    }

    this.renderer.showCursor();
  }

  /**
   * Fade animation - display lines progressively
   */
  private async animateFade(content: string): Promise<void> {
    const lines = content.split('\n');
    const delay = Math.max(30, this.timingController.getLineDelay());
    const direction = this.options.effects?.direction || 'top';

    // Hide cursor during animation
    this.renderer.hideCursor();
    
    // Clear the area first
    for (let j = 0; j < lines.length; j++) {
      this.renderer.writeLine('');
    }
    
    // Move back to start position
    for (let j = 0; j < lines.length; j++) {
      this.renderer.moveCursorUp(1);
    }
    
    // Save initial position
    this.renderer.savePosition();

    // Determine fade order based on direction
    let linesToShow: number[] = [];
    
    if (direction === 'top' || direction === 'up') {
      // Fade from top to bottom
      for (let i = 0; i < lines.length && !this.interrupted; i++) {
        linesToShow.push(i);
        await this.renderFadeFrame(lines, linesToShow);
        await this.timingController.wait(delay);
      }
    } else if (direction === 'bottom' || direction === 'down') {
      // Fade from bottom to top
      for (let i = lines.length - 1; i >= 0 && !this.interrupted; i--) {
        linesToShow.unshift(i);
        await this.renderFadeFrame(lines, linesToShow);
        await this.timingController.wait(delay);
      }
    } else if (direction === 'left') {
      // Fade all lines character by character from left
      const maxLength = Math.max(...lines.map(l => l.length));
      for (let charIndex = 1; charIndex <= maxLength && !this.interrupted; charIndex++) {
        this.renderer.restorePosition();
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          this.renderer.clearLine();
          const visiblePart = lines[lineIndex].substring(0, charIndex);
          this.renderer.writeLine(visiblePart);
        }
        await this.timingController.wait(delay / 2); // Faster for character fade
      }
      this.renderer.showCursor();
      return;
    } else if (direction === 'right') {
      // Fade all lines character by character from right
      const maxLength = Math.max(...lines.map(l => l.length));
      for (let charIndex = 1; charIndex <= maxLength && !this.interrupted; charIndex++) {
        this.renderer.restorePosition();
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          this.renderer.clearLine();
          const line = lines[lineIndex];
          const visiblePart = line.substring(Math.max(0, line.length - charIndex));
          const padding = ' '.repeat(Math.max(0, line.length - visiblePart.length));
          this.renderer.writeLine(padding + visiblePart);
        }
        await this.timingController.wait(delay / 2); // Faster for character fade
      }
      this.renderer.showCursor();
      return;
    }
    
    this.renderer.showCursor();
  }
  
  /**
   * Render a single frame of fade animation
   */
  private async renderFadeFrame(lines: string[], linesToShow: number[]): Promise<void> {
    this.renderer.restorePosition();
    
    for (let i = 0; i < lines.length; i++) {
      this.renderer.clearLine();
      if (linesToShow.includes(i)) {
        this.renderer.writeLine(lines[i]);
      } else {
        this.renderer.writeLine('');
      }
    }
  }

  /**
   * Frame animation - cycle through multiple frames
   */
  private async animateFrames(frames: string[]): Promise<void> {
    if (!frames || frames.length === 0) return;

    const frameDelay = this.timingController.getFrameDelay();
    const loops = this.options.timing?.loop || 1;

    this.renderer.hideCursor();
    this.renderer.savePosition();

    let currentLoop = 0;
    while (this.timingController.shouldContinueLoop(currentLoop) && !this.interrupted) {
      for (const frame of frames) {
        if (this.interrupted) break;
        
        this.renderer.restorePosition();
        this.clearFrame(frame);
        this.renderer.write(frame);
        
        await this.timingController.wait(frameDelay);
      }
      currentLoop++;
    }

    this.renderer.showCursor();
  }

  /**
   * Blink animation - make content blink
   */
  private async animateBlink(content: string): Promise<void> {
    const pattern = this.options.effects?.pattern;
    const blinkDelay = 500; // Default blink delay
    const loops = this.options.timing?.loop || 3;

    let processedContent = content;
    if (pattern) {
      // Apply blink only to matched patterns
      const regex = new RegExp(pattern, 'g');
      processedContent = content.replace(regex, '\x1b[5m$&\x1b[25m');
      this.renderer.write(processedContent);
    } else {
      // Blink entire content
      let currentLoop = 0;
      while (currentLoop < loops && !this.interrupted) {
        this.renderer.write(content);
        await this.timingController.wait(blinkDelay);
        
        this.renderer.clearLine();
        this.renderer.write('\r');
        await this.timingController.wait(blinkDelay);
        
        currentLoop++;
      }
      this.renderer.write(content);
    }
  }

  /**
   * Slide animation - slide content from direction
   */
  private async animateSlide(content: string): Promise<void> {
    const direction = this.options.effects?.direction || 'left';
    const lines = content.split('\n');
    const terminalSize = this.renderer.getTerminalSize();
    const delay = 20; // Faster slide speed for smoother animation

    switch (direction) {
      case 'left':
      case 'right':
        await this.slideHorizontal(lines, direction, terminalSize.columns, delay);
        break;
      case 'top':
      case 'up':
      case 'bottom':
      case 'down':
        await this.slideVertical(lines, direction, delay);
        break;
    }
  }

  /**
   * Slide content horizontally
   */
  private async slideHorizontal(
    lines: string[],
    direction: 'left' | 'right',
    maxWidth: number,
    delay: number
  ): Promise<void> {
    const maxLineLength = Math.max(...lines.map(l => l.length));
    const steps = Math.min(maxLineLength + 10, maxWidth); // Add some padding for smooth exit
    
    // Hide cursor and save initial position
    this.renderer.hideCursor();
    
    // Clear area first
    for (let j = 0; j < lines.length; j++) {
      this.renderer.clearLine();
      if (j < lines.length - 1) {
        this.renderer.writeLine('');
      }
    }
    
    // Move back to start position
    for (let j = 0; j < lines.length; j++) {
      this.renderer.moveCursorUp(1);
    }

    for (let i = 0; i <= steps && !this.interrupted; i++) {
      // Save cursor position
      this.renderer.savePosition();
      
      for (const line of lines) {
        this.renderer.clearLine();
        if (direction === 'left') {
          // Slide from right to left
          const offset = steps - i;
          const padding = ' '.repeat(Math.max(0, offset));
          this.renderer.write(padding + line);
        } else {
          // Slide from left to right  
          const padding = ' '.repeat(Math.max(0, i));
          this.renderer.write(padding + line);
        }
        
        if (lines.indexOf(line) < lines.length - 1) {
          this.renderer.writeLine('');
        }
      }
      
      await this.timingController.wait(delay);
      
      // Restore position for next frame
      this.renderer.restorePosition();
    }
    
    // Final render at target position
    this.renderer.savePosition();
    for (const line of lines) {
      this.renderer.clearLine();
      if (direction === 'left') {
        this.renderer.writeLine(line);
      } else {
        const padding = ' '.repeat(Math.min(steps, maxWidth - line.length));
        this.renderer.writeLine(padding + line);
      }
    }
    
    this.renderer.showCursor();
  }

  /**
   * Slide content vertically
   */
  private async slideVertical(
    lines: string[],
    direction: Direction,
    delay: number
  ): Promise<void> {
    const isTopDirection = direction === 'top' || direction === 'up';
    const orderedLines = isTopDirection ? lines : [...lines].reverse();

    for (let i = 0; i < orderedLines.length && !this.interrupted; i++) {
      this.renderer.writeLine(orderedLines[i]);
      await this.timingController.wait(delay);
    }
  }

  /**
   * Get ordered lines based on direction
   */
  private getOrderedLines(lines: string[], direction: Direction): string[] {
    switch (direction) {
      case 'bottom':
      case 'down':
        return [...lines].reverse();
      case 'left':
      case 'right':
        // For horizontal fade, still show line by line
        return lines;
      default:
        return lines;
    }
  }

  /**
   * Clear frame area
   */
  private clearFrame(frame: string): void {
    const lines = frame.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.renderer.clearLine();
      if (i < lines.length - 1) {
        this.renderer.moveCursorDown(1);
      }
    }
  }

  /**
   * Setup interrupt handler for Ctrl+C
   */
  private setupInterruptHandler(): void {
    const handler = () => {
      this.interrupted = true;
      this.cleanup();
    };

    process.on('SIGINT', handler);
    
    // Store handler for cleanup
    (this as any).interruptHandler = handler;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.renderer.cleanup();
    
    // Remove interrupt handler
    if ((this as any).interruptHandler) {
      process.removeListener('SIGINT', (this as any).interruptHandler);
    }
  }
}