import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error overlay for visual debugging in the preview frame
if (typeof window !== 'undefined') {
  const showErrorOverlay = (title: string, message: string, stack?: string) => {
    // Avoid double overlays
    if (document.getElementById('debug-error-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'debug-error-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = '#1a0505';
    overlay.style.color = '#ff6b6b';
    overlay.style.padding = '24px';
    overlay.style.fontFamily = 'monospace';
    overlay.style.fontSize = '14px';
    overlay.style.zIndex = '999999';
    overlay.style.overflow = 'auto';
    overlay.style.whiteSpace = 'pre-wrap';
    
    overlay.innerHTML = `
      <h1 style="font-size: 20px; color: #ff4747; margin-bottom: 16px; font-weight: bold; font-family: monospace;">🚨 Runtime Error Detected</h1>
      <div style="font-weight: bold; margin-bottom: 8px; font-family: monospace;">${title}: ${message}</div>
      ${stack ? `<pre style="background-color: #2a0a0a; padding: 16px; border-radius: 4px; border: 1px solid #4a1515; overflow-x: auto; font-family: monospace; font-size: 12px; color: #fca5a5;">${stack}</pre>` : ''}
    `;
    document.body.appendChild(overlay);
  };

  const isBenignError = (message?: string, stack?: string) => {
    const msg = String(message || '').toLowerCase();
    const stk = String(stack || '').toLowerCase();
    return msg.includes('websocket') || 
           msg.includes('closed without opened') || 
           msg.includes('failed to connect') ||
           stk.includes('websocket') ||
           stk.includes('closed without opened') ||
           stk.includes('hmr') ||
           stk.includes('vite/dist/client');
  };

  window.addEventListener('error', (event) => {
    if (isBenignError(event.message, event.error?.stack)) {
      return;
    }
    showErrorOverlay('Unhandled Error', event.message, event.error?.stack);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    if (isBenignError(message, stack)) {
      return;
    }
    showErrorOverlay('Unhandled Rejection', message, stack);
  });
}

try {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container element #root not found in the DOM.');
  }
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (err: any) {
  console.error('Mounting failed:', err);
  if (typeof window !== 'undefined') {
    const errorOverlay = document.createElement('div');
    errorOverlay.style.color = '#ef4444';
    errorOverlay.style.padding = '24px';
    errorOverlay.style.backgroundColor = '#111827';
    errorOverlay.style.minHeight = '100vh';
    errorOverlay.innerHTML = `
      <h2 style="font-size: 18px; font-weight: bold;">Mounting Failed</h2>
      <p>${err.message || err}</p>
      <pre style="background-color: #1f2937; padding: 16px; border-radius: 4px; overflow-x: auto;">${err.stack || ''}</pre>
    `;
    document.body.appendChild(errorOverlay);
  }
}
