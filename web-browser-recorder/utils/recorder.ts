import { clearBuffer, readBuffer } from './buffer';
import { mergeEvents } from './merge';
import type { Recording, RecordingStatus } from './protocol';
import { startVideo, stopVideo } from './video';

const PAGE_SCRIPTS = [
  { id: 'relay', path: '/content-scripts/relay.js' as const, world: 'ISOLATED' as const },
  { id: 'network-hook', path: '/network-hook.js' as const, world: 'MAIN' as const },
];
const PAGE_SCRIPT_IDS = PAGE_SCRIPTS.map(script => script.id);

let session: { tabId: number; startedAt: number; endedAt?: number } | undefined;

export function isRecording(tabId: number) {
  return session?.tabId === tabId && session.endedAt === undefined;
}

export function getStatus(): RecordingStatus {
  return { startedAt: session?.endedAt === undefined ? session?.startedAt : undefined };
}

export async function startRecording(tabId: number) {
  const current = { tabId, startedAt: Date.now() };
  session = current;
  clearBuffer(tabId);

  try {
    await registerPageScripts();
    await injectPageScripts(tabId);
    current.startedAt = await startVideo(tabId);
  } catch (error) {
    session = undefined;
    await unregisterPageScripts();
    throw error;
  }
}

export async function stopRecording() {
  if (!session || session.endedAt !== undefined) return;
  session.endedAt = Date.now();
  await unregisterPageScripts();
  await stopVideo();
  await browser.tabs.create({ url: browser.runtime.getURL('/viewer.html') });
}

export function getRecording(): Recording | undefined {
  if (session?.endedAt === undefined) return undefined;
  const { tabId, startedAt, endedAt } = session;
  const inWindow = readBuffer(tabId).filter(event => event.startTime >= startedAt && event.startTime <= endedAt);
  return { startedAt, events: mergeEvents(inWindow) };
}

async function registerPageScripts() {
  const registered = await browser.scripting.getRegisteredContentScripts({ ids: PAGE_SCRIPT_IDS });
  if (registered.length > 0) return;
  await browser.scripting.registerContentScripts(PAGE_SCRIPTS.map(script => ({
    id: script.id,
    js: [script.path.slice(1)],
    world: script.world,
    matches: ['<all_urls>'],
    runAt: 'document_start' as const,
    persistAcrossSessions: false,
  })));
}

async function unregisterPageScripts() {
  const registered = await browser.scripting.getRegisteredContentScripts({ ids: PAGE_SCRIPT_IDS });
  if (registered.length === 0) return;
  await browser.scripting.unregisterContentScripts({ ids: registered.map(script => script.id) });
}

async function injectPageScripts(tabId: number) {
  for (const script of PAGE_SCRIPTS) {
    await browser.scripting.executeScript({
      target: { tabId },
      files: [script.path],
      world: script.world,
      injectImmediately: true,
    });
  }
}
