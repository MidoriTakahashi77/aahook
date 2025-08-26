/**
 * Animation-related type definitions
 */

export interface AnimationDefinition {
  name: string;
  version: string;
  type: AnimationType;
  fps: number;
  loop: number | 'infinite';
  frames?: Frame[];
  effects?: Effect[];
}

export type AnimationType = 'frames' | 'typing' | 'fade' | 'slide' | 'blink' | 'composite';

export interface Frame {
  content: string;
  duration?: number; // Override fps for this frame (in ms)
  transition?: TransitionType;
}

export type TransitionType = 'none' | 'fade' | 'slide' | 'dissolve';

export interface Effect {
  type: EffectType;
  duration: number;
  direction?: Direction;
  easing?: EasingFunction;
  delay?: number;
}

export type EffectType = 'typing' | 'fade-in' | 'fade-out' | 'slide-in' | 'slide-out' | 'blink' | 'shake';

export type Direction = 'left' | 'right' | 'up' | 'down' | 'top' | 'bottom';

export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier' | 'bounce' | 'elastic';

export interface AnimateOptions {
  type?: AnimationType;
  speed?: number;
  fps?: number;
  loop?: number | 'infinite';
  direction?: Direction;
  save?: boolean;
  preview?: boolean;
  output?: string;
  theme?: string;
  list?: boolean;
}

export interface AnimationState {
  currentFrame: number;
  elapsedTime: number;
  loopCount: number;
  isPlaying: boolean;
}

// Additional types for internal use
export interface TimingOptions {
  duration?: number;      // Total animation duration in milliseconds
  delay?: number;         // Delay before animation starts
  fps?: number;          // Frames per second for frame animations
  loop?: number;         // Number of loops (-1 for infinite)
  charDelay?: number;    // Delay between characters for typing animation
  lineDelay?: number;    // Delay between lines for fade animation
  easing?: EasingFunction;
}

export interface AnimationOptions {
  type?: AnimationType;
  timing?: TimingOptions;
  effects?: AnimationEffects;
  theme?: string;        // Apply color theme with animation
  save?: boolean;        // Save animation definition
  preview?: boolean;     // Preview mode
}

export interface AnimationEffects {
  direction?: Direction;
  reverse?: boolean;
  pattern?: string;      // For blink animations - regex pattern
}