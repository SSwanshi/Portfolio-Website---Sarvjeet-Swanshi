'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Shaders ────────────────────────────────────────────────────────────────

const vertexShader = `
precision highp float;
precision highp int;

attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 mouse;
attribute vec2 aFront;
attribute float random;

uniform vec2 resolution;
uniform float pixelRatio;
uniform float timestamp;

uniform float size;
uniform float minSize;
uniform float speed;
uniform float far;
uniform float spread;
uniform float maxSpread;
uniform float maxZ;
uniform float maxDiff;
uniform float diffPow;

varying float vProgress;
varying float vRandom;
varying float vDiff;
varying float vSpreadLength;
varying float vPositionZ;

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

const float PI = 3.1415926;
const float PI2 = PI * 2.;

void main () {
  float progress = clamp((timestamp - mouse.z) * speed, 0., 1.);
  progress *= step(0., mouse.x);

  float startX = mouse.x - resolution.x / 2.;
  float startY = mouse.y - resolution.y / 2.;
  vec3 startPosition = vec3(startX, startY, random);

  float diff = clamp(mouse.w / maxDiff, 0., 1.);
  diff = pow(diff, diffPow);

  vec3 cPosition = position * 2. - 1.;

  float radian = cPosition.x * PI2 - PI;
  vec2 xySpread = vec2(cos(radian), sin(radian)) * spread * mix(1., maxSpread, diff) * cPosition.y;

  vec3 endPosition = startPosition;
  endPosition.xy += xySpread;
  endPosition.xy -= aFront * far * random;
  endPosition.z += cPosition.z * maxZ * (pixelRatio > 1. ? 1.2 : 1.);

  float positionProgress = cubicOut(progress * random);
  vec3 currentPosition = mix(startPosition, endPosition, positionProgress);

  vProgress = progress;
  vRandom = random;
  vDiff = diff;
  vSpreadLength = cPosition.y;
  vPositionZ = position.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.);
  gl_PointSize = max(currentPosition.z * size * diff * pixelRatio, minSize * (pixelRatio > 1. ? 1.3 : 1.));
}
`;

const fragmentShader = `
precision highp float;
precision highp int;

uniform float fadeSpeed;
uniform float shortRangeFadeSpeed;
uniform float minFlashingSpeed;
uniform float blur;

varying float vProgress;
varying float vRandom;
varying float vDiff;
varying float vSpreadLength;
varying float vPositionZ;

highp float random(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt = dot(co.xy, vec2(a, b));
  highp float sn = mod(dt, 3.14);
  return fract(sin(sn) * c);
}

float quadraticIn(float t) {
  return t * t;
}

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineOut(float t) {
  return sin(t * HALF_PI);
}

// Very light blue color
const vec3 baseColor = vec3(0.65, 0.82, 1.0);

void main(){
  vec2 p = gl_PointCoord * 2. - 1.;
  float len = length(p);

  float cRandom = random(vec2(vProgress * mix(minFlashingSpeed, 1., vRandom)));
  cRandom = mix(0.3, 2., cRandom);

  float cBlur = blur * mix(1., 0.3, vPositionZ);
  float shape = smoothstep(1. - cBlur, 1. + cBlur, (1. - cBlur) / len);
  shape *= mix(0.5, 1., vRandom);

  if (shape == 0.) discard;

  float darkness = mix(0.1, 1., vPositionZ);

  float alphaProgress = vProgress * fadeSpeed * mix(2.5, 1., pow(vDiff, 0.6));
  alphaProgress *= mix(shortRangeFadeSpeed, 1., sineOut(vSpreadLength) * quadraticIn(vDiff));
  float alpha = 1. - min(alphaProgress, 1.);
  alpha *= cRandom * vDiff;

  gl_FragColor = vec4(baseColor * darkness * cRandom, shape * alpha);
}
`;

// ─── Constants ──────────────────────────────────────────────────────────────

const PER_MOUSE = 800;
const COUNT = PER_MOUSE * 400;
const MOUSE_ATTR = 4;
const CAMERA_Z = 5000;

const UNIFORM_DEFAULTS = {
  size: 0.07,
  minSize: 1,
  speed: 0.012,
  fadeSpeed: 1.1,
  shortRangeFadeSpeed: 1.3,
  minFlashingSpeed: 0.1,
  spread: 7,
  maxSpread: 5,
  maxZ: 150,
  blur: 1,
  far: 10,
  maxDiff: 100,
  diffPow: 0.24,
};

// ─── Easing helpers ─────────────────────────────────────────────────────────

function easeOutQuint(t: number, b: number, c: number, d: number) {
  return c * (Math.pow(t / d - 1, 5) + 1) + b;
}

function easeInOutCubic(t: number, b: number, c: number, d: number) {
  if ((t /= d / 2) < 1) return (c / 2) * Math.pow(t, 3) + b;
  return (c / 2) * (Math.pow(t - 2, 3) + 2) + b;
}

function animate(
  fn: (pos: number, time: number) => void,
  opts: {
    begin?: number;
    finish?: number;
    duration?: number;
    easing?: 'easeOutQuint' | 'easeInOutCubic';
    onAfter?: () => void;
  }
) {
  const { begin = 0, finish = 1, duration = 500, easing = 'easeInOutCubic', onAfter } = opts;
  const change = finish - begin;
  const easeFn = easing === 'easeOutQuint' ? easeOutQuint : easeInOutCubic;
  let startTime: number;

  function tick(timestamp: number) {
    const time = Math.min(duration, timestamp - startTime);
    const position = easeFn(time, begin, change, duration);
    fn(position, time);
    if (time === duration) {
      onAfter?.();
    } else {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame((ts) => {
    startTime = ts;
    tick(ts);
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ShootingStarCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Store-like state ──────────────────────────────────────────────
    const store = {
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      clientHalfWidth: window.innerWidth / 2,
      clientHalfHeight: window.innerHeight / 2,
      initialClientWidth: window.innerWidth,
      initialClientHeight: window.innerHeight,
      initialRatio: 1,
      ratio: window.innerWidth / window.innerHeight,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    };

    // ── Renderer ──────────────────────────────────────────────────────
    const pixelRatio = window.devicePixelRatio;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: pixelRatio === 1, alpha: false });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── Camera + Scene ────────────────────────────────────────────────
    const fov = Math.atan(window.innerHeight / 2 / CAMERA_Z) * (180 / Math.PI) * 2;
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, CAMERA_Z);
    camera.position.set(0, 0, CAMERA_Z);
    camera.updateProjectionMatrix();
    const scene = new THREE.Scene();

    // ── Shooting star geometry ────────────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const mouseAttr: number[] = [];
    const frontAttr: number[] = [];
    const randomAttr: number[] = [];

    for (let i = 0; i < COUNT; i++) {
      positions.push(Math.random(), Math.random(), Math.random());
      mouseAttr.push(-1, -1, 0, 0);
      frontAttr.push(0, 0);
      randomAttr.push(Math.random());
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('mouse', new THREE.Float32BufferAttribute(mouseAttr, MOUSE_ATTR));
    geometry.setAttribute('aFront', new THREE.Float32BufferAttribute(frontAttr, 2));
    geometry.setAttribute('random', new THREE.Float32BufferAttribute(randomAttr, 1));

    const uniforms: Record<string, { value: unknown }> = {
      resolution: { value: store.resolution },
      pixelRatio: { value: pixelRatio },
      timestamp: { value: 0 },
    };
    for (const [k, v] of Object.entries(UNIFORM_DEFAULTS)) {
      uniforms[k] = { value: v };
    }

    const material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    // ── Shooting-star draw logic ──────────────────────────────────────
    let mouseI = 0;
    let oldPosition: THREE.Vector2 | null = null;

    function setSize() {
      store.clientWidth = window.innerWidth;
      store.clientHeight = window.innerHeight;
      store.clientHalfWidth = store.clientWidth / 2;
      store.clientHalfHeight = store.clientHeight / 2;
      store.resolution = new THREE.Vector2(store.clientWidth, store.clientHeight);
      store.ratio = store.clientWidth / store.clientHeight;
    }

    function draw(clientX: number, clientY: number, ts: number) {
      const x = clientX + store.clientHalfWidth;
      const y = store.clientHeight - (clientY + store.clientHalfHeight);
      const newPos = new THREE.Vector2(x, y);
      const diff = oldPosition ? newPos.clone().sub(oldPosition) : new THREE.Vector2();
      const len = diff.length();
      const front = diff.clone().normalize();

      const mouseArr = geometry.attributes.mouse.array as Float32Array;
      const frontArr = geometry.attributes.aFront.array as Float32Array;

      for (let i = 0; i < PER_MOUSE; i++) {
        const ci = (mouseI % (COUNT * MOUSE_ATTR)) + i * MOUSE_ATTR;
        const pos = oldPosition ? oldPosition.clone().add(diff.clone().multiplyScalar(i / PER_MOUSE)) : newPos;
        mouseArr[ci] = pos.x;
        mouseArr[ci + 1] = pos.y;
        mouseArr[ci + 2] = ts;
        mouseArr[ci + 3] = len;
        frontArr[ci] = front.x;
        frontArr[ci + 1] = front.y;
      }

      oldPosition = newPos;
      geometry.attributes.mouse.needsUpdate = true;
      geometry.attributes.aFront.needsUpdate = true;
      mouseI += MOUSE_ATTR * PER_MOUSE;
    }

    // ── Animation loop ────────────────────────────────────────────────
    let startTime = 0;
    let rafId: number;
    const speed = 60 / 1000;

    function tick(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const time = (timestamp - startTime) * speed;
      uniforms.timestamp.value = time;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // ── Intro animation ───────────────────────────────────────────────
    let started = false;

    function introAnimation() {
      const period = Math.PI * 3;
      const amplitude = Math.min(Math.max(store.clientWidth * 0.1, 100), 180);

      animate(
        (progress) => {
          const ts = uniforms.timestamp.value as number;
          draw(
            Math.cos(progress * period) * amplitude,
            progress * store.clientHeight - store.clientHalfHeight,
            ts
          );
        },
        {
          duration: 1080,
          onAfter() {
            const ts = uniforms.timestamp.value as number;
            draw(-store.clientHalfWidth, store.clientHeight - store.clientHalfHeight, ts);
            draw(-store.clientHalfWidth * 1.1, 0, ts);
            setTimeout(() => startMouseTracking(), 300);
          },
        }
      );
    }

    function startMouseTracking() {
      if (started) return;
      started = true;

      const onPointerMove = (e: PointerEvent) => {
        const ts = uniforms.timestamp.value as number;
        draw(e.clientX - store.clientHalfWidth, e.clientY - store.clientHalfHeight, ts);
      };
      const onTouchHandler = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        const ts = uniforms.timestamp.value as number;
        draw(t.clientX - store.clientHalfWidth, t.clientY - store.clientHalfHeight, ts);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('touchstart', onTouchHandler, { passive: true });
      window.addEventListener('touchmove', onTouchHandler, { passive: true });

      cleanupRef.current = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('touchstart', onTouchHandler);
        window.removeEventListener('touchmove', onTouchHandler);
      };
    }

    // ── Resize handler ────────────────────────────────────────────────
    const onResize = () => {
      setSize();
      camera.aspect = store.clientWidth / store.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(store.clientWidth, store.clientHeight);
      uniforms.resolution.value = store.resolution;
    };
    window.addEventListener('resize', onResize);

    // Kick off
    setTimeout(() => introAnimation(), 300);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      cleanupRef.current?.();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
      style={{ cursor: 'none' }}
    />
  );
}
