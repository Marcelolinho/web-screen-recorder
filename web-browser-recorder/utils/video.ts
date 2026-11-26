import { sendToOffscreen } from './messages';

export async function startVideo(tabId: number) {
  const streamId = await browser.tabCapture.getMediaStreamId({ targetTabId: tabId });
  if (!(await browser.offscreen.hasDocument())) {
    await browser.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['USER_MEDIA'],
      justification: 'Record the tab while network events are captured',
    });
  }
  return sendToOffscreen({ type: 'offscreen-start', streamId });
}

export async function stopVideo() {
  await sendToOffscreen({ type: 'offscreen-stop' });
  await browser.offscreen.closeDocument();
}
