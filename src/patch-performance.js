// Patch performance.measure to prevent DataCloneError crashes in React 19 development mode
if (typeof window !== 'undefined' && window.performance && typeof window.performance.measure === 'function') {
  const originalMeasure = window.performance.measure;
  window.performance.measure = function (...args) {
    try {
      return originalMeasure.apply(this, args);
    } catch (error) {
      console.warn('performance.measure caught error:', error);
      return null;
    }
  };
}
