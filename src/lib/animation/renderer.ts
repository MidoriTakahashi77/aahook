import { WriteStream } from 'tty';

/**
 * Renderer class for terminal output control
 * Handles ANSI escape sequences for animation rendering
 */
export class Renderer {
  private stdout: WriteStream;
  private isInteractive: boolean;

  constructor(stdout: WriteStream = process.stdout) {
    this.stdout = stdout;
    this.isInteractive = stdout.isTTY || false;
  }

  /**
   * Hide terminal cursor
   */
  hideCursor(): void {
    if (this.isInteractive) {
      this.stdout.write('\x1b[?25l');
    }
  }

  /**
   * Show terminal cursor
   */
  showCursor(): void {
    if (this.isInteractive) {
      this.stdout.write('\x1b[?25h');
    }
  }

  /**
   * Clear current line
   */
  clearLine(): void {
    if (this.isInteractive) {
      this.stdout.write('\x1b[2K\r');
    }
  }

  /**
   * Clear screen from cursor position
   */
  clearScreen(): void {
    if (this.isInteractive) {
      this.stdout.write('\x1b[0J');
    }
  }

  /**
   * Move cursor to specific position
   */
  moveCursor(x: number, y: number): void {
    if (this.isInteractive) {
      this.stdout.write(`\x1b[${y};${x}H`);
    }
  }

  /**
   * Move cursor up by n lines
   */
  moveCursorUp(lines: number): void {
    if (this.isInteractive && lines > 0) {
      this.stdout.write(`\x1b[${lines}A`);
    }
  }

  /**
   * Move cursor down by n lines
   */
  moveCursorDown(lines: number): void {
    if (this.isInteractive && lines > 0) {
      this.stdout.write(`\x1b[${lines}B`);
    }
  }

  /**
   * Save current cursor position
   */
  savePosition(): void {
    if (this.isInteractive) {
      this.stdout.write('\x1b7');
    }
  }

  /**
   * Restore saved cursor position
   */
  restorePosition(): void {
    if (this.isInteractive) {
      this.stdout.write('\x1b8');
    }
  }

  /**
   * Write content to stdout
   */
  write(content: string): void {
    this.stdout.write(content);
  }

  /**
   * Write content with newline
   */
  writeLine(content: string): void {
    this.stdout.write(content + '\n');
  }

  /**
   * Clean up and restore terminal state
   */
  cleanup(): void {
    this.showCursor();
    // Don't add extra newline here - let the animation handle it
  }

  /**
   * Check if terminal supports animations
   */
  supportsAnimation(): boolean {
    return this.isInteractive && !process.env.CI && process.env.TERM !== 'dumb';
  }

  /**
   * Get terminal dimensions
   */
  getTerminalSize(): { columns: number; rows: number } {
    if (this.isInteractive) {
      return {
        columns: this.stdout.columns || 80,
        rows: this.stdout.rows || 24
      };
    }
    return { columns: 80, rows: 24 };
  }
}