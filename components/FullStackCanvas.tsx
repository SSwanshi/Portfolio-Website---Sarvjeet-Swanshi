'use client';

import { useEffect, useRef, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  color: string;
  pulsePhase: number;
  category: 'frontend' | 'backend' | 'database' | 'devops';
}

interface CodeDrop {
  x: number;
  y: number;
  speed: number;
  text: string;
  opacity: number;
  fontSize: number;
  col: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  progress: number;
  color: string;
  size: number;
}

interface CircuitTrace {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
  color: string;
  width: number;
}

// ─── Constants ───────────────────────────────────────────────────

const CODE_KEYWORDS = [
  'const', 'let', 'async', 'await', 'import', 'export', 'return',
  'function', 'class', 'interface', 'type', 'enum', '() =>', 'try',
  'catch', 'Promise', 'fetch', 'useState', 'useEffect', 'SELECT',
  'INSERT', 'FROM', 'WHERE', 'JOIN', 'CREATE', 'npm run', 'git push',
  'docker', 'deploy', 'build', 'test', 'render', 'mount', 'query',
  'mutation', 'schema', 'model', 'route', 'middleware', 'socket',
  'REST', 'GraphQL', 'API', 'JWT', 'OAuth', 'CRUD', 'MVC',
  '<div>', '</>', '{}', '[]', '=>', '===', '!==', '&&', '||',
  'req, res', 'next()', '.env', 'prisma', 'mongoose', 'express',
  'React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL',
];

const TECH_LABELS = [
  { label: 'React', color: '#61DAFB', category: 'frontend' as const },
  { label: 'Next.js', color: '#ffffff', category: 'frontend' as const },
  { label: 'TypeScript', color: '#3178C6', category: 'frontend' as const },
  { label: 'Tailwind', color: '#06B6D4', category: 'frontend' as const },
  { label: 'Node.js', color: '#68A063', category: 'backend' as const },
  { label: 'Express', color: '#ffffff', category: 'backend' as const },
  { label: 'REST API', color: '#FF6C37', category: 'backend' as const },
  { label: 'GraphQL', color: '#E535AB', category: 'backend' as const },
  { label: 'MongoDB', color: '#47A248', category: 'database' as const },
  { label: 'PostgreSQL', color: '#336791', category: 'database' as const },
  { label: 'Prisma', color: '#2D3748', category: 'database' as const },
  { label: 'Redis', color: '#DC382D', category: 'database' as const },
  { label: 'Docker', color: '#2496ED', category: 'devops' as const },
  { label: 'Git', color: '#F05032', category: 'devops' as const },
  { label: 'CI/CD', color: '#40BE46', category: 'devops' as const },
  { label: 'AWS', color: '#FF9900', category: 'devops' as const },
];

// ─── Helpers ─────────────────────────────────────────────────────

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// ─── Component ───────────────────────────────────────────────────

export function FullStackCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const stateRef = useRef<{
    nodes: Node[];
    codeDrops: CodeDrop[];
    particles: Particle[];
    traces: CircuitTrace[];
    time: number;
    w: number;
    h: number;
  } | null>(null);

  // Initialize all entities
  const initState = useCallback((w: number, h: number) => {
    // ── Nodes (tech stack) ──
    const nodes: Node[] = TECH_LABELS.map((tech, i) => {
      const angle = (i / TECH_LABELS.length) * Math.PI * 2;
      const rx = w * 0.3 + seededRandom(i * 7) * w * 0.15;
      const ry = h * 0.3 + seededRandom(i * 13) * h * 0.15;
      return {
        x: w / 2 + Math.cos(angle) * rx,
        y: h / 2 + Math.sin(angle) * ry,
        vx: (seededRandom(i * 3) - 0.5) * 0.3,
        vy: (seededRandom(i * 5) - 0.5) * 0.3,
        radius: 3 + seededRandom(i * 9) * 2,
        label: tech.label,
        color: tech.color,
        pulsePhase: seededRandom(i * 11) * Math.PI * 2,
        category: tech.category,
      };
    });

    // ── Code drops (code rain) ──
    const colWidth = 28;
    const cols = Math.floor(w / colWidth);
    const codeDrops: CodeDrop[] = [];
    for (let c = 0; c < cols; c++) {
      if (seededRandom(c * 17) > 0.6) continue; // sparse columns
      const numDrops = 1 + Math.floor(seededRandom(c * 23) * 2);
      for (let d = 0; d < numDrops; d++) {
        codeDrops.push({
          x: c * colWidth + colWidth / 2,
          y: seededRandom(c * 31 + d * 7) * h * 2 - h,
          speed: 0.3 + seededRandom(c * 41 + d * 13) * 0.7,
          text: CODE_KEYWORDS[Math.floor(seededRandom(c * 53 + d * 19) * CODE_KEYWORDS.length)],
          opacity: 0.04 + seededRandom(c * 61 + d * 29) * 0.08,
          fontSize: 10 + Math.floor(seededRandom(c * 67 + d * 37) * 4),
          col: c,
        });
      }
    }

    // ── Data-flow particles ──
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      const fromIdx = Math.floor(seededRandom(i * 71) * nodes.length);
      let toIdx = Math.floor(seededRandom(i * 79) * nodes.length);
      if (toIdx === fromIdx) toIdx = (toIdx + 1) % nodes.length;
      particles.push({
        x: nodes[fromIdx].x,
        y: nodes[fromIdx].y,
        targetX: nodes[toIdx].x,
        targetY: nodes[toIdx].y,
        speed: 0.002 + seededRandom(i * 83) * 0.004,
        progress: seededRandom(i * 89),
        color: nodes[fromIdx].color,
        size: 1.5 + seededRandom(i * 97) * 1.5,
      });
    }

    // ── Circuit traces ──
    const traces: CircuitTrace[] = [];
    for (let i = 0; i < 12; i++) {
      const segCount = 3 + Math.floor(seededRandom(i * 101) * 4);
      const points: { x: number; y: number }[] = [];
      let px = seededRandom(i * 107) * w;
      let py = seededRandom(i * 109) * h;
      points.push({ x: px, y: py });
      for (let s = 0; s < segCount; s++) {
        // Circuit traces go in orthogonal directions
        if (s % 2 === 0) {
          px += (seededRandom(i * 113 + s * 7) - 0.5) * w * 0.25;
        } else {
          py += (seededRandom(i * 127 + s * 11) - 0.5) * h * 0.25;
        }
        px = Math.max(0, Math.min(w, px));
        py = Math.max(0, Math.min(h, py));
        points.push({ x: px, y: py });
      }
      traces.push({
        points,
        progress: seededRandom(i * 131),
        speed: 0.001 + seededRandom(i * 137) * 0.003,
        color: ['#00ffff', '#00ff88', '#ff6600', '#8b5cf6', '#3b82f6', '#ef4444'][i % 6],
        width: 0.5 + seededRandom(i * 139) * 0.5,
      });
    }

    return { nodes, codeDrops, particles, traces, time: 0, w, h };
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    stateRef.current = initState(rect.width, rect.height);
  }, [initState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', handleResize);

    // ── Animation loop ──
    const animate = () => {
      const state = stateRef.current;
      if (!state) { animRef.current = requestAnimationFrame(animate); return; }
      const ctx = canvas.getContext('2d');
      if (!ctx) { animRef.current = requestAnimationFrame(animate); return; }

      const { w, h } = state;
      state.time += 0.016; // ~60fps delta
      const t = state.time;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // ── Layer 1: Subtle grid ──
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      const offsetX = (t * 3) % gridSize;
      const offsetY = (t * 2) % gridSize;
      ctx.beginPath();
      for (let x = -gridSize + offsetX; x < w + gridSize; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = -gridSize + offsetY; y < h + gridSize; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Grid intersection glow
      for (let x = -gridSize + offsetX; x < w + gridSize; x += gridSize) {
        for (let y = -gridSize + offsetY; y < h + gridSize; y += gridSize) {
          const d = mouseActive ? dist(x, y, mx, my) : 9999;
          if (d < 150) {
            const alpha = (1 - d / 150) * 0.15;
            ctx.fillStyle = `rgba(0, 255, 200, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // ── Layer 2: Circuit traces ──
      for (const trace of state.traces) {
        trace.progress = (trace.progress + trace.speed) % 1;
        const pts = trace.points;
        const totalSegs = pts.length - 1;

        // Draw full trace faintly
        ctx.strokeStyle = trace.color.replace(')', ', 0.04)').replace('rgb', 'rgba').replace('#', '');
        // Use hex with low alpha
        ctx.globalAlpha = 0.06;
        ctx.lineWidth = trace.width;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = trace.color;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Draw glowing head
        const segIdx = Math.floor(trace.progress * totalSegs);
        const segProgress = (trace.progress * totalSegs) % 1;
        if (segIdx < totalSegs) {
          const headX = lerp(pts[segIdx].x, pts[segIdx + 1].x, segProgress);
          const headY = lerp(pts[segIdx].y, pts[segIdx + 1].y, segProgress);

          // Glow
          const grad = ctx.createRadialGradient(headX, headY, 0, headX, headY, 8);
          grad.addColorStop(0, trace.color + 'AA');
          grad.addColorStop(1, trace.color + '00');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(headX, headY, 8, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = trace.color;
          ctx.beginPath();
          ctx.arc(headX, headY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Layer 3: Code rain ──
      ctx.textBaseline = 'top';
      for (const drop of state.codeDrops) {
        drop.y += drop.speed;
        if (drop.y > h + 30) {
          drop.y = -30;
          drop.text = CODE_KEYWORDS[Math.floor((t * 100 + drop.col) % CODE_KEYWORDS.length)];
        }

        // Mouse proximity boost
        let alpha = drop.opacity;
        if (mouseActive) {
          const d = dist(drop.x, drop.y, mx, my);
          if (d < 200) {
            alpha += (1 - d / 200) * 0.12;
          }
        }

        ctx.font = `${drop.fontSize}px "JetBrains Mono", "Fira Code", "Cascadia Code", monospace`;
        ctx.fillStyle = `rgba(0, 255, 170, ${alpha})`;
        ctx.fillText(drop.text, drop.x, drop.y);
      }

      // ── Layer 4: Network nodes & connections ──
      // Update node positions (gentle drift)
      for (const node of state.nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Soft bounce off edges
        if (node.x < 40 || node.x > w - 40) node.vx *= -1;
        if (node.y < 40 || node.y > h - 40) node.vy *= -1;

        // Mouse repulsion
        if (mouseActive) {
          const d = dist(node.x, node.y, mx, my);
          if (d < 180 && d > 0) {
            const force = (1 - d / 180) * 0.8;
            node.x += ((node.x - mx) / d) * force;
            node.y += ((node.y - my) / d) * force;
          }
        }
      }

      // Draw connections
      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const n1 = state.nodes[i];
          const n2 = state.nodes[j];
          const d = dist(n1.x, n1.y, n2.x, n2.y);
          const maxDist = Math.min(w, h) * 0.35;
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.12;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of state.nodes) {
        const pulse = Math.sin(t * 2 + node.pulsePhase) * 0.3 + 0.7;
        const r = node.radius * pulse;

        // Outer glow
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 6);
        grad.addColorStop(0, node.color + '18');
        grad.addColorStop(1, node.color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 6, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = node.color + 'CC';
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = '9px "JetBrains Mono", "Fira Code", monospace';
        ctx.fillStyle = node.color + '88';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + r + 4);
      }

      // ── Layer 5: Data-flow particles ──
      for (const p of state.particles) {
        p.progress += p.speed;
        if (p.progress >= 1) {
          // Pick new source/target
          const fromIdx = Math.floor((t * 10 + p.size * 100) % state.nodes.length);
          let toIdx = Math.floor((t * 7 + p.size * 50) % state.nodes.length);
          if (toIdx === fromIdx) toIdx = (toIdx + 1) % state.nodes.length;
          p.x = state.nodes[fromIdx].x;
          p.y = state.nodes[fromIdx].y;
          p.targetX = state.nodes[toIdx].x;
          p.targetY = state.nodes[toIdx].y;
          p.color = state.nodes[fromIdx].color;
          p.progress = 0;
        }

        // Bezier curve for smooth path
        const midX = (p.x + p.targetX) / 2 + Math.sin(t + p.size * 10) * 40;
        const midY = (p.y + p.targetY) / 2 + Math.cos(t + p.size * 10) * 40;
        const prog = p.progress;
        const invProg = 1 - prog;
        const cx = invProg * invProg * p.x + 2 * invProg * prog * midX + prog * prog * p.targetX;
        const cy = invProg * invProg * p.y + 2 * invProg * prog * midY + prog * prog * p.targetY;

        // Fade in/out
        const fadeAlpha = prog < 0.1 ? prog / 0.1 : prog > 0.9 ? (1 - prog) / 0.1 : 1;

        const glowAlpha = Math.round(fadeAlpha * 153).toString(16).padStart(2, '0');
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.size * 3);
        glow.addColorStop(0, p.color + glowAlpha);
        glow.addColorStop(1, p.color + '00');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        const coreAlpha = Math.round(fadeAlpha * 230).toString(16).padStart(2, '0');
        ctx.fillStyle = p.color + coreAlpha;
        ctx.beginPath();
        ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Layer 6: Terminal prompts at corners ──
      const terminals = [
        { x: 20, y: h - 60, text: '$ npm run build' },
        { x: w - 200, y: 30, text: '$ git push origin main' },
        { x: 20, y: 30, text: '> SELECT * FROM users' },
        { x: w - 220, y: h - 40, text: '$ docker compose up -d' },
      ];

      for (let i = 0; i < terminals.length; i++) {
        const term = terminals[i];
        const charCount = Math.floor((t * 3 + i * 5) % (term.text.length + 8));
        const displayText = term.text.slice(0, Math.min(charCount, term.text.length));
        const showCursor = charCount <= term.text.length;

        ctx.font = '10px "JetBrains Mono", "Fira Code", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(0, 255, 100, 0.08)';
        ctx.fillText(displayText + (showCursor && Math.sin(t * 6) > 0 ? '█' : ''), term.x, term.y);
      }

      // ── Layer 7: Bracket pairs floating ──
      const brackets = ['<>', '</>', '{ }', '[ ]', '( )', '=> { }', '/**/', '::'];
      for (let i = 0; i < brackets.length; i++) {
        const bx = (w * 0.15) + (i / brackets.length) * (w * 0.7) + Math.sin(t * 0.5 + i * 2) * 30;
        const by = h * 0.2 + Math.cos(t * 0.3 + i * 1.5) * (h * 0.25);
        const alpha = 0.03 + Math.sin(t + i) * 0.015;

        ctx.font = '18px "JetBrains Mono", "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(140, 200, 255, ${alpha})`;
        ctx.fillText(brackets[i], bx, by);
      }

      // ── Mouse spotlight ──
      if (mouseActive) {
        const spotlight = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        spotlight.addColorStop(0, 'rgba(0, 255, 200, 0.03)');
        spotlight.addColorStop(0.5, 'rgba(0, 150, 255, 0.015)');
        spotlight.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.arc(mx, my, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, initState]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
