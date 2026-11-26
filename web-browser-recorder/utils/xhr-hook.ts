import { record } from './page-bridge';

const requestInfo = new WeakMap<XMLHttpRequest, { method: string; url: string }>();

export function installXhrHook() {
  const { open, send } = XMLHttpRequest.prototype;

  XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, method: string, url: string | URL, ...rest: unknown[]) {
    requestInfo.set(this, { method, url: new URL(url, location.href).href });
    return (open as (...args: unknown[]) => void).call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    const info = requestInfo.get(this);
    const startTime = Date.now();
    this.addEventListener('loadend', () => {
      if (!info) return;
      const isText = this.responseType === '' || this.responseType === 'text';
      record({
        source: 'xhr',
        url: info.url,
        method: info.method,
        status: this.status,
        startTime,
        endTime: Date.now(),
        requestBody: typeof body === 'string' ? body : undefined,
        responseBody: isText ? this.responseText : undefined,
      });
    });
    return send.call(this, body);
  };
}
