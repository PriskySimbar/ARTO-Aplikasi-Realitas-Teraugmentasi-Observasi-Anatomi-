import { AnatomyPart, ANATOMY_DATA } from './anatomyData';

export interface DiagnosticQuestion {
  id: string;
  image: string;
  imageType: 'MRI' | 'CT';
  question: string;
  options: string[];
  correctAnswer: number;
  relatedPartId: string;
  diagnosisExplanation: string;
}

export const DIAGNOSTIC_QUIZ_DATA: DiagnosticQuestion[] = [
  {
    id: 'q1',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000', // MRI Brain
    imageType: 'MRI',
    question: 'The axial T2-weighted MRI scan shows a hyperintense lesion in the anterior cranial fossa. Which bone structure forms the floor of this compartment?',
    options: ['Frontal Bone', 'Sphenoid Bone', 'Occipital Bone', 'Ethmoid Bone'],
    correctAnswer: 3,
    relatedPartId: 'Ethmoid_bone',
    diagnosisExplanation: 'The ethmoid bone, specifically the cribriform plate, forms the roof of the nasal cavity and the floor of the anterior cranial fossa. Lesions here can compromise the olfactory nerves (CN I).'
  },
  {
    id: 'q2',
    image: 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=1000', // Bone scan / X-ray like
    imageType: 'CT',
    question: 'A CT scan of the lower limb reveals a spiral fracture of the primary weight-bearing bone. Which bone is affected?',
    options: ['Fibula', 'Femur', 'Tibia', 'Patella'],
    correctAnswer: 2,
    relatedPartId: 'Tibia',
    diagnosisExplanation: 'The tibia is the primary weight-bearing bone of the leg. Spiral fractures often result from rotational torsion forces, frequently seen in sports injuries.'
  },
  {
    id: 'q3',
    image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=1000', // Hip MRI
    imageType: 'MRI',
    question: 'Coronal MRI of the pelvis shows avascular necrosis in the largest bone of the human body. Identify the bone.',
    options: ['Ilium', 'Femur', 'Sacrum', 'Ischium'],
    correctAnswer: 1,
    relatedPartId: 'Femur',
    diagnosisExplanation: 'Avascular necrosis (AVN) frequently affects the femoral head due to its retrograde blood supply, leading to joint collapse if untreated.'
  }
];
