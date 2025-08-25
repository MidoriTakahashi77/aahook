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

export type AnimationType = 'frames' | 'typing' | 'fade' | 'slide' | 'composite';

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

export type Direction = 'left' | 'right' | 'up' | 'down';

export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';

export interface AnimateOptions {
  type?: AnimationType;
  speed?: number;
  loop?: number | 'infinite';
  direction?: Direction;
  save?: boolean;
  preview?: boolean;
  output?: string;
}

export interface AnimationState {
  currentFrame: number;
  elapsedTime: number;
  loopCount: number;
  isPlaying: boolean;
}