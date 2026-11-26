import type { BackgroundMessage, OffscreenMessage, Recording, RecordingStatus } from './protocol';

export function sendToBackground(message: Extract<BackgroundMessage, { type: 'start' | 'stop' | 'get-status' }>): Promise<RecordingStatus | undefined>;
export function sendToBackground(message: Extract<BackgroundMessage, { type: 'get-recording' }>): Promise<Recording | undefined>;
export function sendToBackground(message: BackgroundMessage) {
  return browser.runtime.sendMessage(message);
}

export function sendToOffscreen(message: Extract<OffscreenMessage, { type: 'offscreen-start' }>): Promise<number>;
export function sendToOffscreen(message: Extract<OffscreenMessage, { type: 'offscreen-stop' }>): Promise<void>;
export function sendToOffscreen(message: OffscreenMessage) {
  return browser.runtime.sendMessage(message);
}
