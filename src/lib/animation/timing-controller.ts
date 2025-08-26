import { TimingOptions, EasingFunction } from '../../types/animation';

/**
 * TimingController manages animation timing and easing functions
 */
export class TimingController {
  private startTime: number = 0;
  private pausedTime: number = 0;
  private isPaused: boolean = false;

  constructor(private options: TimingOptions = {}) {
    this.options = {
      duration: options.duration || 1000,
      delay: options.delay || 0,
      fps: options.fps || 30,
      loop: options.loop || 1,
      easing: options.easing || 'linear'
    };
  }

  /**
   * Wait for specified milliseconds
   */
  async wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Calculate delay based on easing function
   */
  calculateDelay(index: number, total: number): number {
    if (total <= 1) return 0;

    const progress = index / (total - 1);
    const easedProgress = this.applyEasing(progress);
    return easedProgress * (this.options.duration || 1000);
  }

  /**
   * Apply easing function to progress value
   */
  private applyEasing(progress: number): number {
    switch (this.options.easing) {
      case 'ease-in':
        return this.easeIn(progress);
      case 'ease-out':
        return this.easeOut(progress);
      case 'ease-in-out':
        return this.easeInOut(progress);
      case 'cubic-bezier':
        return this.cubicBezier(progress);
      case 'linear':
      default:
        return progress;
    }
  }

  /**
   * Ease-in function (slow start)
   */
  private easeIn(t: number): number {
    return t * t;
  }

  /**
   * Ease-out function (slow end)
   */
  private easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 2);
  }

  /**
   * Ease-in-out function (slow start and end)
   */
  private easeInOut(t: number): number {
    return t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /**
   * Cubic bezier approximation
   */
  private cubicBezier(t: number): number {
    // Approximation of cubic-bezier(0.4, 0, 0.2, 1)
    const c1 = 0.4;
    const c2 = 0.2;
    return t * (2 * (1 - t) * c1 + t * c2);
  }

  /**
   * Get delay between frames based on FPS
   */
  getFrameDelay(): number {
    return 1000 / (this.options.fps || 30);
  }

  /**
   * Get delay for character-by-character animation
   */
  getCharDelay(): number {
    return this.options.charDelay || 50;
  }

  /**
   * Get delay for line-by-line animation
   */
  getLineDelay(): number {
    return this.options.lineDelay || 100;
  }

  /**
   * Check if should continue looping
   */
  shouldContinueLoop(currentLoop: number): boolean {
    const maxLoops = this.options.loop || 1;
    return maxLoops === -1 || currentLoop < maxLoops;
  }

  /**
   * Start timing
   */
  start(): void {
    this.startTime = Date.now();
    this.isPaused = false;
  }

  /**
   * Pause timing
   */
  pause(): void {
    if (!this.isPaused) {
      this.pausedTime = Date.now();
      this.isPaused = true;
    }
  }

  /**
   * Resume timing
   */
  resume(): void {
    if (this.isPaused) {
      const pauseDuration = Date.now() - this.pausedTime;
      this.startTime += pauseDuration;
      this.isPaused = false;
    }
  }

  /**
   * Get elapsed time
   */
  getElapsed(): number {
    if (this.isPaused) {
      return this.pausedTime - this.startTime;
    }
    return Date.now() - this.startTime;
  }

  /**
   * Reset timing
   */
  reset(): void {
    this.startTime = 0;
    this.pausedTime = 0;
    this.isPaused = false;
  }
}