// A shim to keep my sanity while using the Threeasy wrapper.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export interface SHIMThreeasySettings {
  light?: boolean;
  alpha?: boolean;
  interactions?: boolean;
  domElement?: HTMLElement;
  preload?: {
    models?: { [key: string]: string };
    textures?: { [key: string]: string };
  };
  GLTFLoader?: typeof GLTFLoader;
  OBJLoader?: typeof OBJLoader;
}

// @TODO - daniel - this may be expanded
export interface SHIMThreeasy {
  settings: SHIMThreeasySettings;
  THREE: typeof THREE;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  animator: any;
}
