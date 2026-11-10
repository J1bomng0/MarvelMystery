/** One chat line. from: "ai" (red, ">") or "me" (cream, "YOU>"). */
export default function ChatMessage({ from, text, showCaret = false }) {
  return (
    <li className={`msg ${from}`}>
      <span className="who">{from === 'ai' ? '>' : 'YOU>'}</span>
      <span>
        {text}
        {showCaret && <span className="caret" />}
      </span>
    </li>
  );
}