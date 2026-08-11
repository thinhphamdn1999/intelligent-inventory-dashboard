// jest.setup.cjs
require('@testing-library/jest-dom');

globalThis.HTMLElement.prototype.scrollIntoView = jest.fn();
globalThis.HTMLElement.prototype.hasPointerCapture = jest.fn();
globalThis.HTMLElement.prototype.releasePointerCapture = jest.fn();

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock;

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
