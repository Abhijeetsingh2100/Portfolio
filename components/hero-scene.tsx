"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroSceneProps {
  theme?: "light" | "dark";
}

export default function HeroScene({ theme = "dark" }: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isDark = theme === "dark";
    const outlineColor = isDark ? 0x060910 : 0x0f172a;

    // 1. Scene & Setup
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(isDark ? 0x060812 : 0xfefefa, 8, 22);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.2, 8.5);

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
    renderer.domElement.style.pointerEvents = "auto"; // Enable pointer events for dragging
    renderer.domElement.style.zIndex = "2";
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambient = new THREE.AmbientLight(
      isDark ? 0x22d3ee : 0xffffff,
      isDark ? 1.7 : 1.9
    );
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(
      isDark ? 0xffffff : 0xfacc15,
      isDark ? 2.3 : 2.6
    );
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(
      isDark ? 0xf43f5e : 0x22d3ee,
      isDark ? 2.0 : 2.2,
      20
    );
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);

    // Main system group (rotates with drag + auto)
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // 3. Central Phone Object
    const phoneGroup = new THREE.Group();
    systemGroup.add(phoneGroup);

    // Phone casing geometry & outline
    const casingGeom = new THREE.BoxGeometry(1.5, 2.9, 0.16);
    const casingMat = new THREE.MeshToonMaterial({
      color: isDark ? 0x111625 : 0xe2e8f0,
    });
    const casingMesh = new THREE.Mesh(casingGeom, casingMat);
    phoneGroup.add(casingMesh);

    // Inverted hull casing outline
    const casingOutlineMat = new THREE.MeshBasicMaterial({
      color: outlineColor,
      side: THREE.BackSide,
    });
    const casingOutline = new THREE.Mesh(casingGeom, casingOutlineMat);
    casingOutline.scale.setScalar(1.045);
    phoneGroup.add(casingOutline);

    // Phone screen canvas & texture
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 256;
    screenCanvas.height = 512;
    const screenCtx = screenCanvas.getContext("2d");
    const screenTexture = new THREE.CanvasTexture(screenCanvas);

    const screenGeom = new THREE.BoxGeometry(1.38, 2.78, 0.18);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.z = 0.005; // Slightly forward
    phoneGroup.add(screenMesh);

    // Camera Notch
    const notchGeom = new THREE.BoxGeometry(0.48, 0.1, 0.2);
    const notchMat = new THREE.MeshBasicMaterial({ color: isDark ? 0x060910 : 0x1e293b });
    const notchMesh = new THREE.Mesh(notchGeom, notchMat);
    notchMesh.position.set(0, 1.3, 0.01);
    phoneGroup.add(notchMesh);

    // 4. Floating Skill Nodes Setup
    const skillList = [
      { name: "React Native", color: 0x22d3ee, hex: "#22d3ee", radius: 2.3, speed: 0.45, height: 0.6 },
      { name: "Kotlin", color: 0x8b5cf6, hex: "#8b5cf6", radius: 2.6, speed: -0.35, height: -0.6 },
      { name: "Firebase", color: 0xff7a00, hex: "#ff7a00", radius: 2.1, speed: 0.6, height: 0.0 },
      { name: "Expo", color: isDark ? 0xe2e8f0 : 0x475569, hex: isDark ? "#e2e8f0" : "#475569", radius: 2.7, speed: -0.4, height: 1.1 },
      { name: "REST APIs", color: 0xf43f5e, hex: "#f43f5e", radius: 2.4, speed: 0.55, height: -1.1 },
      { name: "UI Craft", color: 0xfacc15, hex: "#facc15", radius: 2.2, speed: -0.5, height: 0.4 },
    ];

    // Helper: Comic Text Sprite Generator
    const createComicBadgeTexture = (text: string, colorHex: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 256, 64);
        
        // Draw speech bubble background
        ctx.fillStyle = isDark ? "#111625" : "#ffffff";
        ctx.strokeStyle = isDark ? "#38f8e7" : "#0f172a";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(4, 4, 248, 56, 12);
        ctx.fill();
        ctx.stroke();

        // Dot accent
        ctx.fillStyle = colorHex;
        ctx.beginPath();
        ctx.arc(24, 32, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isDark ? "#38f8e7" : "#0f172a";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
        ctx.font = "bold 20px 'Syne', 'Arial Black', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 44, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return { texture, canvas };
    };

    const nodes: Array<{
      name: string;
      group: THREE.Group;
      mesh: THREE.Mesh;
      outline: THREE.Mesh;
      sprite: THREE.Sprite;
      line: THREE.Line;
      pulse: THREE.Mesh;
      pulseT: number;
      radius: number;
      speed: number;
      height: number;
      phase: number;
      color: number;
    }> = [];

    const selectableObjects: THREE.Object3D[] = [];
    const texturesToDispose: THREE.Texture[] = [screenTexture];

    const sphereGeom = new THREE.SphereGeometry(0.18, 16, 16);

    skillList.forEach((skill, idx) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.userData = { name: skill.name };
      systemGroup.add(nodeGroup);

      // Node mesh
      const nodeMat = new THREE.MeshToonMaterial({ color: skill.color });
      const nodeMesh = new THREE.Mesh(sphereGeom, nodeMat);
      nodeGroup.add(nodeMesh);

      // Node black outline
      const nodeOutlineMat = new THREE.MeshBasicMaterial({
        color: outlineColor,
        side: THREE.BackSide,
      });
      const nodeOutline = new THREE.Mesh(sphereGeom, nodeOutlineMat);
      nodeOutline.scale.setScalar(1.22);
      nodeGroup.add(nodeOutline);

      // Floating text sprite billboard
      const badgeData = createComicBadgeTexture(skill.name, skill.hex);
      texturesToDispose.push(badgeData.texture);
      const spriteMat = new THREE.SpriteMaterial({
        map: badgeData.texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 0.35, 1);
      nodeGroup.add(sprite);

      // Connection wire line
      const lineGeom = new THREE.BufferGeometry();
      const linePositions = new Float32Array(6); // 2 points (Node -> Phone)
      lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: isDark ? 0x22d3ee : 0x0f172a,
        transparent: true,
        opacity: 0.32,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      systemGroup.add(line);

      // Energy pulse mesh
      const pulseGeom = new THREE.SphereGeometry(0.065, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: skill.color });
      const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
      systemGroup.add(pulseMesh);

      selectableObjects.push(nodeMesh);

      nodes.push({
        name: skill.name,
        group: nodeGroup,
        mesh: nodeMesh,
        outline: nodeOutline,
        sprite: sprite,
        line: line,
        pulse: pulseMesh,
        pulseT: Math.random(), // Start at randomized progress
        radius: skill.radius,
        speed: skill.speed,
        height: skill.height,
        phase: (idx * Math.PI * 2) / skillList.length,
        color: skill.color,
      });
    });

    // Background floating elements (small secondary tech grid)
    const gridHelper = new THREE.GridHelper(8, 8, isDark ? 0x22d3ee : 0x0f172a, isDark ? 0x22d3ee : 0x0f172a);
    gridHelper.position.y = -3.2;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.08;
    systemGroup.add(gridHelper);

    // 5. Interactive Raycaster & Mouse Settings
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let hoveredSkillName: string | null = null;

    // Pointer Drag Rotation Logic
    let isDragging = false;
    let previousPointer = { x: 0, y: 0 };
    const systemRotation = { x: 0.1, y: 0.4 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointer = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);

      if (isDragging) {
        const dx = event.clientX - previousPointer.x;
        const dy = event.clientY - previousPointer.y;
        systemRotation.y += dx * 0.007;
        systemRotation.x += dy * 0.007;
        previousPointer = { x: event.clientX, y: event.clientY };
      }
    };

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    // Attach listeners to container
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    // 6. Draw Screen Function (Canvas updates)
    const drawScreenContent = (hoveredName: string | null, frame: number) => {
      if (!screenCtx) return;

      // Clear Canvas
      screenCtx.fillStyle = isDark ? "#060913" : "#f5f5f0";
      screenCtx.fillRect(0, 0, 256, 512);

      // Radar Grid
      screenCtx.strokeStyle = isDark ? "rgba(34, 211, 238, 0.15)" : "rgba(15, 23, 42, 0.08)";
      screenCtx.lineWidth = 1;
      const spacing = 32;
      for (let x = 0; x < 256; x += spacing) {
        screenCtx.beginPath();
        screenCtx.moveTo(x, 0);
        screenCtx.lineTo(x, 512);
        screenCtx.stroke();
      }
      for (let y = 0; y < 512; y += spacing) {
        screenCtx.beginPath();
        screenCtx.moveTo(0, y);
        screenCtx.lineTo(256, y);
        screenCtx.stroke();
      }

      // Sweep Radar Core
      const cx = 128;
      const cy = 256;
      screenCtx.strokeStyle = hoveredName ? "#f43f5e" : "#22d3ee";
      screenCtx.lineWidth = 3;
      screenCtx.beginPath();
      screenCtx.arc(cx, cy, 64 + Math.sin(frame * 6) * 4, 0, Math.PI * 2);
      screenCtx.stroke();

      // Sweeper arm
      const sweepAngle = frame * 2.2;
      screenCtx.lineWidth = 2;
      screenCtx.beginPath();
      screenCtx.moveTo(cx, cy);
      screenCtx.lineTo(
        cx + Math.cos(sweepAngle) * 64,
        cy + Math.sin(sweepAngle) * 64
      );
      screenCtx.stroke();

      // Sweeper ring ticks
      screenCtx.strokeStyle = isDark ? "rgba(34, 211, 238, 0.3)" : "rgba(15, 23, 42, 0.2)";
      screenCtx.lineWidth = 1;
      screenCtx.beginPath();
      screenCtx.arc(cx, cy, 40, 0, Math.PI * 2);
      screenCtx.stroke();
      screenCtx.beginPath();
      screenCtx.arc(cx, cy, 88, 0, Math.PI * 2);
      screenCtx.stroke();

      // Status text
      screenCtx.fillStyle = isDark ? "#ffffff" : "#0f172a";
      screenCtx.font = "bold 16px sans-serif";
      screenCtx.textAlign = "center";
      screenCtx.fillText("SYSTEM CORE", cx, 64);

      // Pulsing battery power
      const powerPct = 85 + Math.sin(frame * 4) * 8;
      screenCtx.fillStyle = isDark ? "rgba(45, 212, 191, 0.15)" : "rgba(15, 23, 42, 0.08)";
      screenCtx.fillRect(68, 100, 120, 14);
      screenCtx.fillStyle = hoveredName ? "#f43f5e" : "#2dd4bf";
      screenCtx.fillRect(70, 102, (116 * powerPct) / 100, 10);

      // System messages
      if (hoveredName) {
        screenCtx.fillStyle = "#f43f5e";
        screenCtx.font = "bold 18px sans-serif";
        screenCtx.fillText(hoveredName.toUpperCase(), cx, 376);

        screenCtx.fillStyle = isDark ? "#22d3ee" : "#0d9488";
        screenCtx.font = "bold 12px sans-serif";
        screenCtx.fillText("SKILL LINK ESTABLISHED", cx, 404);
        screenCtx.fillStyle = isDark ? "#94a3b8" : "#475569";
        screenCtx.fillText("INPUT VOLTAGE: 2.5x BOOST", cx, 424);
      } else {
        screenCtx.fillStyle = isDark ? "#22d3ee" : "#0d9488";
        screenCtx.font = "bold 16px sans-serif";
        screenCtx.fillText("NETWORKS STANDBY", cx, 376);

        screenCtx.fillStyle = isDark ? "#94a3b8" : "#64748b";
        screenCtx.font = "11px sans-serif";
        screenCtx.fillText("HOVER FLOATING SKILLS", cx, 404);
        screenCtx.fillText("TO INJECT INTEGRATION POWER", cx, 422);
      }

      // Bottom Tech Graphs
      screenCtx.strokeStyle = isDark ? "rgba(34, 211, 238, 0.25)" : "rgba(15, 23, 42, 0.12)";
      screenCtx.lineWidth = 1.5;
      screenCtx.beginPath();
      for (let i = 0; i < 40; i++) {
        const gx = 48 + i * 4;
        const gy = 475 + Math.sin(frame * 6 + i * 0.4) * (hoveredName ? 15 : 6);
        if (i === 0) screenCtx.moveTo(gx, gy);
        else screenCtx.lineTo(gx, gy);
      }
      screenCtx.stroke();

      screenTexture.needsUpdate = true;
    };

    // 7. Animation Loop
    let animationFrameId = 0;
    let frame = 0;

    const animate = () => {
      frame += 0.015;

      // Bobbing floating motion for phone
      if (!reducedMotion) {
        phoneGroup.position.y = Math.sin(frame * 0.9) * 0.12;
        phoneGroup.rotation.y = Math.cos(frame * 0.4) * 0.08;
      }

      // Drag system group rotation
      if (!isDragging && !reducedMotion) {
        systemGroup.rotation.y = systemRotation.y + Math.sin(frame * 0.15) * 0.05;
        systemGroup.rotation.x = systemRotation.x + Math.cos(frame * 0.15) * 0.03;
      } else {
        systemGroup.rotation.y = systemRotation.y;
        systemGroup.rotation.x = systemRotation.x;
      }

      // Raycast hover detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(selectableObjects, true);
      let hitSkillName: string | null = null;

      if (intersects.length > 0) {
        let currentHit: THREE.Object3D | null = intersects[0].object;
        while (currentHit && currentHit !== scene) {
          if (currentHit.userData && currentHit.userData.name) {
            hitSkillName = currentHit.userData.name;
            break;
          }
          currentHit = currentHit.parent;
        }
      }
      hoveredSkillName = hitSkillName;

      // Update Floating Node Positions & Lines
      nodes.forEach((node) => {
        const angle = frame * node.speed + node.phase;
        
        // Circular orbit coordinate math
        node.group.position.x = Math.cos(angle) * node.radius;
        node.group.position.z = Math.sin(angle) * node.radius;
        node.group.position.y = node.height + Math.sin(frame + node.phase) * 0.14;

        // Position Sprite above node
        node.sprite.position.copy(node.mesh.position);
        node.sprite.position.y += 0.32;

        // Update wire connection points
        const posAttr = node.line.geometry.attributes.position as THREE.BufferAttribute;
        // Start node center
        posAttr.setXYZ(0, node.group.position.x, node.group.position.y, node.group.position.z);
        // End phone center
        posAttr.setXYZ(1, phoneGroup.position.x, phoneGroup.position.y, phoneGroup.position.z);
        posAttr.needsUpdate = true;

        // Handle hovered state (visual updates)
        const isHovered = node.name === hoveredSkillName;
        const targetScale = isHovered ? 1.35 : 1.0;
        
        // Scale Group containing sphere and outline
        node.group.scale.setScalar(THREE.MathUtils.lerp(node.group.scale.x, targetScale, 0.15));
        (node.line.material as THREE.LineBasicMaterial).opacity = isHovered ? 0.8 : 0.32;

        // Animate energy pulse along wire
        const speedMultiplier = isHovered ? 2.5 : 1.0;
        node.pulseT = (node.pulseT + 0.004 * speedMultiplier) % 1.0;
        node.pulse.position.lerpVectors(node.group.position, phoneGroup.position, node.pulseT);
      });

      // Update Screen dynamic redraw
      drawScreenContent(hoveredSkillName, frame);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Cleanup & Disposal
    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      renderer.domElement.remove();

      texturesToDispose.forEach((t) => t.dispose());
      sceneDispose(scene);
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      aria-hidden="true"
    />
  );
}

function sceneDispose(scene: THREE.Scene) {
  scene.traverse((object) => {
    if ((object as THREE.Mesh).geometry) {
      (object as THREE.Mesh).geometry.dispose();
    }
    const material = (object as THREE.Mesh).material;
    if (material) {
      if (Array.isArray(material)) {
        material.forEach((mat) => mat.dispose());
      } else {
        material.dispose();
      }
    }
  });
}
