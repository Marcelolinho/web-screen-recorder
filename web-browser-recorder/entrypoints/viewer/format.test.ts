import { describe, expect, it } from 'vitest';
import { formatSecond, splitUrl, statusTone } from './format';

describe('statusTone', () => {
  it('groups status codes by class', () => {
    const tone = (status?: number) => statusTone({ source: 'fetch', url: 'https://a.test', startTime: 0, status });
    expect([tone(200), tone(304), tone(404), tone(503), tone(0), tone()]).toEqual(
      ['success', 'redirect', 'client-error', 'server-error', 'failed', 'unknown'],
    );
  });

  it('marks websocket frames as socket', () => {
    expect(statusTone({ source: 'websocket', url: 'wss://a.test', startTime: 0 })).toBe('socket');
  });
});

describe('splitUrl', () => {
  it('separates path and host', () => {
    expect(splitUrl('https://api.a.test/users?id=7')).toEqual({ path: '/users?id=7', host: 'api.a.test' });
  });
});

describe('formatSecond', () => {
  it('pads seconds under a minute and rolls over minutes', () => {
    expect(formatSecond(4.25)).toBe('0:04.3');
    expect(formatSecond(72.4)).toBe('1:12.4');
  });
});
