import type { NetworkEvent } from './protocol';

function isSameRequest(page: NetworkEvent, browserSide: NetworkEvent) {
  return page.url === browserSide.url
    && page.method === browserSide.method
    && Math.abs(page.startTime - browserSide.startTime) < 100;
}

export function mergeEvents(events: NetworkEvent[]) {
  const page = events.filter(event => event.source !== 'webRequest').map(event => ({ ...event }));
  const matched = new Set<NetworkEvent>();
  const merged = [...page];

  for (const browserSide of events.filter(event => event.source === 'webRequest')) {
    const match = page.find(event => !matched.has(event) && isSameRequest(event, browserSide));
    if (!match) {
      merged.push(browserSide);
      continue;
    }
    matched.add(match);
    match.requestHeaders = browserSide.requestHeaders;
    match.responseHeaders = browserSide.responseHeaders;
  }

  return merged.sort((a, b) => a.startTime - b.startTime);
}
