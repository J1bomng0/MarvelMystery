import { useEffect, useRef, useState } from 'react';
import Header, { Pips } from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import { askQuestion } from '../services/gameApi.js';

export default function GameScreen({ difficulty, gameId, onEnd }) {
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Hello Guesser, do you know my name?' }]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const [questionsRemaining, setQuestionsRemaining] = useState(difficulty.maxQuestions);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  
const send = async (e) => {
  e.preventDefault();

  const text = draft.trim();
  if (!text || busy || questionsRemaining <= 0) return;

  setMessages((prev) => [...prev, { from: 'me', text }]);
  setDraft('');
  setBusy(true);

  try {
    const data = await askQuestion(gameId, text);

    if (data.status === "won") {
      onEnd({ won: true, answer: data.character });
      return;
    }

    setQuestionsRemaining(data.questionsRemaining);

    let reply = data.message || (
    data.answer === 'YES' ? 'Yes!' :
    data.answer === 'NO' ? 'No!' :
    "I couldn't understand that question."
    );

    setMessages((prev) => [...prev, { from: 'ai', text: reply }]);

  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { from: 'ai', text: `Error: ${error.message}` }
    ]);
  } finally {
    setBusy(false);
  }
};


  return (
    <section className="screen has-bar">
      <Header
        withBar
        rule
        right={<>LEVEL: {difficulty.label} <Pips count={difficulty.pips} /></>}
      />
      <ul className="chat" ref={listRef} aria-live="polite">
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            from={m.from}
            text={m.text}
            showCaret={!busy && i === messages.length - 1 && m.from === 'ai'}
          />
        ))}
      </ul>
      <form className="composer" onSubmit={send}>
        <label className="field">
          <span className="who">YOU&gt;</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Type your question"
            placeholder={questionsRemaining > 0 ? "Ask a question..." : "No questions remaining"}
            disabled={busy || questionsRemaining <= 0}
            autoFocus
          />
        </label>
        <Button selected cursor={false} disabled={busy || !draft.trim() || questionsRemaining <= 0}>SEND</Button>
      </form>
    </section>
  );
}