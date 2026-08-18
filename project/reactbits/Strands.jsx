const { useRef, useEffect } = React;
function Strands({ colors = '#06B58D,#6EB9F2,#7374FB,#D34E5E,#F77533', count = 26, opacity = 0.65, speed = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const cols = (Array.isArray(colors) ? colors : String(colors).split(',')).map(s => s.trim());
    const n = Number(count);
    let raf, t = Math.random() * 50, w = 0, h = 0;
    const resize = () => { w = canvas.width = Math.max(2, canvas.offsetWidth); h = canvas.height = Math.max(2, canvas.offsetHeight); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const lerp = (a, b, f) => a + (b - a) * f;
    const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const pal = cols.map(hex);
    const colAt = (f) => {
      const x = Math.max(0, Math.min(0.999, f)) * (pal.length - 1);
      const i = Math.floor(x), fr = x - i;
      const a = pal[i], b = pal[Math.min(i + 1, pal.length - 1)];
      return 'rgb(' + Math.round(lerp(a[0], b[0], fr)) + ',' + Math.round(lerp(a[1], b[1], fr)) + ',' + Math.round(lerp(a[2], b[2], fr)) + ')';
    };
    const strands = Array.from({ length: n }, (_, i) => ({
      yf: (i + 0.5) / n,
      amp: 0.035 + (i % 5) * 0.012,
      freq: 0.0035 + (i % 4) * 0.0011,
      ph: i * 0.9,
      sp: 0.5 + (i % 3) * 0.35,
      cf: i / (n - 1),
    }));
    const draw = () => {
      t += 0.008 * Number(speed);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.3;
      ctx.globalAlpha = 1;
      strands.forEach((s) => {
        ctx.beginPath();
        const baseY = s.yf * h;
        for (let x = -20; x <= w + 20; x += 14) {
          const y = baseY
            + Math.sin(x * s.freq + t * s.sp + s.ph) * h * s.amp
            + Math.sin(x * s.freq * 2.3 - t * s.sp * 0.7 + s.ph * 1.7) * h * s.amp * 0.4;
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colAt(s.cf);
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [String(colors), count, speed]);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: Number(opacity), pointerEvents: 'none' }} />;
}
module.exports = { Strands };
