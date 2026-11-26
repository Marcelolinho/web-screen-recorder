import { useEffect, useRef } from 'react';
import type { NetworkEvent } from '@/utils/protocol';
import { formatSecond, splitUrl, statusLabel, statusTone } from './format';

export interface TimedEvent {
  event: NetworkEvent;
  second: number;
}

interface RequestListProps {
  entries: TimedEvent[];
  activeIndex: number;
  onSelect: (second: number) => void;
}

function rowClassName(index: number, activeIndex: number) {
  if (index === activeIndex) return 'request is-active';
  if (index > activeIndex) return 'request is-upcoming';
  return 'request';
}

export function RequestList({ entries, activeIndex, onSelect }: RequestListProps) {
  const activeRow = useRef<HTMLLIElement>(null);

  useEffect(() => {
    activeRow.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeIndex]);

  if (entries.length === 0) {
    return <p className="empty">Nenhuma requisição gravada.</p>;
  }

  return (
    <ol className="request-list">
      {entries.map(({ event, second }, index) => {
        const { path, host } = splitUrl(event.url);
        return (
          <li key={index} ref={index === activeIndex ? activeRow : undefined} className={rowClassName(index, activeIndex)}>
            <button type="button" onClick={() => onSelect(second)} title={event.url}>
              <span className={`status tone-${statusTone(event)}`}>{statusLabel(event)}</span>
              <span className="target">
                <span className="path">
                  <span className="method">{event.method ?? event.action}</span> {path}
                </span>
                <span className="host">{host}</span>
              </span>
              <span className="time">{formatSecond(second)}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
