/* Devid srl: il tessuto 3D dell'apertura.
   Una pezza simulata (Verlet) appesa alla barra, in due metà cucite fra loro.
   Il mouse la spinge, il vento la muove, lo scroll la fa tagliare dal laser
   e poi la apre come un sipario. Legge l'avanzamento da window.devidEroe. */
import * as THREE from './three.module.min.js';

const tela = document.querySelector('[data-tela]');
const carta = document.querySelector('[data-eroe-carta]');
const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stato = (window.devidEroe = window.devidEroe || { taglio: 0, apertura: 0, entrata: 0, pronto: false });

function avvia() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: tela, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.documentElement.classList.add('senza-webgl');
    return;
  }
  const telefono = matchMedia('(max-width: 760px)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, telefono ? 2 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);

  /* ---- misure della pezza, secondo la forma della carta ---- */
  const larg0 = tela.clientWidth || innerWidth;
  const alt0 = tela.clientHeight || innerHeight;
  const verticale = alt0 > larg0 * 1.05;
  const H = verticale ? 3.1 : 2.45;
  const W = verticale ? 2.3 : Math.min(4.3, Math.max(2.8, H * (larg0 / alt0) * 0.78));
  const NX = (telefono ? 26 : 40) & ~1;
  const NY = Math.max(16, Math.round(NX * (H / W)));
  const passo = W / NX;
  const passoY = H / (NY - 1);
  const META = NX / 2;
  const ITER = telefono ? 9 : 13;

  /* ---- la trama del tessuto: una mappa delle normali disegnata ---- */
  function trama() {
    const n = 256, c = document.createElement('canvas');
    c.width = c.height = n;
    const g = c.getContext('2d');
    const im = g.createImageData(n, n);
    const alt = new Float32Array(n * n);
    const F = 8;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const fx = (x % F) / F, fy = (y % F) / F;
      const sopra = ((Math.floor(x / F) + Math.floor(y / F)) & 1) === 0;
      const ordito = Math.sin(Math.PI * fx), trama = Math.sin(Math.PI * fy);
      alt[y * n + x] = sopra ? ordito * 0.85 + trama * 0.25 : trama * 0.85 + ordito * 0.25;
    }
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const a = (dx, dy) => alt[((y + dy + n) % n) * n + ((x + dx + n) % n)];
      const nx = (a(-1, 0) - a(1, 0)) * 1.6, ny = (a(0, -1) - a(0, 1)) * 1.6;
      const l = Math.hypot(nx, ny, 1);
      const i = (y * n + x) * 4;
      im.data[i] = ((nx / l) * 0.5 + 0.5) * 255;
      im.data[i + 1] = ((ny / l) * 0.5 + 0.5) * 255;
      im.data[i + 2] = ((1 / l) * 0.5 + 0.5) * 255;
      im.data[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(W * 9, H * 9);
    t.anisotropy = 4;
    return t;
  }

  const materiale = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#2236d6'),
    roughness: 0.78,
    sheen: 1,
    sheenColor: new THREE.Color('#aebbff'),
    sheenRoughness: 0.42,
    side: THREE.DoubleSide,
    normalMap: trama(),
    normalScale: new THREE.Vector2(0.55, 0.55),
  });

  /* ---- le due metà ---- */
  function meta(c0, c1) {
    const cols = c1 - c0 + 1;
    const n = cols * NY;
    const pos = new Float32Array(n * 3);
    const prima = new Float32Array(n * 3);
    const base = new Float32Array(n * 3);
    for (let j = 0; j < NY; j++) for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 3;
      const x = -W / 2 + (c0 + i) * passo;
      const y = H / 2 - j * passoY;
      base[k] = x; base[k + 1] = y; base[k + 2] = 0;
    }
    pos.set(base); prima.set(base);
    const vincoli = [];
    const id = (i, j) => j * cols + i;
    for (let j = 0; j < NY; j++) for (let i = 0; i < cols; i++) {
      if (i < cols - 1) vincoli.push(id(i, j), id(i + 1, j), passo);
      if (j < NY - 1) vincoli.push(id(i, j), id(i, j + 1), passoY);
      if (i < cols - 1 && j < NY - 1) {
        const d = Math.hypot(passo, passoY);
        vincoli.push(id(i, j), id(i + 1, j + 1), d, id(i + 1, j), id(i, j + 1), d);
      }
      if (i < cols - 2) vincoli.push(id(i, j), id(i + 2, j), passo * 2);
      if (j < NY - 2) vincoli.push(id(i, j), id(i, j + 2), passoY * 2);
    }
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(pos, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', attr);
    const uv = new Float32Array(n * 2);
    for (let j = 0; j < NY; j++) for (let i = 0; i < cols; i++) {
      uv[id(i, j) * 2] = (c0 + i) / NX;
      uv[id(i, j) * 2 + 1] = 1 - j / (NY - 1);
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    const indici = [];
    for (let j = 0; j < NY - 1; j++) for (let i = 0; i < cols - 1; i++) {
      const a = id(i, j), b = id(i + 1, j), c = id(i, j + 1), d = id(i + 1, j + 1);
      indici.push(a, c, b, b, c, d);
    }
    geo.setIndex(indici);
    const mesh = new THREE.Mesh(geo, materiale);
    mesh.frustumCulled = false;
    scena.add(mesh);
    return { cols, n, pos, prima, base, vincoli: new Float32Array(vincoli), geo, attr, id, sinistra: c0 === 0 };
  }
  const metà = [meta(0, META), meta(META, NX)];
  const [SX, DX] = metà;

  /* ---- luci ---- */
  scena.add(new THREE.HemisphereLight('#d4dbff', '#090b18', 0.45));
  const chiave = new THREE.DirectionalLight('#ffffff', 3.4);
  chiave.position.set(3.6, 2.2, 2.6);
  scena.add(chiave);
  const controluce = new THREE.DirectionalLight('#5d70ff', 2.2);
  controluce.position.set(-3, 1.2, -3);
  scena.add(controluce);
  const radente = new THREE.DirectionalLight('#dfe4ff', 1.3);
  radente.position.set(-4, -0.5, 1.2);
  scena.add(radente);

  /* ---- il laser: una luce, un bagliore e le scintille ---- */
  const luceLaser = new THREE.PointLight('#c9d2ff', 0, 1.6, 1.6);
  scena.add(luceLaser);
  function bagliore() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.18, 'rgba(210,220,255,.85)');
    gr.addColorStop(0.45, 'rgba(110,130,255,.25)');
    gr.addColorStop(1, 'rgba(80,100,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const tex = bagliore();
  const punto = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
  punto.scale.set(0.34, 0.34, 1);
  scena.add(punto);
  const raggio = new THREE.Mesh(
    new THREE.PlaneGeometry(0.012, 6),
    new THREE.MeshBasicMaterial({ color: '#dfe4ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  scena.add(raggio);
  const NS = telefono ? 70 : 140;
  const scPos = new Float32Array(NS * 3), scVel = new Float32Array(NS * 3), scVita = new Float32Array(NS);
  const scGeo = new THREE.BufferGeometry();
  scGeo.setAttribute('position', new THREE.BufferAttribute(scPos, 3));
  const scintille = new THREE.Points(scGeo, new THREE.PointsMaterial({ map: tex, size: 0.045, color: '#e8ecff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
  scintille.frustumCulled = false;
  scena.add(scintille);
  for (let i = 0; i < NS; i++) scPos[i * 3 + 1] = -99;
  let prossima = 0;
  function scintilla(x, y, z) {
    const i = prossima; prossima = (prossima + 1) % NS;
    scPos[i * 3] = x; scPos[i * 3 + 1] = y; scPos[i * 3 + 2] = z + 0.02;
    const a = Math.random() * Math.PI * 2, v = 0.6 + Math.random() * 1.6;
    scVel[i * 3] = Math.cos(a) * v * 0.7; scVel[i * 3 + 1] = Math.sin(a) * v * 0.5 + 0.4; scVel[i * 3 + 2] = 0.6 + Math.random() * 1.2;
    scVita[i] = 0.4 + Math.random() * 0.5;
  }

  /* ---- dimensioni ---- */
  function misura() {
    const w = tela.clientWidth, h = tela.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const t = Math.tan((camera.fov * Math.PI) / 360);
    const dH = (H / 0.8) / 2 / t;
    const dW = (W / 0.86) / 2 / t / camera.aspect;
    camera.position.set(0, -0.06, Math.max(dH, dW));
    camera.position.x = 0.35;
    camera.lookAt(0, -0.06, 0);
    camera.updateProjectionMatrix();
  }
  misura();
  addEventListener('resize', misura);

  /* ---- il mouse spinge la stoffa ---- */
  const ray = new THREE.Raycaster();
  const piano = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mano = new THREE.Vector3(99, 99, 0);
  const manoPrima = new THREE.Vector3(99, 99, 0);
  let manoForza = 0;
  const v2 = new THREE.Vector2();
  function muovi(cx, cy) {
    const r = tela.getBoundingClientRect();
    v2.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(v2, camera);
    ray.ray.intersectPlane(piano, mano);
    manoForza = 1;
  }
  carta.addEventListener('pointermove', (e) => muovi(e.clientX, e.clientY), { passive: true });
  carta.addEventListener('pointerleave', () => { manoForza = 0; });

  /* ---- simulazione ---- */
  const G = -5.2;
  let tempo = 0;
  function bersaglioPerno(m, i, entra, apri) {
    /* il perno i della riga in cima: scende entrando, si raccoglie verso il bordo aprendo */
    const k = i * 3;
    let x = m.base[k], y = m.base[k + 1], z = 0;
    y += (1 - entra) * (H * 1.35);
    if (apri > 0) {
      const bordo = m.sinistra ? -W / 2 : W / 2;
      const raccolto = bordo + (x - bordo) * 0.42;
      const fuori = (m.sinistra ? -1 : 1) * W * (verticale ? 0.62 : 0.34) * apri;
      x = x + (raccolto - x) * apri + fuori;
      z = Math.sin(i * 1.15) * 0.05 * apri;
      y += apri * 0.05;
    }
    return [x, y, z];
  }
  function passoSim(dt) {
    tempo += dt;
    const entra = stato.entrata;
    const apri = ridotto ? 0 : stato.apertura;
    const tagliate = ridotto ? 0 : Math.floor(stato.taglio * NY + 0.0001);
    const dt2 = dt * dt;
    const spinta = manoForza > 0 && !ridotto;
    const R = 0.55;
    const mv = Math.min(1.5, mano.distanceTo(manoPrima) / Math.max(dt, 1e-4) * 0.03);
    for (const m of metà) {
      const p = m.pos, q = m.prima;
      for (let i = 0; i < m.n; i++) {
        const k = i * 3;
        const x = p[k], y = p[k + 1], z = p[k + 2];
        let ax = 0, ay = G, az = 0;
        const calma = 1 - apri * 0.75;
        /* vento leggero che passa sulla pezza */
        az += (Math.sin(tempo * 1.05 + x * 2.1 + y * 0.9) * 1.6 + Math.sin(tempo * 0.43 + x * 0.8 - y * 0.5) * 1.1 + Math.sin(tempo * 1.9 + x * 4.2) * 0.45) * calma;
        ax += Math.sin(tempo * 0.7 + y * 1.1) * 0.25;
        if (spinta) {
          const dx = x - mano.x, dy = y - mano.y;
          const d = Math.hypot(dx, dy);
          if (d < R) {
            const f = (1 - d / R);
            az -= f * f * (26 + mv * 30);
            ax += (dx / (d + 0.01)) * f * 4;
            ay += (dy / (d + 0.01)) * f * 4;
          }
        }
        const smorza = 0.985 - apri * 0.02;
        p[k] = x + (x - q[k]) * smorza + ax * dt2;
        p[k + 1] = y + (y - q[k + 1]) * smorza + ay * dt2;
        p[k + 2] = z + (z - q[k + 2]) * smorza + az * dt2;
        q[k] = x; q[k + 1] = y; q[k + 2] = z;
      }
    }
    for (let it = 0; it < ITER; it++) {
      for (const m of metà) {
        const p = m.pos, v = m.vincoli;
        for (let c = 0; c < v.length; c += 3) {
          const a = v[c] * 3, b = v[c + 1] * 3, l = v[c + 2];
          const dx = p[b] - p[a], dy = p[b + 1] - p[a + 1], dz = p[b + 2] - p[a + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          if (d < l * 0.98 && l > passo * 1.5) continue;
          const f = ((d - l) / d) * 0.5;
          p[a] += dx * f; p[a + 1] += dy * f; p[a + 2] += dz * f;
          p[b] -= dx * f; p[b + 1] -= dy * f; p[b + 2] -= dz * f;
        }
      }
      /* la cucitura fra le due metà, dove il laser non è ancora passato */
      for (let j = tagliate; j < NY; j++) {
        const a = SX.id(SX.cols - 1, j) * 3, b = DX.id(0, j) * 3;
        const ps = SX.pos, pd = DX.pos;
        const mx = (ps[a] + pd[b]) / 2, my = (ps[a + 1] + pd[b + 1]) / 2, mz = (ps[a + 2] + pd[b + 2]) / 2;
        ps[a] = mx; ps[a + 1] = my; ps[a + 2] = mz;
        pd[b] = mx; pd[b + 1] = my; pd[b + 2] = mz;
      }
      /* i perni della barra */
      for (const m of metà) {
        for (let i = 0; i < m.cols; i++) {
          const t = bersaglioPerno(m, i, entra, apri);
          const k = m.id(i, 0) * 3;
          m.pos[k] = t[0]; m.pos[k + 1] = t[1]; m.pos[k + 2] = t[2];
        }
      }
    }
    manoPrima.copy(mano);
    manoForza *= 0.96;
    return tagliate;
  }

  /* ---- scintille e laser ---- */
  function laser(dt) {
    const c = stato.taglio;
    const attivo = !ridotto && c > 0.002 && c < 0.995 && stato.apertura < 0.02;
    const j = Math.min(NY - 1, Math.max(0, c * NY));
    const j0 = Math.floor(j), j1 = Math.min(NY - 1, j0 + 1), f = j - j0;
    const a0 = SX.id(SX.cols - 1, j0) * 3, a1 = SX.id(SX.cols - 1, j1) * 3;
    const b0 = DX.id(0, j0) * 3, b1 = DX.id(0, j1) * 3;
    const x = ((SX.pos[a0] + DX.pos[b0]) / 2) * (1 - f) + ((SX.pos[a1] + DX.pos[b1]) / 2) * f;
    const y = ((SX.pos[a0 + 1] + DX.pos[b0 + 1]) / 2) * (1 - f) + ((SX.pos[a1 + 1] + DX.pos[b1 + 1]) / 2) * f;
    const z = ((SX.pos[a0 + 2] + DX.pos[b0 + 2]) / 2) * (1 - f) + ((SX.pos[a1 + 2] + DX.pos[b1 + 2]) / 2) * f;
    const forza = attivo ? 1 : 0;
    punto.material.opacity += (forza * (0.85 + Math.random() * 0.15) - punto.material.opacity) * 0.25;
    raggio.material.opacity += (forza * 0.35 - raggio.material.opacity) * 0.2;
    luceLaser.intensity += (forza * 3.2 - luceLaser.intensity) * 0.2;
    punto.position.set(x, y, z + 0.03);
    luceLaser.position.set(x, y, z + 0.25);
    raggio.position.set(x, y + 3, z + 0.02);
    if (attivo && Math.abs(stato.velocita || 0) > 0.0005) for (let i = 0; i < 4; i++) scintilla(x, y, z);
    else if (attivo && Math.random() < 0.3) scintilla(x, y, z);
    for (let i = 0; i < NS; i++) {
      if (scVita[i] <= 0) { scPos[i * 3 + 1] = -99; continue; }
      scVita[i] -= dt;
      scVel[i * 3 + 1] -= 4.5 * dt;
      scPos[i * 3] += scVel[i * 3] * dt; scPos[i * 3 + 1] += scVel[i * 3 + 1] * dt; scPos[i * 3 + 2] += scVel[i * 3 + 2] * dt;
    }
    scGeo.attributes.position.needsUpdate = true;
  }

  /* ---- ciclo ---- */
  let visibile = true;
  new IntersectionObserver((v) => { visibile = v[0].isIntersecting; }).observe(carta);
  let ultimo = performance.now(), avanzo = 0;
  const FISSO = 1 / 60;
  function disegna() {
    for (const m of metà) { m.attr.needsUpdate = true; m.geo.computeVertexNormals(); }
    renderer.render(scena, camera);
  }
  function ciclo(ora) {
    requestAnimationFrame(ciclo);
    const dt = Math.min(0.05, (ora - ultimo) / 1000);
    ultimo = ora;
    if (!visibile || document.hidden) return;
    avanzo += dt;
    let n = 0;
    while (avanzo >= FISSO && n < 3) { passoSim(FISSO); avanzo -= FISSO; n++; }
    if (n === 3) avanzo = 0;
    laser(dt);
    disegna();
  }

  if (ridotto) {
    stato.entrata = 1;
    for (let i = 0; i < 240; i++) passoSim(FISSO);
    disegna();
    addEventListener('resize', disegna);
  } else {
    /* la pezza si assesta prima di comparire, fuori dalla vista */
    for (let i = 0; i < 30; i++) passoSim(FISSO);
    requestAnimationFrame(ciclo);
  }
  stato.pronto = true;
  document.documentElement.classList.add('tela-pronta');
}

if (tela && carta) avvia();
