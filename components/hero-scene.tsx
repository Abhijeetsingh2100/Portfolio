"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020814);
    scene.fog = new THREE.Fog(0x050814, 8, 24);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.2, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "2";
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xa5f3fc, 1.35);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0x7dd3fc, 2.8);
    key.position.set(3, 4, 6);
    scene.add(key);

    const accent = new THREE.PointLight(0x2dd4bf, 2.1, 30);
    accent.position.set(-3, -2, 4);
    scene.add(accent);

    const fill = new THREE.SpotLight(0x67e8f9, 1.6, 36, Math.PI / 5, 0.45, 1);
    fill.position.set(0, 7, 9);
    scene.add(fill);

    const core = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.55, 0.48, 220, 28),
      new THREE.MeshStandardMaterial({
        color: 0x163047,
        metalness: 0.98,
        roughness: 0.12,
        emissive: 0x0ea5a3,
        emissiveIntensity: 1.4,
      }),
    );
    core.scale.setScalar(1.05);
    scene.add(core);

    const innerCore = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.92, 1),
      new THREE.MeshStandardMaterial({
        color: 0xeffcff,
        metalness: 0.8,
        roughness: 0.18,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.95,
      }),
    );
    scene.add(innerCore);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.05, 1),
      new THREE.MeshStandardMaterial({
        color: 0x0b1320,
        metalness: 0.25,
        roughness: 0.45,
        wireframe: true,
        transparent: true,
        opacity: 0.38,
      }),
    );
    scene.add(shell);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.02, 24, 260),
      new THREE.MeshBasicMaterial({
        color: 0x9be7ff,
        transparent: true,
        opacity: 0.72,
      }),
    );
    ring.rotation.x = Math.PI / 2.6;
    scene.add(ring);

    const secondaryRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.015, 18, 220),
      new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        transparent: true,
        opacity: 0.38,
      }),
    );
    secondaryRing.rotation.z = Math.PI / 4;
    secondaryRing.rotation.x = Math.PI / 1.8;
    scene.add(secondaryRing);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(4.1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x9be7ff,
        wireframe: true,
        transparent: true,
        opacity: 0.11,
      }),
    );
    scene.add(halo);

    const orbit = new THREE.Group();
    const satelliteMaterial = new THREE.MeshStandardMaterial({
      color: 0xeffcff,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.45,
    });
    const satelliteGeometry = new THREE.SphereGeometry(0.16, 20, 20);
    const satelliteA = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satelliteA.position.set(4.15, 0, 0);
    orbit.add(satelliteA);
    const satelliteB = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satelliteB.position.set(-4.15, 0, 0);
    orbit.add(satelliteB);
    const satelliteC = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satelliteC.position.set(0, 0, 4.15);
    orbit.add(satelliteC);
    scene.add(orbit);

    const floorPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.055,
        wireframe: true,
      }),
    );
    floorPlane.rotation.x = -Math.PI / 2;
    floorPlane.position.y = -4.2;
    scene.add(floorPlane);

    const particles = new THREE.BufferGeometry();
    const particleCount = 1200;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 8 + Math.random() * 14;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 12;
      particlePositions[i] = Math.cos(angle) * radius;
      particlePositions[i + 1] = height;
      particlePositions[i + 2] = Math.sin(angle) * radius;
    }
    particles.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );

    const particleField = new THREE.Points(
      particles,
      new THREE.PointsMaterial({
        color: 0x7cf8ea,
        size: 0.035,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
      }),
    );
    scene.add(particleField);

    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      mouse.set(x, y);
      targetRotation.set(y * 0.55, x * 0.8);
    };

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    let frame = 0;
    const animate = () => {
      frame += 0.01;
      if (!reducedMotion) {
        core.rotation.x += 0.003 + targetRotation.x * 0.012;
        core.rotation.y += 0.004 + targetRotation.y * 0.012;
        shell.rotation.y = frame * 0.18;
        ring.rotation.z = frame * 0.12;
        secondaryRing.rotation.x = Math.PI / 1.8 + Math.sin(frame * 0.6) * 0.12;
        secondaryRing.rotation.z = Math.PI / 4 + Math.cos(frame * 0.5) * 0.18;
        halo.rotation.y = frame * 0.06;
        orbit.rotation.y = frame * 0.35;
        orbit.rotation.x = Math.sin(frame * 0.4) * 0.12;
        particleField.rotation.y = frame * 0.03;
        core.position.y = Math.sin(frame * 0.7) * 0.08;
        core.position.x = Math.cos(frame * 0.4) * 0.08;
        innerCore.rotation.x = frame * 0.32;
        innerCore.rotation.y = frame * 0.48;
        floorPlane.rotation.z = Math.sin(frame * 0.18) * 0.06;
      }

      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.025;
      camera.position.y += (-mouse.y * 0.35 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestId = window.requestAnimationFrame(animate);
    };

    let requestId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(requestId);
      geometryDispose(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden="true" />;
}

function geometryDispose(scene: THREE.Scene) {
  scene.traverse((object) => {
    if ((object as THREE.Mesh).geometry) {
      (object as THREE.Mesh).geometry.dispose();
    }
    const material = (object as THREE.Mesh).material;
    if (material) {
      if (Array.isArray(material)) {
        material.forEach((entry) => entry.dispose());
      } else {
        material.dispose();
      }
    }
  });
}
