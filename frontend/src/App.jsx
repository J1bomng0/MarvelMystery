import { useEffect, useState } from 'react';
import StartScreen from './pages/StartScreen.jsx';
import DifficultyScreen, { DIFFICULTIES } from './pages/DifficultyScreen.jsx';
import GameScreen from './pages/GameScreen.jsx';
import ResultModal from './components/ResultModal.jsx';
import { startGame } from './services/gameApi.js';

function useFitScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => setScale(
      Math.min(window.innerWidth / 960, window.innerHeight / 640, 1.5)
    );

    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return scale;
}

export default function App() {
  const [screen, setScreen] = useState('start');
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [gameId, setGameId] = useState(null);
  const [result, setResult] = useState(null);
  const [round, setRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scale = useFitScale();

  // Start a real game through the backend
  const handlePickDifficulty = async (selectedDifficulty) => {
    if (loading) return;

    try {
      setLoading(true);
      setError('');

      const data = await startGame(selectedDifficulty.id);

      setDifficulty(selectedDifficulty);
      setGameId(data.gameId);
      setResult(null);
      setRound((r) => r + 1);
      setScreen('game');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toMenu = () => {
    setResult(null);
    setGameId(null);
    setError('');
    setScreen('start');
  };

  const retry = () => {
    setResult(null);
    setScreen('difficulty');
  };

  return (
    <div
      className="stage-fit"
      style={{ width: 960 * scale, height: 640 * scale }}
    >
      <div className="stage" style={{ transform: `scale(${scale})` }}>

        {screen === 'start' && (
          <StartScreen
            onPlay={() => {
              setError('');
              setScreen('difficulty');
            }}
            onCredits={() => {}}
          />
        )}

        {screen === 'difficulty' && (
          <>
            <DifficultyScreen
              onBack={() => setScreen('start')}
              onPick={handlePickDifficulty}
            />

            {loading && <p>OPENING CASE...</p>}
            {error && <p role="alert">{error}</p>}
          </>
        )}

        {screen === 'game' && (
          <GameScreen
            key={round}
            difficulty={difficulty}
            gameId={gameId}
            onEnd={setResult}
          />
        )}

        {result && (
          <ResultModal
            {...result}
            onRetry={retry}
            onMenu={toMenu}
          />
        )}

      </div>
    </div>
  );
}
