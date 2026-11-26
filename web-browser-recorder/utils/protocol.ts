export const CHANNEL = 'net-recorder';

export type EventSource = 'fetch' | 'xhr' | 'websocket' | 'webRequest';

export interface NetworkEvent {
  source: EventSource;
  url: string;
  startTime: number;
  method?: string;
  status?: number;
  endTime?: number;
  requestBody?: string;
  responseBody?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  action?: 'connect' | 'send' | 'receive' | 'close';
  data?: string;
}

export interface Recording {
  startedAt: number;
  events: NetworkEvent[];
}

export interface RecordingStatus {
  startedAt?: number;
}

export type BackgroundMessage =
  | { type: 'start'; tabId: number }
  | { type: 'stop' }
  | { type: 'get-status' }
  | { type: 'get-recording' };

export type OffscreenMessage =
  | { type: 'offscreen-start'; streamId: string }
  | { type: 'offscreen-stop' };
