import type { NetworkEvent } from './protocol';

const MAX_EVENTS = 8000;
const TTL_MS = 35 * 60 * 1000;
const buffers = new Map<number, NetworkEvent[]>();

export function addToBuffer(tabId: number, event: NetworkEvent) {
  const events = buffers.get(tabId) ?? [];
  events.push(event);
  const cutoff = Date.now() - TTL_MS;
  while (events.length > MAX_EVENTS || (events[0] && events[0].startTime < cutoff)) {
    events.shift();
  }
  buffers.set(tabId, events);
}

export function readBuffer(tabId: number) {
  return buffers.get(tabId) ?? [];
}

export function clearBuffer(tabId: number) {
  buffers.delete(tabId);
}
