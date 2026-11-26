import type { NetworkEvent } from '@/utils/protocol';

export type StatusTone = 'success' | 'redirect' | 'client-error' | 'server-error' | 'failed' | 'socket' | 'unknown';

export function statusTone(event: NetworkEvent): StatusTone {
  if (event.source === 'websocket') return 'socket';
  if (event.status === undefined) return 'unknown';
  if (event.status === 0) return 'failed';
  if (event.status < 300) return 'success';
  if (event.status < 400) return 'redirect';
  if (event.status < 500) return 'client-error';
  return 'server-error';
}

export function statusLabel(event: NetworkEvent) {
  if (event.source === 'websocket') return 'WS';
  return event.status === undefined ? '—' : String(event.status);
}

export function splitUrl(url: string) {
  try {
    const parsed = new URL(url);
    return { path: parsed.pathname + parsed.search, host: parsed.host };
  } catch {
    return { path: url, host: '' };
  }
}

export function formatSecond(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(1).padStart(4, '0');
  return `${minutes}:${seconds}`;
}
