import { addToBuffer } from './buffer';
import type { NetworkEvent } from './protocol';
import { isRecording } from './recorder';

const SECRET_HEADERS = new Set(['cookie', 'set-cookie', 'authorization', 'proxy-authorization']);

function toHeaders(list?: { name: string; value?: string }[]) {
  return Object.fromEntries(
    (list ?? [])
      .filter(header => !SECRET_HEADERS.has(header.name.toLowerCase()))
      .map(header => [header.name.toLowerCase(), header.value ?? '']),
  );
}

export function listenToWebRequest() {
  const inFlight = new Map<string, NetworkEvent>();
  const filter = { urls: ['<all_urls>'] };

  browser.webRequest.onBeforeSendHeaders.addListener(details => {
    if (!isRecording(details.tabId)) return undefined;
    inFlight.set(details.requestId, {
      source: 'webRequest',
      url: details.url,
      method: details.method,
      startTime: details.timeStamp,
      requestHeaders: toHeaders(details.requestHeaders),
    });
    return undefined;
  }, filter, ['requestHeaders']);

  browser.webRequest.onCompleted.addListener(details => {
    const started = inFlight.get(details.requestId);
    if (!started) return;
    inFlight.delete(details.requestId);
    addToBuffer(details.tabId, {
      ...started,
      status: details.statusCode,
      endTime: details.timeStamp,
      responseHeaders: toHeaders(details.responseHeaders),
    });
  }, filter, ['responseHeaders']);

  browser.webRequest.onErrorOccurred.addListener(details => {
    inFlight.delete(details.requestId);
  }, filter);
}
