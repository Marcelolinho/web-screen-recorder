import { addToBuffer } from '@/utils/buffer';
import { CHANNEL, type BackgroundMessage, type NetworkEvent } from '@/utils/protocol';
import { getRecording, getStatus, isRecording, startRecording, stopRecording } from '@/utils/recorder';
import { listenToWebRequest } from '@/utils/web-request';

async function handleMessage(message: BackgroundMessage) {
  switch (message.type) {
    case 'start':
      await startRecording(message.tabId);
      return getStatus();
    case 'stop':
      await stopRecording();
      return getStatus();
    case 'get-status':
      return getStatus();
    case 'get-recording':
      return getRecording();
  }
}

export default defineBackground(() => {
  listenToWebRequest();

  browser.runtime.onConnect.addListener(port => {
    if (port.name !== CHANNEL) return;
    const tabId = port.sender?.tab?.id;
    port.onMessage.addListener((event: NetworkEvent) => {
      if (tabId !== undefined && isRecording(tabId)) addToBuffer(tabId, event);
    });
  });

  browser.runtime.onMessage.addListener((message: BackgroundMessage, _sender, sendResponse) => {
    handleMessage(message).then(sendResponse, (error: unknown) => {
      console.error(error);
      sendResponse(undefined);
    });
    return true;
  });
});
