declare module "three" {
  export class Vector2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    set(x: number, y: number): this;
  }

  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    setScalar(scalar: number): this;
  }

  export class Euler {
    x: number;
    y: number;
    z: number;
  }

  export class Object3D {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
    add(...objects: Object3D[]): this;
    traverse(callback: (object: Object3D) => void): void;
  }

  export class Scene extends Object3D {
    background: Color | null;
    fog: Fog | null;
  }

  export class Color {
    constructor(color: number | string);
  }

  export class Fog {
    constructor(color: number | string, near: number, far: number);
  }

  export class PerspectiveCamera extends Object3D {
    constructor(fov: number, aspect: number, near: number, far: number);
    aspect: number;
    updateProjectionMatrix(): void;
    lookAt(x: number, y: number, z: number): void;
  }

  export class Material {
    dispose(): void;
  }

  export class MeshStandardMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }

  export class PointsMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }

  export class BufferGeometry {
    setAttribute(name: string, attribute: BufferAttribute): this;
    dispose(): void;
  }

  export class BufferAttribute {
    constructor(array: ArrayBufferView, itemSize: number);
  }

  export class SphereGeometry extends BufferGeometry {
    constructor(radius?: number, widthSegments?: number, heightSegments?: number);
  }

  export class TorusGeometry extends BufferGeometry {
    constructor(
      radius?: number,
      tube?: number,
      radialSegments?: number,
      tubularSegments?: number,
    );
  }

  export class TorusKnotGeometry extends BufferGeometry {
    constructor(
      radius?: number,
      tube?: number,
      tubularSegments?: number,
      radialSegments?: number,
    );
  }

  export class DodecahedronGeometry extends BufferGeometry {
    constructor(radius?: number, detail?: number);
  }

  export class IcosahedronGeometry extends BufferGeometry {
    constructor(radius?: number, detail?: number);
  }

  export class PlaneGeometry extends BufferGeometry {
    constructor(width?: number, height?: number, widthSegments?: number, heightSegments?: number);
  }

  export class Mesh extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material | Material[]);
    geometry: BufferGeometry;
    material: Material | Material[];
  }

  export class Group extends Object3D {}

  export class Points extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material);
  }

  export class AmbientLight extends Object3D {
    constructor(color?: number | string, intensity?: number);
  }

  export class DirectionalLight extends Object3D {
    constructor(color?: number | string, intensity?: number);
  }

  export class PointLight extends Object3D {
    constructor(
      color?: number | string,
      intensity?: number,
      distance?: number,
    );
  }

  export class SpotLight extends Object3D {
    constructor(
      color?: number | string,
      intensity?: number,
      distance?: number,
      angle?: number,
      penumbra?: number,
      decay?: number,
    );
  }

  export class WebGLRenderer {
    constructor(parameters?: {
      antialias?: boolean;
      alpha?: boolean;
      powerPreference?: "high-performance" | "low-power" | "default";
    });
    domElement: HTMLCanvasElement;
    outputColorSpace: string;
    setPixelRatio(value: number): void;
    setSize(width: number, height: number): void;
    setClearColor(color: number, alpha: number): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
    dispose(): void;
  }

  export const SRGBColorSpace: string;
}
