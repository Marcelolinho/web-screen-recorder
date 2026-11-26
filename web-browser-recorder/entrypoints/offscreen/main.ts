import type { OffscreenMessage } from '@/utils/protocol';
import { saveVideo } from '@/utils/video-store';

let recorder: MediaRecorder | undefined;
let chunks: Blob[] = [];

async function startRecorder(streamId: string) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: streamId } },
  } as MediaStreamConstraints);

  chunks = [];
  recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  recorder.ondataavailable = event => chunks.push(event.data);
  recorder.start(1000);
  return Date.now();
}

function stopRecorder() {
  return new Promise<void>((resolve, reject) => {
    const active = recorder;
    if (!active) return resolve();

    active.onstop = () => {
      active.stream.getTracks().forEach(track => track.stop());
      recorder = undefined;
      saveVideo(new Blob(chunks, { type: 'video/webm' })).then(resolve, reject);
    };
    active.stop();
  });
}

function handleMessage(message: OffscreenMessage) {
  switch (message.type) {
    case 'offscreen-start':
      return startRecorder(message.streamId);
    case 'offscreen-stop':
      return stopRecorder();
    default:
      return undefined;
  }
}

browser.runtime.onMessage.addListener((message: OffscreenMessage, _sender, sendResponse) => {
  const task = handleMessage(message);
  if (!task) return false;
  task.then(sendResponse, (error: unknown) => {
    console.error(error);
    sendResponse(undefined);
  });
  return true;
});
