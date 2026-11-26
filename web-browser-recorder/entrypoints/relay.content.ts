import { CHANNEL } from '@/utils/protocol';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  registration: 'runtime',
  main() {
    const isolated = window as typeof window & { __netRecorderRelay?: boolean };
    if (isolated.__netRecorderRelay) return;
    isolated.__netRecorderRelay = true;

    const port = browser.runtime.connect({ name: CHANNEL });
    window.addEventListener('message', ({ source, data }) => {
      if (source !== window || data?.channel !== CHANNEL) return;
      port.postMessage(data.event);
    });
  },
});
