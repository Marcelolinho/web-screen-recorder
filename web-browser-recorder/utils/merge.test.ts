import { describe, expect, it } from 'vitest';
import { mergeEvents } from './merge';

describe('mergeEvents', () => {
  it('joins a fetch event with its webRequest twin and keeps unmatched ones', () => {
    const merged = mergeEvents([
      { source: 'fetch', url: 'https://a.test/api', method: 'GET', startTime: 1000, responseBody: '{}' },
      { source: 'webRequest', url: 'https://a.test/api', method: 'GET', startTime: 1030, responseHeaders: { 'content-type': 'application/json' } },
      { source: 'webRequest', url: 'https://a.test/logo.png', method: 'GET', startTime: 1050 },
    ]);

    expect(merged).toHaveLength(2);
    expect(merged[0]).toMatchObject({ source: 'fetch', responseBody: '{}', responseHeaders: { 'content-type': 'application/json' } });
    expect(merged[1]).toMatchObject({ source: 'webRequest', url: 'https://a.test/logo.png' });
  });

  it('does not let two identical calls claim the same webRequest event', () => {
    const merged = mergeEvents([
      { source: 'fetch', url: 'https://a.test/api', method: 'GET', startTime: 1000 },
      { source: 'fetch', url: 'https://a.test/api', method: 'GET', startTime: 1001 },
      { source: 'webRequest', url: 'https://a.test/api', method: 'GET', startTime: 1002, responseHeaders: { x: '1' } },
    ]);

    expect(merged.filter(event => event.responseHeaders)).toHaveLength(1);
  });
});
