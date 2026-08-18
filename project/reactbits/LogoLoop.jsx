const { useEffect } = React;
function LogoLoop({ children, gap = 56, duration = 26, reverse = false, fade = true }) {
  useEffect(() => {
    if (!document.getElementById('rb-loop-style')) {
      const s = document.createElement('style');
      s.id = 'rb-loop-style';
      s.textContent = '@keyframes rbLoop { from { transform: translateX(0) } to { transform: translateX(-50%) } }';
      document.head.appendChild(s);
    }
  }, []);
  const g = Number(gap);
  const row = (key, hide) => (
    <div key={key} aria-hidden={hide ? 'true' : undefined} style={{ display: 'flex', alignItems: 'center', gap: g, paddingLeft: g, flex: '0 0 auto' }}>
      {children}
    </div>
  );
  const mask = fade ? 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' : undefined;
  return (
    <div style={{ overflow: 'hidden', width: '100%', direction: 'ltr', maskImage: mask, WebkitMaskImage: mask, padding: '48px 0', margin: '-48px 0' }}>
      <div style={{ display: 'flex', width: 'max-content', direction: 'ltr', animation: 'rbLoop ' + Number(duration) + 's linear infinite' + (reverse ? ' reverse' : '') }}>
        {row('a', false)}
        {row('b', true)}
      </div>
    </div>
  );
}
module.exports = { LogoLoop };
