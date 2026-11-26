import { useEffect, useState } from 'react';
import { sendToBackground } from '@/utils/messages';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

async function activeTabId() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

export function RecordingStation() {
  const [startedAt, setStartedAt] = useState<number>();
  const [now, setNow] = useState(Date.now());
  const [isBusy, setIsBusy] = useState(false);
  const isRecording = startedAt !== undefined;

  useEffect(() => {
    sendToBackground({ type: 'get-status' }).then(status => setStartedAt(status?.startedAt));
  }, []);

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  async function toggleRecording() {
    setIsBusy(true);
    try {
      const tabId = await activeTabId();
      if (isRecording) {
        await sendToBackground({ type: 'stop' });
        setStartedAt(undefined);
      } else if (tabId !== undefined) {
        const status = await sendToBackground({ type: 'start', tabId });
        setStartedAt(status?.startedAt);
        setNow(Date.now());
      }
    } finally {
      setIsBusy(false);
    }
  }

  const elapsedSeconds = isRecording ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0;

  return (
    <div style={styles.container}>
      <button
        style={isRecording ? styles.stopButton : styles.startButton}
        disabled={isBusy}
        onClick={toggleRecording}
      >
        {isRecording ? 'Parar e revisar' : 'Gravar'}
      </button>
      <span style={styles.time}>{formatTime(elapsedSeconds)}</span>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: '16px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#EBEBD8',
  },
  startButton: {
    backgroundColor: '#637545',
    color: '#EBEBD8',
  },
  stopButton: {
    backgroundColor: '#ce3a49',
    color: '#EBEBD8',
  },
  time: {
    fontSize: '14px',
    fontVariantNumeric: 'tabular-nums',
    color: '#213547',
  },
} satisfies Record<string, React.CSSProperties>;
