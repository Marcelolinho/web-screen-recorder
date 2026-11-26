import { useEffect, useMemo, useRef, useState } from 'react';
import { sendToBackground } from '@/utils/messages';
import type { Recording } from '@/utils/protocol';
import { loadVideo } from '@/utils/video-store';
import { RequestList, type TimedEvent } from './RequestList';

type LoadState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; recording: Recording; videoUrl: string };

async function loadRecording() {
  const recording = await sendToBackground({ type: 'get-recording' });
  if (!recording) return undefined;
  const video = await loadVideo();
  return { recording, videoUrl: URL.createObjectURL(video) };
}

function useRecording() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    let videoUrl: string | undefined;

    loadRecording()
      .then(loaded => {
        videoUrl = loaded?.videoUrl;
        if (cancelled && videoUrl) URL.revokeObjectURL(videoUrl);
        if (cancelled) return;
        setState(loaded ? { status: 'ready', ...loaded } : { status: 'missing' });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'missing' });
      });

    return () => {
      cancelled = true;
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, []);

  return state;
}

export function Viewer() {
  const state = useRecording();
  const video = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const entries = useMemo<TimedEvent[]>(() => {
    if (state.status !== 'ready') return [];
    const { startedAt, events } = state.recording;
    return events.map(event => ({ event, second: Math.max(0, (event.startTime - startedAt) / 1000) }));
  }, [state]);

  const activeIndex = entries.findLastIndex(entry => entry.second <= currentTime);

  function seek(second: number) {
    if (!video.current) return;
    video.current.currentTime = second;
    setCurrentTime(second);
  }

  return (
    <main className="viewer">
      <section className="video-card" aria-label="Vídeo da gravação">
        {state.status === 'ready' && (
          <video
            ref={video}
            src={state.videoUrl}
            controls
            onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
          />
        )}
        {state.status === 'loading' && <p className="empty">Carregando gravação…</p>}
        {state.status === 'missing' && <p className="empty">Nenhuma gravação encontrada.</p>}
      </section>

      <aside className="requests">
        <header className="requests-header">
          <h1>Requisições</h1>
          <span className="count">{activeIndex + 1} / {entries.length}</span>
        </header>
        <div className="requests-card">
          <RequestList entries={entries} activeIndex={activeIndex} onSelect={seek} />
        </div>
      </aside>
    </main>
  );
}
