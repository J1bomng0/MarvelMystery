import { useEffect, useState } from 'react';
import Header, { Skyline, Pips } from '../components/Header.jsx';
import Button from '../components/Button.jsx';

export const DIFFICULTIES = [
  { id: 'easy', label: 'EASY', pips: 1, maxQuestions: 15 },
  { id: 'medium', label: 'MEDIUM', pips: 2, maxQuestions: 10 },
  { id: 'hard', label: 'HARD', pips: 3, maxQuestions: 5 },
];

export default function DifficultyScreen({ onPick, onBack }) {
  const [index, setIndex] = useState(1);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => (i + DIFFICULTIES.length - 1) % DIFFICULTIES.length); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => (i + 1) % DIFFICULTIES.length); }
      if (e.key === 'Enter') onPick(DIFFICULTIES[index]);
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, onPick, onBack]);

  return (
    <section className="screen">
      <Header />
      <header className="title-block">
        <h1 className="title-main title-medium">CHOOSE</h1>
        <p className="title-sub title-medium">DIFFICULTY</p>
        <p className="tagline">PICK YOUR CASE LEVEL</p>
      </header>
      <ul className="menu wide" aria-label="Difficulty">
        {DIFFICULTIES.map((d, i) => (
          <li key={d.id}>
            <Button
              selected={i === index}
              aria-pressed={i === index}
              onMouseEnter={() => setIndex(i)}
              onClick={() => onPick(d)}
            >
              {d.label}
              <span className="row-pips"><Pips count={d.pips} /></span>
            </Button>
          </li>
        ))}
      </ul>
      <p className="hint diff"><span className="blink">UP / DOWN TO CHOOSE · ENTER TO CONFIRM</span></p>
      <Skyline />
      <Button variant="back" onClick={onBack}>BACK</Button>
    </section>
  );
}