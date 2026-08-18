const { useRef, useEffect } = React;
function Aurora({ colors = '#06B58D,#6EB9F2,#7374FB,#D34E5E,#F77533', intensity = 0.55, speed = 1, fadeEdges = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const cols = (Array.isArray(colors) ? colors : String(colors).split(',')).map(s => s.trim());
    let raf, t = Math.random() * 100, w = 0, h = 0;
    const resize = () => { w = canvas.width = Math.max(2, canvas.offsetWidth); h = canvas.height = Math.max(2, canvas.offsetHeight); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const blobs = cols.map((c, i) => ({ c, ph: i * 1.9, rx: 0.30 + (i % 3) * 0.13, sp: 0.7 + (i % 2) * 0.5 }));
    const draw = () => {
      t += 0.0028 * speed;
      ctx.clearRect(0, 0, w, h);
      blobs.forEach((b, i) => {
        const x = w * (0.5 + 0.44 * Math.sin(t * b.sp + b.ph));
        const y = h * (0.5 + 0.42 * Math.cos(t * 0.8 * b.sp + b.ph * 1.4));
        const r = Math.max(w, h) * b.rx;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, b.c + '5E');
        g.addColorStop(0.55, b.c + '3C');
        g.addColorStop(1, b.c + '00');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [String(colors), speed]);
  const fade = fadeEdges && fadeEdges !== 'false' ? 'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.6) 18%,#000 40%,#000 60%,rgba(0,0,0,.6) 82%,transparent 100%)' : undefined;
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'blur(30px) saturate(1.05)', opacity: Number(intensity), pointerEvents: 'none', WebkitMaskImage: fade, maskImage: fade }} />;
}
module.exports = { Aurora };
