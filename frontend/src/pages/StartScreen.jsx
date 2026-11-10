import Header, { Skyline } from '../components/Header.jsx';
import Button from '../components/Button.jsx';

export default function StartScreen({ onPlay, onCredits }) {
  return (
    <section className="screen">
      <Header />
      <header className="title-block">
        <h1 className="title-main">MARVEL</h1>
        <p className="title-sub">MYSTERY</p>
        <p className="tagline">SOLVE THE CASE</p>
      </header>
      <nav aria-label="Main menu">
        <ul className="menu">
          <li><Button selected onClick={onPlay}>PLAY</Button></li>
        </ul>
      </nav>
      <p className="hint start"><span className="blink">PRESS ENTER TO START</span></p>
      <Skyline />
      <span className="version">v1.0 · ONLINE</span>
    </section>
  );
}