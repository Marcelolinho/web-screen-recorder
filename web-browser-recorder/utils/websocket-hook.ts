import { record } from './page-bridge';
import type { NetworkEvent } from './protocol';

export function installWebSocketHook() {
  window.WebSocket = new Proxy(window.WebSocket, {
    construct(target, args, newTarget) {
      const socket: WebSocket = Reflect.construct(target, args, newTarget);
      const url = String(args[0]);
      const log = (action: NonNullable<NetworkEvent['action']>, data?: unknown) =>
        record({ source: 'websocket', url, action, data: typeof data === 'string' ? data : undefined, startTime: Date.now() });

      socket.addEventListener('open', () => log('connect'));
      socket.addEventListener('message', event => log('receive', event.data));
      socket.addEventListener('close', () => log('close'));
      socket.send = new Proxy(socket.send, {
        apply(send, _thisArg, sendArgs: [string | ArrayBufferLike | Blob | ArrayBufferView]) {
          Reflect.apply(send, socket, sendArgs);
          log('send', sendArgs[0]);
        },
      });
      return socket;
    },
  });
}
