// PDF.js worker fallback - minimal implementation
self.onmessage = function(e) {
  // Simple fallback for PDF processing
  self.postMessage({
    type: 'ready'
  });
};