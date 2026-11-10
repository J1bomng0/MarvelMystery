import { useEffect, useRef } from 'react';
import Button from './Button.jsx';

function Silhouette() {
  return (
    <svg className="silhouette" viewBox="0 0 200 84" shapeRendering="crispEdges" aria-hidden="true">
      <defs>
        <pattern id="halftone" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill="#6f6859" />
        </pattern>
      </defs>
      <polygon points="0,84 8,66 48,56 76,50 124,50 152,56 192,66 200,84" fill="url(#halftone)" />
      <polygon points="74,30 82,8 118,8 126,30 122,52 78,52" fill="url(#halftone)" />
      <g fill="#e6dcc6">
        {[[88,16],[94,16],[100,16],[82,22],[106,22],[106,28],[100,34],[94,40]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" />
        ))}
      </g>
    </svg>
  );
}

/** Win / lose pop-up. Props: won, answer, onRetry, onMenu */
export default function ResultModal({ won, answer, onRetry, onMenu }) {
  const retryRef = useRef(null);

  useEffect(() => { retryRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onMenu();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onMenu]);

  return (
    <div className="overlay">
      <div className={`dialog${won ? '' : ' lost'}`} role="dialog" aria-modal="true" aria-label={won ? 'Victory' : 'Defeat'}>
        <div className="dialog-bar">
          <span>{won ? 'VICTORY.EXE' : 'GAME_OVER.EXE'}</span>
          <button className="close" onClick={onMenu} aria-label="Close">
            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
              <path d="M1 1L11 11M11 1L1 11" stroke="#16151a" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </div>
        <div className="dialog-body">
          <div className="kicker">{won ? 'CASE SOLVED' : 'CASE UNSOLVED'}</div>
          <p className="verdict">{won ? 'YOU WON!' : 'YOU LOST!'}</p>
          <p className="answer">{won ? `I am ${answer}` : `Shame, you could not recognize ${answer}`}</p>
          <div className="dialog-actions">
            <Button ref={retryRef} selected cursor={false} onClick={onRetry}>RETRY</Button>
            <Button variant="outline" onClick={onMenu}>MENU</Button>
          </div>
          {won ? <div style={{ height: 30 }} /> : <Silhouette />}
        </div>
      </div>
    </div>
  );
}