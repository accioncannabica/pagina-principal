import { useEffect, useRef } from "react";

/** Fondo animado: gradientes en deriva + partículas de polen sobre canvas. */
export default function Fondo() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; hue: number };
    let particulas: P[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cantidad = Math.round(Math.min(90, (w * h) / 16000));
      particulas = Array.from({ length: cantidad }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -0.12 - Math.random() * 0.35,
        r: 0.6 + Math.random() * 2.1,
        a: 0.12 + Math.random() * 0.5,
        hue: 70 + Math.random() * 60,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.004;
      ctx.clearRect(0, 0, w, h);

      // halos suaves
      const halos: [number, number, number, string][] = [
        [w * (0.2 + 0.06 * Math.sin(t)), h * (0.24 + 0.05 * Math.cos(t * 1.3)), 260, "rgba(52,211,153,0.16)"],
        [w * (0.82 + 0.05 * Math.cos(t * 0.8)), h * (0.3 + 0.06 * Math.sin(t)), 300, "rgba(163,230,53,0.12)"],
        [w * (0.55 + 0.07 * Math.sin(t * 1.1)), h * (0.85 + 0.04 * Math.cos(t * 0.7)), 340, "rgba(34,211,238,0.09)"],
      ];
      halos.forEach(([x, y, r, c]) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, c);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // partículas
      particulas.forEach((p) => {
        if (!reduce) {
          p.x += p.vx + 0.12 * Math.sin(t * 3 + p.y * 0.02);
          p.y += p.vy;
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
        }
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 75%, 68%, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // conexiones lejanas
      for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
          const dx = particulas[i].x - particulas[j].x;
          const dy = particulas[i].y - particulas[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            ctx.strokeStyle = `rgba(163,230,53,${0.09 * (1 - d2 / 12000)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particulas[i].x, particulas[i].y);
            ctx.lineTo(particulas[j].x, particulas[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#0d2a1f_0%,#050a09_45%,#03060a_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.16] anim-grid"
        style={{
          backgroundImage:
            "linear-gradient(rgba(163,230,53,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.14) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
      <div className="absolute -left-40 top-[-10%] h-[46rem] w-[46rem] rounded-full bg-verde-500/12 blur-[130px] anim-drift" />
      <div className="absolute -right-32 top-1/4 h-[38rem] w-[38rem] rounded-full bg-lima-500/10 blur-[140px] anim-drift" style={{ animationDelay: "-8s" }} />
      <div className="absolute bottom-[-20%] left-1/3 h-[34rem] w-[34rem] rounded-full bg-cian-400/8 blur-[150px] anim-drift" style={{ animationDelay: "-16s" }} />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(3,6,10,0.85))]" />
    </div>
  );
}
