import gsap from 'gsap';
import * as THREE from 'three';

export function initMotion() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.card,.service-card,.case-card,.hero-card,.av-card'));
  if (nodes.length) {
    gsap.fromTo(nodes.slice(0, 24),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: .65, stagger: .045, ease: 'power2.out', clearProps: 'transform' }
    );
  }
  const hero = document.querySelector<HTMLElement>('h1');
  if (hero) gsap.fromTo(hero, { opacity: .55, y: 8 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' });
}

export function initViewTransitions() {
  if (!('startViewTransition' in document)) return;
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link || link.target || link.hasAttribute('download') || event.defaultPrevented) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname || url.hash) return;
    event.preventDefault();
    const transition = (document as any).startViewTransition(() => { location.href = url.href; });
    transition.finished.catch(() => { location.href = url.href; });
  }, { capture: true });
}

export function initWebGLHero() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.getElementById('av-v9-webgl')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'av-v9-webgl';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch {
    canvas.remove();
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, .1, 50);
  camera.position.z = 6;

  const group = new THREE.Group();
  scene.add(group);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xd5b857, transparent: true, opacity: .13, wireframe: true });
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35 + i * .55, .008, 8, 90), ringMaterial.clone());
    ring.rotation.x = 1.1 + i * .17;
    ring.rotation.y = i * .38;
    group.add(ring);
  }

  const starCount = innerWidth < 700 ? 90 : 180;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = (Math.random() - .5) * 11;
    positions[i + 1] = (Math.random() - .5) * 8;
    positions[i + 2] = (Math.random() - .5) * 5;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xf5e8ad, size: .018, transparent: true, opacity: .45 }));
  scene.add(stars);

  let frame = 0;
  let visible = true;
  const observer = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); }, { rootMargin: '200px' });
  const hero = document.querySelector('main,header,.hero') || document.body;
  observer.observe(hero);

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(ratio);
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize, { passive: true });
  resize();

  function tick() {
    frame = requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    group.rotation.z += .00045;
    group.rotation.y += .0003;
    stars.rotation.y -= .00008;
    renderer.render(scene, camera);
  }
  tick();

  addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    renderer.dispose();
    geometry.dispose();
  }, { once: true });
}
