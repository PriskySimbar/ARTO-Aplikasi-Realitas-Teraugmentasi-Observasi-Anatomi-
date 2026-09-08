import { Module } from './types';

export const INITIAL_MODULES: Module[] = [
  {
    id: 'skeletal',
    name: 'Skeletal System',
    description: 'Detailed analysis of axial and appendicular skeleton, bone structures and articulations.',
    modelUrl: 'https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/Skeleton.glb',
    category: 'Structural',
    difficulty: 'Standard'
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    description: 'Heart anatomy, valvular mechanics, and major vascular networks.',
    modelUrl: 'https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/cardiovascular_system.glb',
    category: 'Visceral',
    difficulty: 'Clinical'
  },
  {
    id: 'nervous',
    name: 'Nervous System',
    description: 'Central and peripheral nervous system, brain structures and neural pathways.',
    modelUrl: 'https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/neurology.glb',
    category: 'Regulation',
    difficulty: 'Surgical'
  },
  {
    id: 'muscular',
    name: 'Muscular System',
    description: 'Complete muscular groups, insertions, and biomechanical focus.',
    modelUrl: 'https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/muscular%20systems.glb',
    category: 'Structural',
    difficulty: 'Clinical'
  },
  {
    id: 'joints',
    name: 'Arthrology (Joints)',
    description: 'Ligaments, synovial membranes, and joint capsule mechanics.',
    modelUrl: 'https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/Joints.glb',
    category: 'Structural',
    difficulty: 'Advanced'
  },
  {
    id: 'lymphoid',
    name: 'Lymphoid System',
    description: 'Lymph nodes, spleen, and immunological drainage pathways.',
    modelUrl: 'https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/lymphoid_organs.glb',
    category: 'Visceral',
    difficulty: 'Medical'
  },
  {
    id: 'insertions',
    name: 'Muscular Insertions',
    description: 'Specific mapping of muscle-to-bone attachment points.',
    modelUrl: 'https://huggingface.co/datasets/prsky/AnatomyFullDataset/resolve/main/muscular_insertion.glb',
    category: 'Structural',
    difficulty: 'Surgical'
  }
];
