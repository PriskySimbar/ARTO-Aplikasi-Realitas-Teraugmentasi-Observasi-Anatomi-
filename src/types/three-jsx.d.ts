import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      'model-viewer': any;
      'group': any;
      'primitive': any;
      'ambientLight': any;
      'pointLight': any;
      'spotLight': any;
      'color': any;
      'mesh': any;
    }
  }
}

export {};
