/// <reference types="@react-three/fiber" />
import * as React from 'react';
import '@google/model-viewer';

import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}
import { Suspense, useState, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Html, PerspectiveCamera, useProgress } from '@react-three/drei';
import { ANATOMY_DATA, AnatomyPart } from '../data/anatomyData';
import { Maximize2, Info, Activity, X, Smartphone, Layers, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../lib/utils';
import { useSettings } from '../lib/SettingsContext';

import { useThree, useFrame } from '@react-three/fiber';

function Loader() {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev >= 99) return prev;
        // Semakin tinggi persentase, semakin lambat bertambah (efek fake loading mulus)
        const increment = Math.max(0.5, (99 - prev) * 0.05);
        return prev + increment;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Html center>
      <div className="flex flex-col items-center gap-5 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/5 border-t-primary rounded-full animate-spin shadow-[0_0_40px_rgba(77,161,255,0.3)]" />
          <div className="absolute inset-0 flex items-center justify-center text-primary font-mono text-[10px] font-black">
            {Math.round(displayProgress)}%
          </div>
        </div>
        <div className="text-primary font-mono text-[10px] tracking-[0.4em] font-bold uppercase whitespace-nowrap animate-pulse">
          MEMUAT ASET
        </div>
      </div>
    </Html>
  );
}

function LabelManager({ 
  labelsData, 
  containerRef, 
  svgRef, 
  selectedId, 
  showLabels,
  isMobile
}: {
  labelsData: any[];
  containerRef: React.RefObject<HTMLDivElement>;
  svgRef: React.RefObject<SVGSVGElement>;
  selectedId: string | null;
  showLabels: boolean;
  isMobile: boolean;
}) {
  const { camera, size } = useThree();
  const vec = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!containerRef.current || !svgRef.current) return;
    
    if (!showLabels) {
      containerRef.current.style.opacity = '0';
      svgRef.current.style.opacity = '0';
      return;
    } else {
      containerRef.current.style.opacity = '1';
      svgRef.current.style.opacity = '1';
    }

    const points2D: any[] = [];
    for (let i = 0; i < labelsData.length; i++) {
       const part = labelsData[i];
       vec.current.copy(part.center);
       vec.current.project(camera);
       
       const x = (vec.current.x * 0.5 + 0.5) * size.width;
       const y = -(vec.current.y * 0.5 - 0.5) * size.height;
       
       // Check if behind camera
       if (vec.current.z < 1) {
           points2D.push({ 
               id: part.id, 
               x, 
               y, 
               depth: vec.current.z 
           });
       }
    }

    // Split into left and right
    const centerX = size.width / 2;
    const leftPoints = points2D.filter(p => p.x < centerX).sort((a, b) => a.y - b.y);
    const rightPoints = points2D.filter(p => p.x >= centerX).sort((a, b) => a.y - b.y);

    const resolveOverlap = (points: any[], isLeft: boolean) => {
      const minSpacing = isMobile ? 35 : 40; 
      
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        if (curr.targetY - prev.targetY < minSpacing) {
          curr.targetY = prev.targetY + minSpacing;
        }
      }

      // If they overflowed the bottom, push them back up
      const paddingBottom = 100;
      const paddingTop = 80;
      
      let overflow = 0;
      if (points.length > 0) {
        const last = points[points.length - 1];
        if (last.targetY > size.height - paddingBottom) {
          overflow = last.targetY - (size.height - paddingBottom);
        }
      }

      if (overflow > 0) {
        for (let i = points.length - 1; i >= 0; i--) {
          points[i].targetY -= overflow;
          if (i < points.length - 1) {
            const next = points[i + 1];
            if (next.targetY - points[i].targetY < minSpacing) {
              points[i].targetY = next.targetY - minSpacing;
            }
          }
        }
      }
      
      // Ensure top padding is respected
      if (points.length > 0 && points[0].targetY < paddingTop) {
          const underflow = paddingTop - points[0].targetY;
          for (let i = 0; i < points.length; i++) {
              points[i].targetY += underflow;
              if (i > 0) {
                  const prev = points[i-1];
                  if (points[i].targetY - prev.targetY < minSpacing) {
                      points[i].targetY = prev.targetY + minSpacing;
                  }
              }
          }
      }

      const isMobileScreen = size.width < 768;
      const paddingX = isMobileScreen ? 20 : 60;
      points.forEach(p => {
        p.targetX = isLeft ? paddingX + 50 : size.width - paddingX - 50;
      });
    };

    // Initialize targets
    leftPoints.forEach(p => p.targetY = p.y);
    rightPoints.forEach(p => p.targetY = p.y);

    resolveOverlap(leftPoints, true);
    resolveOverlap(rightPoints, false);

    const allProcessed = [...leftPoints, ...rightPoints];
    
    // SVG lines
    let svgContent = '';
    
    const domNodes = Array.from(containerRef.current.children) as HTMLElement[];
    
    allProcessed.forEach(p => {
      const el = domNodes.find(n => n.dataset.id === p.id);
      if (el) {
        el.style.transform = `translate(${p.targetX}px, ${p.targetY}px) translate(-50%, -50%)`;
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        
        const isSelected = selectedId === p.id;
        
        // Let's make an elegant line
        const isLeft = p.targetX < centerX;
        const elbowDir = isLeft ? 1 : -1;
        const isMobileScreen = size.width < 768;
        
        // Ensure elbow doesn't overshoot
        const naturalElbowX = p.targetX + elbowDir * (isMobileScreen ? 20 : 40);
        const elbowX = isLeft 
           ? Math.min(naturalElbowX, p.x - 10) 
           : Math.max(naturalElbowX, p.x + 10);
        
        const strokeColor = isSelected ? '#4da1ff' : 'rgba(255, 255, 255, 0.2)';
        const strokeWidth = isSelected ? 2 : 1.5;
        
        svgContent += `<polyline points="${p.x},${p.y} ${elbowX},${p.targetY} ${p.targetX},${p.targetY}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" />`;
        // small dot at the bone
        svgContent += `<circle cx="${p.x}" cy="${p.y}" r="2" fill="${strokeColor}" />`;
      }
    });

    // Hide labels that aren't visible
    domNodes.forEach(node => {
      const id = node.dataset.id;
      if (!allProcessed.find(p => p.id === id)) {
        node.style.opacity = '0';
        node.style.visibility = 'hidden';
      } else {
        const p = allProcessed.find(p => p.id === id);
        if (p && selectedId === id) {
            node.classList.add('selected-label');
            node.style.zIndex = '20';
        } else {
            node.classList.remove('selected-label');
            node.style.zIndex = '10';
        }
      }
    });

    svgRef.current.innerHTML = svgContent;
  });

  return null;
}

interface ModelProps {
  url: string;
  onSelect: (part: AnatomyPart | null) => void;
  selectedId: string | null;
  isOrbiting: boolean;
  system: 'skeletal' | 'cardiovascular' | 'nervous' | 'muscular' | 'joints' | 'lymphoid' | 'insertions';
  showLabels: boolean;
  onLabelsData: (data: any[]) => void;
  onSceneReady?: (scene: THREE.Group) => void;
}

function Model({ url, onSelect, selectedId, isOrbiting, system, showLabels, onLabelsData, onSceneReady }: ModelProps) {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState<string | null>(null);
  const lastRaycastTime = useRef(0);
  const RAYCAST_THROTTLE = 50; // ms

  // Clone scene to avoid polluting the cache and handle material isolation
  const displayScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((object) => {
      if ((object as any).isMesh) {
        const mesh = object as any;
        mesh.material = mesh.material.clone();
        // Store original color for restoration
        mesh.userData.originalColor = mesh.material.color.clone();
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    if (onSceneReady && displayScene) {
      onSceneReady(displayScene);
    }
  }, [displayScene, onSceneReady]);

  // Group paths for easier lookup and calculate centers
  const paths = useMemo(() => {
    const meshes: { node: THREE.Mesh, center: THREE.Vector3, volume: number, name: string }[] = [];
    displayScene.updateMatrixWorld(true);
    
    displayScene.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.updateMatrixWorld(true);
        const center = new THREE.Vector3();
        
        const box = new THREE.Box3().setFromObject(mesh);
        box.getCenter(center);
        
        const size = new THREE.Vector3();
        box.getSize(size);
        const volume = size.x * size.y * size.z;

        meshes.push({ node: mesh, center, volume, name: child.name });
      }
    });

    // Sort meshes: 
    // - For 'insertions', we want the SMALLEST meshes (usually the points/highlights)
    // - For others, use original order but filtered
    const sortedMeshes = system === 'insertions' 
      ? [...meshes].sort((a, b) => a.volume - b.volume)
      : meshes;

    const p: Record<string, { node: THREE.Object3D, center: THREE.Vector3, index: number }> = {};
    sortedMeshes.forEach((m, idx) => {
      p[m.name] = { node: m.node, center: m.center, index: idx };
    });

    return p;
  }, [displayScene, system]);

  // Update materials based on selection/hover
  useEffect(() => {
    displayScene.traverse((object) => {
      if ((object as any).isMesh) {
        const mesh = object as any;
        const name = mesh.name;
        
        // Find if this mesh belongs to the selected part
        let isSelected = false;
        if (selectedId) {
          const part = ANATOMY_DATA[selectedId];
          const meshEntry = Object.entries(paths).find(([mName, p]) => {
            if (mName === selectedId) return true;
            if (part && p.index === part.number - 1) return true;
            return false;
          });
          if (meshEntry && meshEntry[0] === name) isSelected = true;
        }
        
        if (isSelected) {
          mesh.material.color.set('#4da1ff');
          mesh.material.emissive = new THREE.Color('#4da1ff').multiplyScalar(0.5);
        } else if (hovered === mesh.name) {
          mesh.material.color.set('#71f8e4');
          mesh.material.emissive = new THREE.Color('#71f8e4').multiplyScalar(0.4);
        } else if (mesh.userData.originalColor) {
          mesh.material.color.copy(mesh.userData.originalColor);
          mesh.material.emissive.set(0, 0, 0);
        }
      }
    });
  }, [displayScene, selectedId, hovered, paths]);

  // Expose centers for parent (hotspots and labels)
  useEffect(() => {
    if (Object.keys(paths).length > 0) {
      // 1. Hotspots for AR
      const filteredParts = Object.values(ANATOMY_DATA)
        .filter(part => (part.system === system) || (!part.system && system === 'skeletal'))
        .slice(0, 20);

      const positions = filteredParts.map(part => {
          let meshData = paths[part.id];
          if (!meshData) {
            meshData = Object.values(paths).find(p => p.index === part.number - 1);
          }
          if (meshData && meshData.center) {
            return {
              id: part.id,
              name: part.name,
              position: `${meshData.center.x.toFixed(3)}m ${meshData.center.y.toFixed(3)}m ${meshData.center.z.toFixed(3)}m`
            };
          }
          return null;
        })
        .filter(Boolean);
      
      if ((window as any).setLabelPositions) {
        (window as any).setLabelPositions(positions);
      }

      // 2. Labels Data for standard 2D overlay
      const allParts = Object.values(ANATOMY_DATA)
        .filter(part => (part.system === system) || (!part.system && system === 'skeletal'))
        .map(part => {
          let meshData = paths[part.id];
          if (!meshData) meshData = Object.values(paths).find(p => p.index === part.number - 1);
          if (!meshData) return null;
          
          const worldCenter = meshData.center.clone();
          worldCenter.multiplyScalar(1.6);
          worldCenter.y -= 1.8;
          
          return { ...part, center: worldCenter };
        })
        .filter(Boolean);

      onLabelsData(allParts);
    }
  }, [paths, system, onLabelsData]);

  return (
    <group>
        <primitive 
          object={displayScene} 
          scale={1.6}
          position={[0, -1.8, 0]}
          onPointerOver={(e: any) => {
            if (isOrbiting) return;
            const now = performance.now();
            if (now - lastRaycastTime.current < RAYCAST_THROTTLE) return;
            lastRaycastTime.current = now;

            e.stopPropagation();
            setHovered((e.object as any).name);
          }}
          onPointerOut={() => setHovered(null)}
          onPointerDown={(e: any) => {
            e.stopPropagation();
            const mesh = e.object as any;
            const name = mesh.name;
            const pathInfo = paths[name];

            let dataKey = Object.keys(ANATOMY_DATA).find(dk => {
              const part = ANATOMY_DATA[dk];
              const isCorrectSystem = (part.system === system) || (!part.system && (system as any) === 'skeletal');
              if (!isCorrectSystem) return false;
              return name.toLowerCase() === dk.toLowerCase() || name.includes(dk);
            });

            if (!dataKey && pathInfo) {
              dataKey = Object.keys(ANATOMY_DATA).find(dk => {
                const part = ANATOMY_DATA[dk];
                const isCorrectSystem = (part.system === system) || (!part.system && (system as any) === 'skeletal');
                return isCorrectSystem && part.number === pathInfo.index + 1;
              });
            }

            if (dataKey) {
              onSelect(ANATOMY_DATA[dataKey]);
            }
          }}
        />
    </group>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("AnatomyViewer Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black p-8 text-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-white font-bold">Neural Link Failed</h2>
          <p className="text-white/40 text-xs">Gagal menginisialisasi modul 3D. Silakan segarkan halaman.</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-black rounded-lg text-xs font-bold uppercase tracking-widest">Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AR_MODEL_URLS: Record<string, string> = {
  skeletal: "https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/skeletal_system_with_labels.glb",
  cardiovascular: "https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/cardiovascular_system_with_labels.glb",
  nervous: "https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/nervous_system_with_labels.glb",
  muscular: "https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/muscular_system_with_labels.glb",
  joints: "https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/arthrology_joints_with_labels.glb",
  lymphoid: "https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/lymphoid_system_with_labels.glb",
  insertions: "https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/muscular_insertions_with_labels.glb",
};

export function AnatomyViewer({ 
  modelUrl, 
  title, 
  system,
  onSelect, 
  selectedId 
}: { 
  modelUrl: string, 
  title: string,
  system: 'skeletal' | 'cardiovascular' | 'nervous' | 'muscular' | 'joints' | 'lymphoid' | 'insertions',
  onSelect: (part: AnatomyPart | null) => void, 
  selectedId: string | null 
}) {
  const [arModalOpen, setArModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [arLabelsEnabled, setArLabelsEnabled] = useState(true);
  const [useBakedLabels, setUseBakedLabels] = useState(false);
  const [hotspotPositions, setHotspotPositions] = useState<any[]>([]);
  const { showBakeButton } = useSettings();
  const [labelsData, setLabelsData] = useState<any[]>([]);
  const labelsContainerRef = useRef<HTMLDivElement>(null);
  const svgLinesRef = useRef<SVGSVGElement>(null);
  
  const [sceneGroup, setSceneGroup] = useState<THREE.Group | null>(null);
  const [isBaking, setIsBaking] = useState(false);

  const generateAndDownloadGLB = async () => {
    if (!sceneGroup) return;
    setIsBaking(true);
    try {
      const THREE = await import('three');
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
      const BufferGeometryUtils = await import('three/examples/jsm/utils/BufferGeometryUtils.js');
      
      const worldGroup = new THREE.Scene();
      
      // OPTIMIZE DRAW CALLS: Map to store geometries by material UUID
      const materialMap = new Map<string, { material: THREE.Material, geometries: THREE.BufferGeometry[] }>();

      sceneGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material;
          // Extract world transform
          const geom = child.geometry.clone();
          geom.applyMatrix4(child.matrixWorld);

          // Delete extra attributes to ensure mergeGeometries works
          const attributesToKeep = ['position', 'normal', 'uv', 'color'];
          for (const attrName in geom.attributes) {
            if (!attributesToKeep.includes(attrName)) {
              geom.deleteAttribute(attrName);
            }
          }
          if (geom.attributes.uv && geom.attributes.uv.itemSize !== 2) {
             geom.deleteAttribute('uv');
          }
          if (!geom.attributes.normal) {
             geom.computeVertexNormals();
          }

          let key = '';
          if (Array.isArray(mat)) {
            key = mat.map(m => m.uuid).join('-');
          } else {
            key = mat.uuid;
          }

          if (!materialMap.has(key)) {
            materialMap.set(key, { material: mat, geometries: [] });
          }
          materialMap.get(key)!.geometries.push(geom);
        }
      });

      const optimizedGroup = new THREE.Group();
      materialMap.forEach((entry, key) => {
        if (entry.geometries.length > 0) {
          try {
            const mergedGeometry = BufferGeometryUtils.mergeGeometries(entry.geometries, false);
            if (mergedGeometry) {
              const mergedMesh = new THREE.Mesh(mergedGeometry, entry.material);
              optimizedGroup.add(mergedMesh);
            }
          } catch (err) {
            console.warn("Failed to merge some geometries", err);
            // Fallback
            entry.geometries.forEach(g => {
              optimizedGroup.add(new THREE.Mesh(g, entry.material));
            });
          }
        }
      });

      worldGroup.add(optimizedGroup);
      
      // Process labels to prevent overlap by spreading them vertically
      const rightLabels = labelsData.filter(l => l.center.x >= 0);
      const leftLabels = labelsData.filter(l => l.center.x < 0);

      const assignTargets = (labels: any[], side: number) => {
        labels.sort((a, b) => b.center.y - a.center.y);
        const SPACING = 0.18;
        if (labels.length === 0) return;
        
        const avgY = labels.reduce((sum, l) => sum + l.center.y, 0) / labels.length;
        const totalHeight = (labels.length - 1) * SPACING;
        let startY = avgY + totalHeight / 2;
        
        labels.forEach((label) => {
          label.targetY = startY;
          label.targetX = side * 0.7; // Push left or right
          label.targetZ = label.center.z + 0.2;
          startY -= SPACING;
        });
      };

      assignTargets(rightLabels, 1);
      assignTargets(leftLabels, -1);

      // Add planes and lines for labels
      labelsData.forEach(label => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(0, 0, 512, 128, 20);
            ctx.fill();
          } else {
            ctx.fillRect(0, 0, 512, 128);
          }

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 6;
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(0, 0, 512, 128, 20);
            ctx.stroke();
          } else {
            ctx.strokeRect(0, 0, 512, 128);
          }

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 44px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label.name.toUpperCase(), 256, 64);

          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;

          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
          });

          const planeWidth = 0.5; 
          const planeHeight = planeWidth / 4; 
          const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
          const mesh = new THREE.Mesh(geometry, material);

          mesh.scale.set(0.4, 0.4, 0.4);
          
          const pStart = label.center.clone();
          const pEnd = new THREE.Vector3(label.targetX, label.targetY, label.targetZ);
          
          // Place label slightly offset from the end of the line
          const isRight = label.targetX > 0;
          mesh.position.copy(pEnd);
          mesh.position.x += isRight ? 0.12 : -0.12;

          // Dot on the mesh
          const dotGeom = new THREE.SphereGeometry(0.015, 16, 16);
          const dotMat = new THREE.MeshBasicMaterial({ color: 0x4da1ff });
          const dot = new THREE.Mesh(dotGeom, dotMat);
          dot.position.copy(pStart);

          // Line (cylinder)
          const distance = pStart.distanceTo(pEnd);
          const cylinderGeom = new THREE.CylinderGeometry(0.002, 0.002, distance, 8);
          const cylinderMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
          const cylinder = new THREE.Mesh(cylinderGeom, cylinderMat);
          
          const midPoint = pStart.clone().lerp(pEnd, 0.5);
          cylinder.position.copy(midPoint);
          cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pEnd.clone().sub(pStart).normalize());
          
          worldGroup.add(mesh);
          worldGroup.add(dot);
          worldGroup.add(cylinder);
        }
      });

      const exporter = new GLTFExporter();
      exporter.parse(
        worldGroup,
        (gltf) => {
          if (gltf instanceof ArrayBuffer) {
            const blob = new Blob([gltf], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_with_labels.glb`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
          setIsBaking(false);
        },
        (err) => {
          console.error("Export Error:", err);
          setIsBaking(false);
        },
        { binary: true }
      );
    } catch (e) {
      console.error(e);
      setIsBaking(false);
    }
  };

  useEffect(() => {
    (window as any).setLabelPositions = (positions: any[]) => {
      setHotspotPositions(positions);
    };
    return () => { delete (window as any).setLabelPositions; };
  }, []);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroidDevice = /Android/.test(ua);
    setIsMobile(isIOSDevice || isAndroidDevice);
    setIsAndroid(isAndroidDevice);
    setIsIOS(isIOSDevice);
  }, []);

  const handleArConnect = () => {
    setArModalOpen(true);
  };

  return (
    <ErrorBoundary>
      <div id="anatomy-viewer-root" className="w-full h-full min-h-[400px] bg-[#050505] relative group rounded-3xl overflow-hidden touch-none flex flex-col">
        <Canvas 
          shadows
          dpr={[1, 1.5]} 
          performance={{ min: 0.5 }}
          camera={{ position: [0, 0, 5], fov: 40 }} 
          gl={{ 
            antialias: true,
            powerPreference: "default",
            alpha: false,
            stencil: false,
            depth: true
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFShadowMap;
          }}
        >
          <color attach="background" args={['#080808']} />
          <ambientLight intensity={1.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow intensity={3} />
          <pointLight position={[-10, 5, -10]} intensity={1.5} />
          <PerspectiveCamera makeDefault position={[0, 0.5, isMobile ? 10 : 7]} fov={30} />
          
          <Suspense fallback={<Loader />}>
            <Model 
              url={modelUrl} 
              onSelect={onSelect}
              selectedId={selectedId}
              isOrbiting={isOrbiting}
              system={system}
              showLabels={showLabels}
              onLabelsData={setLabelsData}
              onSceneReady={setSceneGroup}
            />
            <LabelManager 
              labelsData={labelsData}
              containerRef={labelsContainerRef}
              svgRef={svgLinesRef}
              selectedId={selectedId}
              showLabels={showLabels}
              isMobile={isMobile}
            />
          </Suspense>

          <Environment preset="city" />
          <OrbitControls 
            makeDefault 
            enableDamping
            dampingFactor={0.1}
            minDistance={0.01}
            maxDistance={isMobile ? 25 : 15}
            enablePan={false}
            onStart={() => setIsOrbiting(true)}
            onEnd={() => setIsOrbiting(false)}
          />
        </Canvas>
        
        {/* Responsive Overlay Labels */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <svg ref={svgLinesRef} className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300" />
          <div ref={labelsContainerRef} className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300">
            {labelsData.map(part => (
               <div 
                 key={part.id} 
                 data-id={part.id}
                 className="absolute top-0 left-0 pointer-events-auto cursor-pointer transition-all duration-300 drop-shadow-2xl"
                 onClick={() => onSelect(selectedId === part.id ? null : part)}
               >
                 <div className={cn(
                   "px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap backdrop-blur-md",
                   selectedId === part.id 
                     ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(77,161,255,0.5)] scale-110"
                     : "bg-black/70 text-white border-white/20 hover:bg-white/10 hover:border-white/50 hover:scale-105"
                 )}>
                   {part.name}
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* UI Overlays */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 pointer-events-none z-20 flex flex-col gap-4 max-w-[calc(100%-2rem)]">
          <div className="bg-black/80 backdrop-blur-2xl border border-white/10 px-4 py-2 sm:py-3 rounded-2xl shadow-3xl">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_15px_#71f8e4] animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-[0.3em]">{title} Atlas Struktural</span>
            </div>
            <p className="text-[7px] sm:text-[8px] text-white/30 uppercase tracking-[0.2em] hidden xs:block">Version 4.0.2 Stable</p>
          </div>
        </div>

        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex flex-col gap-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 p-2.5 sm:p-3 rounded-xl text-white/60 hover:text-primary hover:border-primary/40 active:scale-95 transition-all shadow-2xl flex items-center gap-2 group"
            title={showLabels ? "Hide Labels" : "Show Labels"}
          >
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">
              {showLabels ? "Sembunyikan Label" : "Tampilkan Label"}
            </span>
          </button>
        </div>

        <div className="absolute bottom-16 sm:bottom-6 left-6 pointer-events-none z-20 flex gap-2">
          {showBakeButton && (
            <button 
              onClick={generateAndDownloadGLB}
              disabled={isBaking}
              className="pointer-events-auto bg-[#4e3dd8] text-white px-4 py-3 rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-blue-500 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isBaking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline">DEVS: BAKE & DL</span>
              <span className="xs:hidden">BAKE</span>
            </button>
          )}

          <button 
            onClick={handleArConnect}
            className="pointer-events-auto bg-white/95 backdrop-blur-md text-black px-4 sm:px-8 py-3 rounded-xl font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20 whitespace-nowrap"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">AR Mode</span>
            <span className="xs:hidden">AR</span>
          </button>
        </div>

        {arModalOpen && (
          <div className="absolute inset-0 z-[100] bg-black animate-in fade-in duration-300">
            {isMobile ? (
                <div className="w-full h-full relative">
                  <div className="absolute top-6 left-6 right-6 z-[110] flex justify-between items-start pointer-events-none gap-2 flex-wrap">
                    <button 
                      onClick={() => setArModalOpen(false)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-xl transition-all pointer-events-auto"
                    >
                      Return
                    </button>
                    <div className="flex gap-2 pointer-events-auto">
                      <button 
                        onClick={() => setArLabelsEnabled(!arLabelsEnabled)}
                        className={`${arLabelsEnabled ? 'bg-primary/20 hover:bg-primary/30 text-primary border-primary/40' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'} px-4 py-2 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border backdrop-blur-xl transition-all flex items-center gap-2`}
                      >
                        {arLabelsEnabled ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> : <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />}
                        {arLabelsEnabled ? "Label Aktif" : "Label Mati"}
                      </button>
                    </div>
                  </div>
                  {/* @ts-ignore */}
                  <model-viewer
                    src={AR_MODEL_URLS[system] || modelUrl}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    style={{ width: '100%', height: '100%', backgroundColor: '#050505' }}
                  >
                    {arLabelsEnabled && hotspotPositions.map((hp) => (
                      <button
                        key={hp.id}
                        slot={`hotspot-${hp.id}`}
                        data-position={hp.position}
                        data-normal="0 1 0"
                        className="relative group pointer-events-none"
                        style={{ border: 'none', background: 'transparent' }}
                      >
                        {/* The dot on the model */}
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(77,161,255,0.8)]" />
                        
                        {/* Connecting line */}
                        <div className="absolute top-1 left-1 w-8 h-px bg-primary/50 -rotate-45 origin-top-left" />
                        
                        {/* Label Box */}
                        <div className="absolute top-[-20px] left-[20px] bg-black/70 text-white border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl">
                          {hp.name}
                        </div>
                      </button>
                    ))}
                    <button slot="ar-button" className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      Masuk ke Ruang AR
                    </button>
                    {/* @ts-ignore */}
                  </model-viewer>
               </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-12">
                 <div className="space-y-4">
                   <div className="flex items-center justify-center gap-3 text-primary">
                     <Smartphone className="w-6 h-6" />
                     <h2 className="text-xl font-black uppercase tracking-[0.4em]">Mobile Sync Required</h2>
                   </div>
                   <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                     Spatial mapping requires a device with native AR capabilities (LiDAR or ARCore). Scan to continue your diagnosis.
                   </p>
                 </div>

                 <div className="p-8 bg-white rounded-3xl shadow-[0_0_60px_rgba(255,255,255,0.1)] relative group">
                    <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl animate-pulse" />
                    <QRCodeSVG 
                      value={window.location.href} 
                      size={200}
                      level="H"
                      includeMargin={false}
                      className="relative z-10"
                    />
                 </div>

                 <div className="space-y-6">
                   <div className="flex flex-col items-center gap-3">
                     <div className="w-px h-12 bg-gradient-to-b from-primary/40 to-transparent" />
                     <span className="text-[8px] font-medium text-white/30 uppercase tracking-[0.5em]">Scan QR with camera</span>
                   </div>
                   
                   <button 
                     onClick={() => setArModalOpen(false)}
                     className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-white transition-colors"
                   >
                     <X className="w-3 h-3" />
                     Discard Sync
                   </button>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
