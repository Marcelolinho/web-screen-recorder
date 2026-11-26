import { record } from './page-bridge';

export function installFetchHook() {
  const originalFetch = window.fetch;

  window.fetch = async (input, init) => {
    const request = new Request(input, init);
    const startTime = Date.now();
    const requestBody = await request.clone().text().catch(() => undefined);
    const response = await originalFetch(request);

    response.clone().text()
      .then(responseBody => record({
        source: 'fetch',
        url: request.url,
        method: request.method,
        status: response.status,
        startTime,
        endTime: Date.now(),
        requestBody,
        responseBody,
      }))
      .catch(() => {});

    return response;
  };
}
