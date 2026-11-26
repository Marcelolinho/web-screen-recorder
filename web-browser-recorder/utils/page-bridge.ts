import { CHANNEL, type NetworkEvent } from './protocol';

export function record(event: NetworkEvent) {
  window.postMessage({ channel: CHANNEL, event }, location.origin);
}
