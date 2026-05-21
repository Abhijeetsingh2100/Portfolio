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
    copy(v: Vector3): this;
    lerpVectors(a: Vector3, b: Vector3, alpha: number): this;
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
    userData: Record<string, any>;
    parent: Object3D | null;
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

  export class Camera extends Object3D {}

  export class PerspectiveCamera extends Camera {
    constructor(fov: number, aspect: number, near: number, far: number);
    aspect: number;
    updateProjectionMatrix(): void;
    lookAt(x: number, y: number, z: number): void;
  }

  export class Material {
    dispose(): void;
    transparent: boolean;
    opacity: number;
  }

  export class MeshStandardMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }

  export class MeshToonMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }

  export class PointsMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }

  export class SpriteMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
    map: Texture;
  }

  export class LineBasicMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
    color: Color;
  }

  export class BufferGeometry {
    setAttribute(name: string, attribute: BufferAttribute): this;
    dispose(): void;
    attributes: {
      [name: string]: BufferAttribute;
    };
  }

  export class BufferAttribute {
    constructor(array: ArrayBufferView, itemSize: number);
    setXYZ(index: number, x: number, y: number, z: number): this;
    needsUpdate: boolean;
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

  export class BoxGeometry extends BufferGeometry {
    constructor(
      width?: number,
      height?: number,
      depth?: number,
      widthSegments?: number,
      heightSegments?: number,
      depthSegments?: number,
    );
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

  export class Sprite extends Object3D {
    constructor(material?: SpriteMaterial);
    material: SpriteMaterial;
  }

  export class Line extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material);
    geometry: BufferGeometry;
    material: Material;
  }

  export class GridHelper extends Object3D {
    constructor(size?: number, divisions?: number, color1?: number | string, color2?: number | string);
    material: Material;
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

  export class Texture {
    dispose(): void;
  }

  export class CanvasTexture extends Texture {
    constructor(canvas: HTMLCanvasElement);
    needsUpdate: boolean;
  }

  export class Raycaster {
    constructor();
    setFromCamera(coords: Vector2, camera: Camera): void;
    intersectObjects(objects: Object3D[], recursive?: boolean): Intersection[];
  }

  export interface Intersection {
    object: Object3D;
    point: Vector3;
    distance: number;
    [key: string]: any;
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
  export const BackSide: number;

  export namespace MathUtils {
    export function lerp(x: number, y: number, t: number): number;
  }
}
