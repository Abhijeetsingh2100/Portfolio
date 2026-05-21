"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Comic3DViewProps {
  shape: "box" | "cloud" | "globe";
  theme?: "light" | "dark";
}

export default function Comic3DView({ shape, theme = "dark" }: Comic3DViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isDark = theme === "dark";
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Shading/Lighting
    const ambient = new THREE.AmbientLight(0xffffff, isDark ? 1.6 : 1.9);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const outlineColor = isDark ? 0x060910 : 0x0f172a;
    const meshGroup = new THREE.Group();

    // Helper to create toon material & outlines
    const getComicMaterials = (color: number) => {
      const mainMat = new THREE.MeshToonMaterial({ color });
      const outlineMat = new THREE.MeshBasicMaterial({
        color: outlineColor,
        side: THREE.BackSide,
      });
      return { mainMat, outlineMat };
    };

    const addMeshWithOutline = (
      geom: THREE.BufferGeometry,
      color: number,
      scale = 1.0,
      outlineScale = 1.08
    ) => {
      const subGroup = new THREE.Group();
      const { mainMat, outlineMat } = getComicMaterials(color);

      const mainMesh = new THREE.Mesh(geom, mainMat);
      mainMesh.scale.setScalar(scale);
      subGroup.add(mainMesh);

      const outlineMesh = new THREE.Mesh(geom, outlineMat);
      outlineMesh.scale.setScalar(scale * outlineScale);
      subGroup.add(outlineMesh);

      meshGroup.add(subGroup);
      return subGroup;
    };

    // Build the geometries based on the specified shape
    if (shape === "box") {
      // SpendLock: Locked Box
      const boxColor = isDark ? 0x22d3ee : 0xf43f5e; // Cyan vs Pink
      const lockColor = isDark ? 0xfacc15 : 0x8b5cf6; // Yellow vs Purple

      // Box body
      const bodyGeom = new THREE.PlaneGeometry(1, 1); // Mock dummy for outline logic, let's use BoxGeometry
      const boxGeom = new THREE.TorusGeometry(0.1, 0.05, 8, 8); // dummy
      
      const realBoxGeom = new THREE.BoxGeometry(1.3, 0.9, 0.9);
      addMeshWithOutline(realBoxGeom, boxColor, 1.0, 1.07);

      // Padlock band
      const bandGeom = new THREE.BoxGeometry(0.25, 0.95, 0.95);
      addMeshWithOutline(bandGeom, lockColor, 1.0, 1.1);

      // Lock clasp
      const claspGeom = new THREE.TorusGeometry(0.18, 0.05, 8, 16);
      const clasp = addMeshWithOutline(claspGeom, 0xd1d5db, 1.0, 1.2);
      clasp.position.set(0, 0.55, 0);
    } else if (shape === "cloud") {
      // Weather App: Fluffy cloud
      const cloudColor = isDark ? 0xe0f7fa : 0xffffff;
      const sphereGeom = new THREE.SphereGeometry(0.55, 12, 12);

      // Core sphere
      const sphere1 = addMeshWithOutline(sphereGeom, cloudColor, 1.0, 1.1);
      sphere1.position.set(0, 0.05, 0);

      // Left bulge
      const sphere2 = addMeshWithOutline(sphereGeom, cloudColor, 0.7, 1.15);
      sphere2.position.set(-0.52, -0.15, 0.1);

      // Right bulge
      const sphere3 = addMeshWithOutline(sphereGeom, cloudColor, 0.7, 1.15);
      sphere3.position.set(0.52, -0.15, 0.1);

      // Top bulge
      const sphere4 = addMeshWithOutline(sphereGeom, cloudColor, 0.5, 1.2);
      sphere4.position.set(0.1, 0.42, -0.05);
    } else if (shape === "globe") {
      // News App: Rotating globe
      const globeColor = isDark ? 0x8b5cf6 : 0x06b6d4; // Purple vs Cyan
      const bandColor = isDark ? 0xfacc15 : 0xf43f5e; // Yellow vs Pink

      const sphereGeom = new THREE.SphereGeometry(0.8, 16, 16);
      addMeshWithOutline(sphereGeom, globeColor, 1.0, 1.06);

      // Longitude / Latitude orbital wire loops
      const ringGeom = new THREE.TorusGeometry(0.85, 0.03, 8, 36);
      
      const ring1 = addMeshWithOutline(ringGeom, bandColor, 1.0, 1.15);
      ring1.rotation.y = Math.PI / 2;

      const ring2 = addMeshWithOutline(ringGeom, bandColor, 1.0, 1.15);
      ring2.rotation.x = Math.PI / 2;

      const ring3 = addMeshWithOutline(ringGeom, bandColor, 1.0, 1.15);
      ring3.rotation.z = Math.PI / 4;
    }

    scene.add(meshGroup);

    // Interaction mouse values
    const mouse = new THREE.Vector2();
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize listener
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId = 0;
    let frame = 0;

    const animate = () => {
      frame += 0.015;

      // Base rotation
      meshGroup.rotation.y = frame * 0.4;
      meshGroup.rotation.x = Math.sin(frame * 0.3) * 0.15;

      // Follow cursor slightly
      meshGroup.rotation.y += mouse.x * 0.35;
      meshGroup.rotation.x += mouse.y * 0.25;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      renderer.domElement.remove();
      meshGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      });
    };
  }, [shape, theme]);

  return <div ref={containerRef} className="h-full w-full relative" />;
}
