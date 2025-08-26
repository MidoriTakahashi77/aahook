const test = require('node:test');
const assert = require('node:assert');
const { Renderer } = require('../dist/lib/animation/renderer');
const { TimingController } = require('../dist/lib/animation/timing-controller');

test('Renderer', async (t) => {
  await t.test('should create renderer instance', () => {
    const renderer = new Renderer();
    assert.ok(renderer);
  });

  await t.test('should detect terminal support', () => {
    const renderer = new Renderer();
    // In test environment, should detect as non-interactive
    assert.strictEqual(renderer.supportsAnimation(), false);
  });

  await t.test('should get terminal size', () => {
    const renderer = new Renderer();
    const size = renderer.getTerminalSize();
    assert.ok(size.columns > 0);
    assert.ok(size.rows > 0);
  });

  await t.test('should write content', () => {
    const renderer = new Renderer();
    // Should not throw
    renderer.write('test');
    renderer.writeLine('test line');
  });

  await t.test('should handle cleanup', () => {
    const renderer = new Renderer();
    // Should not throw
    renderer.cleanup();
  });
});

test('TimingController', async (t) => {
  await t.test('should create timing controller', () => {
    const controller = new TimingController();
    assert.ok(controller);
  });

  await t.test('should calculate frame delay', () => {
    const controller = new TimingController({ fps: 30 });
    assert.strictEqual(controller.getFrameDelay(), 1000 / 30);
  });

  await t.test('should calculate character delay', () => {
    const controller = new TimingController({ charDelay: 100 });
    assert.strictEqual(controller.getCharDelay(), 100);
    
    // Default delay
    const defaultController = new TimingController();
    assert.strictEqual(defaultController.getCharDelay(), 50);
  });

  await t.test('should apply linear easing', () => {
    const controller = new TimingController({ 
      duration: 1000,
      easing: 'linear'
    });
    assert.strictEqual(controller.calculateDelay(0, 10), 0);
    assert.strictEqual(controller.calculateDelay(5, 10), 5000 / 9);
    assert.strictEqual(controller.calculateDelay(9, 10), 1000);
  });

  await t.test('should apply ease-in easing', () => {
    const controller = new TimingController({ 
      duration: 1000,
      easing: 'ease-in'
    });
    const delay = controller.calculateDelay(5, 10);
    assert.ok(delay > 0 && delay < 1000);
  });

  await t.test('should handle loop control', () => {
    const controller = new TimingController({ loop: 3 });
    assert.strictEqual(controller.shouldContinueLoop(0), true);
    assert.strictEqual(controller.shouldContinueLoop(2), true);
    assert.strictEqual(controller.shouldContinueLoop(3), false);
  });

  await t.test('should handle infinite loop', () => {
    const controller = new TimingController({ loop: -1 });
    assert.strictEqual(controller.shouldContinueLoop(100), true);
  });

  await t.test('should wait for specified time', async () => {
    const controller = new TimingController();
    const start = Date.now();
    await controller.wait(50);
    const elapsed = Date.now() - start;
    assert.ok(elapsed >= 45); // Allow some tolerance
  });

  await t.test('should track elapsed time', () => {
    const controller = new TimingController();
    controller.start();
    const elapsed = controller.getElapsed();
    assert.ok(elapsed >= 0);
  });

  await t.test('should handle pause and resume', () => {
    const controller = new TimingController();
    controller.start();
    controller.pause();
    const pausedElapsed = controller.getElapsed();
    controller.resume();
    assert.ok(controller.getElapsed() >= pausedElapsed);
  });
});