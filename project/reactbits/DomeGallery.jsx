const { useEffect, useMemo, useRef, useState, useCallback } = React;

const DG_CSS = `
.sphere-root{position:relative;width:100%;height:100%;--radius:520px;--circ:calc(var(--radius)*3.14);--rot-y:calc((360deg / var(--segments-x))/2);--rot-x:calc((360deg / var(--segments-y))/2);--item-width:calc(var(--circ)/var(--segments-x));--item-height:calc(var(--circ)/var(--segments-y));}
.sphere-root *{box-sizing:border-box;}
.sphere,.dg-item,.dg-item__image{transform-style:preserve-3d;}
.sphere-main{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;background:transparent;cursor:grab;}
.sphere-main:active{cursor:grabbing;}
.dg-stage{width:100%;height:100%;display:grid;place-items:center;perspective:calc(var(--radius)*2);perspective-origin:50% 50%;contain:layout paint size;}
.sphere{transform:translateZ(calc(var(--radius)*-1));will-change:transform;}
.dg-overlay{position:absolute;inset:0;margin:auto;z-index:3;pointer-events:none;background-image:radial-gradient(rgba(235,235,235,0) 65%,var(--overlay-blur-color,#F6F5F2) 100%);}
.dg-item{width:calc(var(--item-width)*var(--item-size-x));height:calc(var(--item-height)*var(--item-size-y));position:absolute;top:-999px;bottom:-999px;left:-999px;right:-999px;margin:auto;transform-origin:50% 50%;backface-visibility:hidden;transition:transform 300ms;transform:rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1)/2)))) rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1)/2)))) translateZ(var(--radius));}
.dg-item__image{position:absolute;display:block;inset:10px;border-radius:var(--tile-radius,24px);background:transparent;overflow:hidden;backface-visibility:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;pointer-events:auto;transform:translateZ(0);}
.dg-item__image img{width:100%;height:100%;object-fit:cover;pointer-events:none;backface-visibility:hidden;filter:var(--image-filter,none);}
.dg-edge{position:absolute;left:0;right:0;height:120px;z-index:5;pointer-events:none;background:linear-gradient(to bottom,transparent,var(--overlay-blur-color,#F6F5F2));}
.dg-edge--top{top:0;transform:rotate(180deg);}
.dg-edge--bottom{bottom:0;}
.dg-lightbox{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:rgba(20,19,24,.45);backdrop-filter:blur(3px);cursor:pointer;}
.dg-lightbox img{max-width:min(720px,86%);max-height:82%;border-radius:var(--tile-radius,24px);box-shadow:0 24px 70px rgba(10,10,14,.4);}
`;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = (deg) => { const a = (((deg + 180) % 360) + 360) % 360; return a - 180; };

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];
  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });
  if (!pool.length) return coords.map((c) => ({ ...c, src: '', alt: '' }));
  const norm = pool.map((im) => (typeof im === 'string' ? { src: im, alt: '' } : { src: im.src || '', alt: im.alt || '' }));
  const used = Array.from({ length: coords.length }, (_, i) => norm[i % norm.length]);
  for (let i = 1; i < used.length; i++) {
    if (used[i].src === used[i - 1].src) {
      for (let j = i + 1; j < used.length; j++) {
        if (used[j].src !== used[i].src) { const t = used[i]; used[i] = used[j]; used[j] = t; break; }
      }
    }
  }
  return coords.map((c, i) => ({ ...c, src: used[i].src, alt: used[i].alt }));
}

function DomeGallery({
  images = [], fit = 0.65, fitBasis = 'auto', minRadius = 400, maxRadius = Infinity,
  padFactor = 0.25, overlayBlurColor = '#F6F5F2', maxVerticalRotationDeg = 5,
  dragSensitivity = 20, segments = 20, dragDampening = 1.8, autoRotate = 0,
  imageBorderRadius = '24px', grayscale = false
}) {
  const seg = Number(segments) || 20;
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ dragging: false, moved: false, startRot: null, startPos: null, samples: [], lastEnd: 0 });
  const inertiaRAF = useRef(null);
  const [enlarged, setEnlarged] = useState(null);

  useEffect(() => {
    if (!document.getElementById('dg-style')) {
      const s = document.createElement('style');
      s.id = 'dg-style';
      s.textContent = DG_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const items = useMemo(() => buildItems(images, seg), [images, seg]);

  const applyTransform = (x, y) => {
    const el = sphereRef.current;
    if (el) el.style.transform = 'translateZ(calc(var(--radius) * -1)) rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
      const minDim = Math.min(w, h), aspect = w / h;
      let basis;
      switch (fitBasis) {
        case 'min': basis = minDim; break;
        case 'max': basis = Math.max(w, h); break;
        case 'width': basis = w; break;
        case 'height': basis = h; break;
        default: basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = clamp(Math.min(basis * Number(fit), h * 1.35), Number(minRadius), Number(maxRadius) || Infinity);
      root.style.setProperty('--radius', Math.round(radius) + 'px');
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, fitBasis, minRadius, maxRadius]);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) { cancelAnimationFrame(inertiaRAF.current); inertiaRAF.current = null; }
  }, []);

  const startInertia = useCallback((vx, vy) => {
    const MAX_V = 1.4;
    let vX = clamp(vx, -MAX_V, MAX_V) * 80;
    let vY = clamp(vy, -MAX_V, MAX_V) * 80;
    let frames = 0;
    const d = clamp(Number(dragDampening) ?? 0.6, 0, 1);
    const frictionMul = 0.94 + 0.055 * d;
    const stopThreshold = 0.015 - 0.01 * d;
    const maxFrames = Math.round(90 + 270 * d);
    const step = () => {
      vX *= frictionMul; vY *= frictionMul;
      if ((Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) || ++frames > maxFrames) { inertiaRAF.current = null; return; }
      const nextX = clamp(rotationRef.current.x - vY / 200, -Number(maxVerticalRotationDeg), Number(maxVerticalRotationDeg));
      const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
      rotationRef.current = { x: nextX, y: nextY };
      applyTransform(nextX, nextY);
      inertiaRAF.current = requestAnimationFrame(step);
    };
    stopInertia();
    inertiaRAF.current = requestAnimationFrame(step);
  }, [dragDampening, maxVerticalRotationDeg, stopInertia]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const d = dragRef.current;
    const down = (e) => {
      if (enlarged) return;
      stopInertia();
      d.dragging = true; d.moved = false;
      d.startRot = { ...rotationRef.current };
      d.startPos = { x: e.clientX, y: e.clientY };
      d.samples = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
    };
    const move = (e) => {
      if (!d.dragging || !d.startPos) return;
      const dx = e.clientX - d.startPos.x, dy = e.clientY - d.startPos.y;
      if (!d.moved && dx * dx + dy * dy > 16) d.moved = true;
      const nx = clamp(d.startRot.x - dy / Number(dragSensitivity), -Number(maxVerticalRotationDeg), Number(maxVerticalRotationDeg));
      const ny = wrapAngleSigned(d.startRot.y + dx / Number(dragSensitivity));
      rotationRef.current = { x: nx, y: ny };
      applyTransform(nx, ny);
      d.samples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (d.samples.length > 6) d.samples.shift();
    };
    const up = () => {
      if (!d.dragging) return;
      d.dragging = false;
      const s = d.samples;
      if (s.length >= 2) {
        const a = s[0], b = s[s.length - 1];
        const dt = Math.max(1, b.t - a.t);
        const vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt;
        if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
      }
      if (d.moved) d.lastEnd = performance.now();
      d.moved = false;
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [enlarged, dragSensitivity, maxVerticalRotationDeg, startInertia, stopInertia]);

  useEffect(() => {
    const speed = Number(autoRotate) || 0;
    if (!speed) return;
    let raf, last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000; last = now;
      const d = dragRef.current;
      if (!d.dragging && !inertiaRAF.current && !enlarged) {
        const ny = wrapAngleSigned(rotationRef.current.y + speed * dt);
        rotationRef.current = { x: rotationRef.current.x, y: ny };
        applyTransform(rotationRef.current.x, ny);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate, enlarged]);

  const onTileClick = (src) => {
    const d = dragRef.current;
    if (d.dragging || d.moved || performance.now() - d.lastEnd < 120) return;
    if (src) setEnlarged(src);
  };

  const gs = grayscale === true || grayscale === 'true';
  return (
    <div ref={rootRef} className="sphere-root" style={{ '--segments-x': seg, '--segments-y': seg, '--overlay-blur-color': overlayBlurColor, '--tile-radius': imageBorderRadius, '--image-filter': gs ? 'grayscale(1)' : 'none' }}>
      <div ref={mainRef} className="sphere-main">
        <div className="dg-stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div key={it.x + ',' + it.y + ',' + i} className="dg-item" style={{ '--offset-x': it.x, '--offset-y': it.y, '--item-size-x': it.sizeX, '--item-size-y': it.sizeY }}>
                <div className="dg-item__image" role="button" tabIndex={0} aria-label={it.alt || 'Open image'} onClick={() => onTileClick(it.src)}>
                  {it.src ? <img src={it.src} draggable={false} alt={it.alt} /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dg-overlay"></div>
        <div className="dg-edge dg-edge--top"></div>
        <div className="dg-edge dg-edge--bottom"></div>
        {enlarged ? (
          <div className="dg-lightbox" onClick={() => setEnlarged(null)}>
            <img src={enlarged} alt="" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
module.exports = { DomeGallery };
