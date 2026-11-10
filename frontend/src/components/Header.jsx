export function Frame() {
  return (
    <>
      <div className="frame" />
      <div className="frame-inner" />
    </>
  );
}

export function Pips({ count, total = 3 }) {
  return (
    <span className="pips" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`pip${i < count ? ' on' : ''}`} />
      ))}
    </span>
  );
}

const BUILDINGS = [[0,70,60,50],[60,40,40,80],[100,60,70,60],[170,25,50,95],[220,75,60,45],[280,50,45,70],[325,65,85,55],[410,20,40,100],[450,55,60,65],[510,35,50,85],[560,70,70,50],[630,45,45,75],[675,80,60,40],[735,30,50,90],[785,60,70,60],[855,40,45,80],[900,65,60,55]];
const LIT_RED = [[72,52],[184,40],[196,70],[422,34],[522,50],[746,44],[866,56]];
const LIT_CREAM = [[116,76],[292,66],[462,72],[642,62],[800,78]];
const BARS = [[0,6],[10,3],[17,8],[29,3],[36,5],[46,9],[59,3],[66,6],[76,3],[83,8],[95,5]];

export function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 960 120" shapeRendering="crispEdges" aria-hidden="true">
      <g fill="#24222b">{BUILDINGS.map(([x, y, w, h]) => <rect key={x} x={x} y={y} width={w} height={h} />)}</g>
      <g fill="#ff5d68">{LIT_RED.map(([x, y]) => <rect key={x} x={x} y={y} width="6" height="6" />)}</g>
      <g fill="#f4ead5">{LIT_CREAM.map(([x, y]) => <rect key={x} x={x} y={y} width="6" height="6" />)}</g>
    </svg>
  );
}

/**
 * Props:
 *  - right:   content for the right side of the case-file strip (default "1 PLAYER")
 *  - withBar: show the red "window" title bar (gameplay screen)
 *  - rule:    show the dashed divider under the strip (gameplay screen)
 */
export default function Header({ right = '1 PLAYER', withBar = false, rule = false }) {
  return (
    <>
      {withBar && (
        <div className="window-bar">
          <span>MARVEL MYSTERY.EXE</span>
          <span className="window-btns" aria-hidden="true"><span /><span /><span /></span>
        </div>
      )}
      <Frame />
      <div className="meta">
        <span>CASE FILE No. ----</span>
        <span className="meta-right">{right}</span>
      </div>
      {rule && <div className="rule-dashed" />}
    </>
  );
}