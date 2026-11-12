// Wykresy rysowane na <canvas> — bez zewnętrznych bibliotek, działa offline.
window.SZ = window.SZ || {};

SZ.Charts = (function () {
  const C = { grid: '#252d3c', axis: '#3d4860', text: '#8a94a8', textStrong: '#e7ebf3' };

  function setup(canvas) {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, r.width, r.height);
    return { ctx, w: r.width, h: r.height };
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  }

  // Kompas 2D z dowolnie wybranymi osiami + ślad historii.
  function compass(canvas, o) {
    const { ctx, w, h } = setup(canvas);
    const pad = 30, size = Math.min(w, h) - pad * 2, x0 = (w - size) / 2, y0 = (h - size) / 2;
    const toX = v => x0 + (v + 1) / 2 * size;
    const toY = v => y0 + (1 - (v + 1) / 2) * size;
    const { ax, ay } = o;

    // Ćwiartki: kolory biegunów zmieszane
    const half = size / 2;
    const quads = [
      [x0, y0, ax.negColor, ay.posColor], [x0 + half, y0, ax.posColor, ay.posColor],
      [x0, y0 + half, ax.negColor, ay.negColor], [x0 + half, y0 + half, ax.posColor, ay.negColor]
    ];
    quads.forEach(([qx, qy, c1, c2]) => {
      const g = ctx.createLinearGradient(qx, qy, qx + half, qy + half);
      g.addColorStop(0, hexA(c1, .13)); g.addColorStop(1, hexA(c2, .13));
      ctx.fillStyle = g; ctx.fillRect(qx, qy, half, half);
    });

    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const p = x0 + i * size / 10 + .5, q = y0 + i * size / 10 + .5;
      ctx.beginPath(); ctx.moveTo(p, y0); ctx.lineTo(p, y0 + size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0, q); ctx.lineTo(x0 + size, q); ctx.stroke();
    }
    ctx.strokeStyle = C.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0 + half, y0); ctx.lineTo(x0 + half, y0 + size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, y0 + half); ctx.lineTo(x0 + size, y0 + half); ctx.stroke();
    ctx.strokeRect(x0, y0, size, size);

    // Etykiety biegunów
    ctx.font = '600 11.5px Segoe UI, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = ay.posColor; ctx.fillText(o.labels.yPos, w / 2, y0 - 14);
    ctx.fillStyle = ay.negColor; ctx.fillText(o.labels.yNeg, w / 2, y0 + size + 14);
    ctx.save(); ctx.translate(x0 - 14, h / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ax.negColor; ctx.fillText(o.labels.xNeg, 0, 0); ctx.restore();
    ctx.save(); ctx.translate(x0 + size + 14, h / 2); ctx.rotate(Math.PI / 2);
    ctx.fillStyle = ax.posColor; ctx.fillText(o.labels.xPos, 0, 0); ctx.restore();

    // Ślad
    const trail = o.trail;
    if (trail.length > 1) {
      for (let i = 1; i < trail.length; i++) {
        const a = .15 + .6 * i / trail.length;
        ctx.strokeStyle = `rgba(165,180,252,${a})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(toX(trail[i - 1][0]), toY(trail[i - 1][1]));
        ctx.lineTo(toX(trail[i][0]), toY(trail[i][1])); ctx.stroke();
      }
      trail.forEach(([x, y], i) => {
        ctx.fillStyle = `rgba(165,180,252,${.2 + .5 * i / trail.length})`;
        ctx.beginPath(); ctx.arc(toX(x), toY(y), 2.5, 0, Math.PI * 2); ctx.fill();
      });
    }
    // Porównanie (migawka / znajomy) — pusty okrąg
    if (o.compare) {
      const qx = toX(o.compare[0]), qy = toY(o.compare[1]);
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(qx, qy, 9, 0, Math.PI * 2); ctx.stroke();
      ctx.font = '600 11px Segoe UI, system-ui, sans-serif'; ctx.fillStyle = '#fbbf24';
      ctx.textAlign = qx > w / 2 ? 'right' : 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(o.compareLabel || '', qx + (qx > w / 2 ? -15 : 15), qy);
    }
    // Aktualny punkt
    const [cx, cy] = o.point;
    const px = toX(cx), py = toY(cy);
    const glow = ctx.createRadialGradient(px, py, 0, px, py, 26);
    glow.addColorStop(0, 'rgba(255,255,255,.55)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(px, py, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#0d1017'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  // Radar biegunów: 12 ramion (każda oś = 2 przeciwległe bieguny).
  function radar(canvas, o) {
    const { ctx, w, h } = setup(canvas);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 82;
    const n = o.axes.length;
    const spokes = [];
    o.axes.forEach((a, i) => {
      const ang = -Math.PI / 2 + i * Math.PI / n;
      const v = o.scores[a.id] || 0;
      const cv = o.compare ? (o.compare[a.id] || 0) : 0;
      spokes[i] = { ang, val: Math.max(0, -v), cmp: Math.max(0, -cv), label: o.label(a.neg), color: a.negColor };
      spokes[i + n] = { ang: ang + Math.PI, val: Math.max(0, v), cmp: Math.max(0, cv), label: o.label(a.pos), color: a.posColor };
    });

    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    [.25, .5, .75, 1].forEach(f => {
      ctx.beginPath();
      spokes.forEach((s, i) => {
        const x = cx + Math.cos(s.ang) * R * f, y = cy + Math.sin(s.ang) * R * f;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.closePath(); ctx.stroke();
    });
    spokes.forEach(s => {
      ctx.strokeStyle = C.grid;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(s.ang) * R, cy + Math.sin(s.ang) * R); ctx.stroke();
    });

    // Wielokąt porównania (przerywany)
    if (o.compare) {
      ctx.setLineDash([5, 4]); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
      ctx.beginPath();
      spokes.forEach((s, i) => {
        const r = R * Math.max(.03, s.cmp), x = cx + Math.cos(s.ang) * r, y = cy + Math.sin(s.ang) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    }
    // Wielokąt
    const pts = spokes.map(s => {
      const r = R * Math.max(.03, s.val);
      return [cx + Math.cos(s.ang) * r, cy + Math.sin(s.ang) * r];
    });
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, 'rgba(124,156,255,.15)'); g.addColorStop(1, 'rgba(192,132,252,.45)');
    ctx.fillStyle = g; ctx.strokeStyle = '#a5b4fc'; ctx.lineWidth = 2;
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
    ctx.fill(); ctx.stroke();
    pts.forEach(([x, y], i) => {
      if (spokes[i].val <= 0) return;
      ctx.fillStyle = spokes[i].color; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    });

    // Etykiety
    ctx.font = '600 11px Segoe UI, system-ui, sans-serif'; ctx.textBaseline = 'middle';
    spokes.forEach(s => {
      const x = cx + Math.cos(s.ang) * (R + 12), y = cy + Math.sin(s.ang) * (R + 12);
      const c = Math.cos(s.ang);
      ctx.textAlign = Math.abs(c) < .2 ? 'center' : c > 0 ? 'left' : 'right';
      ctx.fillStyle = s.val > 0 ? s.color : C.text;
      ctx.globalAlpha = s.val > 0 ? 1 : .6;
      wrapText(ctx, s.label, x, y, 76);
      ctx.globalAlpha = 1;
    });
  }

  function wrapText(ctx, text, x, y, maxW) {
    const words = text.split(' '), lines = [];
    let line = '';
    words.forEach(wd => {
      const t = line ? line + ' ' + wd : wd;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = wd; } else line = t;
    });
    lines.push(line);
    const lh = 13, start = y - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => ctx.fillText(l, x, start + i * lh));
  }

  // Linie: wartość każdej osi po kolejnych odpowiedziach.
  function history(canvas, o) {
    const { ctx, w, h } = setup(canvas);
    const L = 34, Rr = 12, T = 12, B = 24;
    const pw = w - L - Rr, ph = h - T - B;
    const n = o.series.length;
    const toX = i => L + (n <= 1 ? pw / 2 : i / (n - 1) * pw);
    const toY = v => T + (1 - (v + 1) / 2) * ph;

    ctx.font = '11px Segoe UI, system-ui, sans-serif'; ctx.fillStyle = C.text;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    [-1, -.5, 0, .5, 1].forEach(v => {
      ctx.strokeStyle = v === 0 ? C.axis : C.grid; ctx.lineWidth = v === 0 ? 1.5 : 1;
      ctx.beginPath(); ctx.moveTo(L, toY(v) + .5); ctx.lineTo(w - Rr, toY(v) + .5); ctx.stroke();
      ctx.fillText((v > 0 ? '+' : '') + Math.round(v * 100), L - 6, toY(v));
    });
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const step = Math.max(1, Math.ceil(n / 14));
    for (let i = 0; i < n; i += step) ctx.fillText(String(i), toX(i), h - B + 6);
    if (n < 2) return;

    // Linia osi zaczyna się od pierwszej odpowiedzi, która jej dotyczy (null = brak danych).
    o.axes.forEach(a => {
      const start = o.series.findIndex(s => s[a.id] != null);
      if (start < 0) return;
      ctx.strokeStyle = a.color; ctx.lineWidth = 2.2; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(toX(Math.max(0, start - 1)), toY(0));
      for (let i = start; i < n; i++) ctx.lineTo(toX(i), toY(o.series[i][a.id]));
      ctx.stroke();
      ctx.fillStyle = a.color; ctx.beginPath(); ctx.arc(toX(n - 1), toY(o.series[n - 1][a.id]), 4, 0, Math.PI * 2); ctx.fill();
    });
  }

  // Wykres w ukrytej sekcji (zwiniętej albo w innej zakładce na telefonie) ma rozmiar ~0 —
  // wtedy go nie rysujemy, bo ujemne promienie rzucają wyjątek. Narysuje się po pokazaniu.
  const guard = fn => (canvas, o) => {
    const r = canvas.getBoundingClientRect();
    if (r.width < 120 || r.height < 80) return;
    fn(canvas, o);
  };
  return { compass: guard(compass), radar: guard(radar), history: guard(history) };
})();
