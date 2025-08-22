class Color {
  constructor(t, s, h) {
    this.set(t, s, h);
  }
  toString() {
    return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(
      this.b
    )})`;
  }
  set(t, s, h) {
    (this.r = this.clamp(t)),
      (this.g = this.clamp(s)),
      (this.b = this.clamp(h));
  }
  hueRotate(t = 0) {
    t = (t / 180) * Math.PI;
    const s = Math.sin(t),
      h = Math.cos(t);
    this.multiply([
      0.213 + 0.787 * h - 0.213 * s,
      0.715 - 0.715 * h - 0.715 * s,
      0.072 - 0.072 * h + 0.928 * s,
      0.213 - 0.213 * h + 0.143 * s,
      0.715 + 0.285 * h + 0.14 * s,
      0.072 - 0.072 * h - 0.283 * s,
      0.213 - 0.213 * h - 0.787 * s,
      0.715 - 0.715 * h + 0.715 * s,
      0.072 + 0.928 * h + 0.072 * s,
    ]);
  }
  grayscale(t = 1) {
    this.multiply([
      0.2126 + 0.7874 * (1 - t),
      0.7152 - 0.7152 * (1 - t),
      0.0722 - 0.0722 * (1 - t),
      0.2126 - 0.2126 * (1 - t),
      0.7152 + 0.2848 * (1 - t),
      0.0722 - 0.0722 * (1 - t),
      0.2126 - 0.2126 * (1 - t),
      0.7152 - 0.7152 * (1 - t),
      0.0722 + 0.9278 * (1 - t),
    ]);
  }
  sepia(t = 1) {
    this.multiply([
      0.393 + 0.607 * (1 - t),
      0.769 - 0.769 * (1 - t),
      0.189 - 0.189 * (1 - t),
      0.349 - 0.349 * (1 - t),
      0.686 + 0.314 * (1 - t),
      0.168 - 0.168 * (1 - t),
      0.272 - 0.272 * (1 - t),
      0.534 - 0.534 * (1 - t),
      0.131 + 0.869 * (1 - t),
    ]);
  }
  saturate(t = 1) {
    this.multiply([
      0.213 + 0.787 * t,
      0.715 - 0.715 * t,
      0.072 - 0.072 * t,
      0.213 - 0.213 * t,
      0.715 + 0.285 * t,
      0.072 - 0.072 * t,
      0.213 - 0.213 * t,
      0.715 - 0.715 * t,
      0.072 + 0.928 * t,
    ]);
  }
  multiply(t) {
    const s = this.clamp(this.r * t[0] + this.g * t[1] + this.b * t[2]),
      h = this.clamp(this.r * t[3] + this.g * t[4] + this.b * t[5]),
      i = this.clamp(this.r * t[6] + this.g * t[7] + this.b * t[8]);
    (this.r = s), (this.g = h), (this.b = i);
  }
  brightness(t = 1) {
    this.linear(t);
  }
  contrast(t = 1) {
    this.linear(t, -0.5 * t + 0.5);
  }
  linear(t = 1, s = 0) {
    (this.r = this.clamp(this.r * t + 255 * s)),
      (this.g = this.clamp(this.g * t + 255 * s)),
      (this.b = this.clamp(this.b * t + 255 * s));
  }
  invert(t = 1) {
    (this.r = this.clamp(255 * (t + (this.r / 255) * (1 - 2 * t)))),
      (this.g = this.clamp(255 * (t + (this.g / 255) * (1 - 2 * t)))),
      (this.b = this.clamp(255 * (t + (this.b / 255) * (1 - 2 * t))));
  }
  hsl() {
    const t = this.r / 255,
      s = this.g / 255,
      h = this.b / 255,
      i = Math.max(t, s, h),
      r = Math.min(t, s, h);
    let a,
      e,
      l = (i + r) / 2;
    if (i === r) a = e = 0;
    else {
      const o = i - r;
      switch (((e = l > 0.5 ? o / (2 - i - r) : o / (i + r)), i)) {
        case t:
          a = (s - h) / o + (s < h ? 6 : 0);
          break;
        case s:
          a = (h - t) / o + 2;
          break;
        case h:
          a = (t - s) / o + 4;
      }
      a /= 6;
    }
    return { h: 100 * a, s: 100 * e, l: 100 * l };
  }
  clamp(t) {
    return t > 255 ? (t = 255) : t < 0 && (t = 0), t;
  }
}
class Solver {
  constructor(t, s) {
    (this.target = t),
      (this.targetHSL = t.hsl()),
      (this.reusedColor = new Color(0, 0, 0));
  }
  solve() {
    const t = this.solveNarrow(this.solveWide());
    return { values: t.values, loss: t.loss, filter: this.css(t.values) };
  }
  solveWide() {
    const t = [60, 180, 18e3, 600, 1.2, 1.2];
    let s = { loss: 1 / 0 };
    for (let h = 0; s.loss > 25 && h < 3; h++) {
      const h = [50, 20, 3750, 50, 100, 100],
        i = this.spsa(5, t, 15, h, 1e3);
      i.loss < s.loss && (s = i);
    }
    return s;
  }
  solveNarrow(t) {
    const s = t.loss,
      h = s + 1,
      i = [0.25 * h, 0.25 * h, h, 0.25 * h, 0.2 * h, 0.2 * h];
    return this.spsa(s, i, 2, t.values, 500);
  }
  spsa(t, s, h, i, r) {
    let a = null,
      e = 1 / 0;
    const l = new Array(6),
      o = new Array(6),
      n = new Array(6);
    for (let u = 0; u < r; u++) {
      const r = h / Math.pow(u + 1, 0.16666666666666666);
      for (let t = 0; t < 6; t++)
        (l[t] = Math.random() > 0.5 ? 1 : -1),
          (o[t] = i[t] + r * l[t]),
          (n[t] = i[t] - r * l[t]);
      const p = this.loss(o) - this.loss(n);
      for (let h = 0; h < 6; h++) {
        const a = (p / (2 * r)) * l[h],
          e = s[h] / Math.pow(t + u + 1, 1);
        i[h] = c(i[h] - e * a, h);
      }
      const g = this.loss(i);
      g < e && ((a = i.slice(0)), (e = g));
    }
    return { values: a, loss: e };
    function c(t, s) {
      let h = 100;
      return (
        2 === s ? (h = 7500) : (4 !== s && 5 !== s) || (h = 200),
        3 === s
          ? t > h
            ? (t %= h)
            : t < 0 && (t = h + (t % h))
          : t < 0
          ? (t = 0)
          : t > h && (t = h),
        t
      );
    }
  }
  loss(t) {
    const s = this.reusedColor;
    s.set(0, 0, 0),
      s.invert(t[0] / 100),
      s.sepia(t[1] / 100),
      s.saturate(t[2] / 100),
      s.hueRotate(3.6 * t[3]),
      s.brightness(t[4] / 100),
      s.contrast(t[5] / 100);
    const h = s.hsl();
    return (
      Math.abs(s.r - this.target.r) +
      Math.abs(s.g - this.target.g) +
      Math.abs(s.b - this.target.b) +
      Math.abs(h.h - this.targetHSL.h) +
      Math.abs(h.s - this.targetHSL.s) +
      Math.abs(h.l - this.targetHSL.l)
    );
  }
  css(t) {
    function s(s, h = 1) {
      return Math.round(t[s] * h);
    }
    return `filter: invert(${s(0)}%) sepia(${s(1)}%) saturate(${s(
      2
    )}%) hue-rotate(${s(3, 3.6)}deg) brightness(${s(4)}%) contrast(${s(5)}%);`;
  }
}
function hexToRgb(t) {
  t = t.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (t, s, h, i) => s + s + h + h + i + i
  );
  const s = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
  return s
    ? [parseInt(s[1], 16), parseInt(s[2], 16), parseInt(s[3], 16)]
    : null;
}

window.hexToRgb = hexToRgb;
window.Color = Color;
window.Solver = Solver;
