export interface AnatomyPart {
  id: string;
  name: string;
  medicalExplanation: string;
  number: number;
  position?: [number, number, number];
  system?: 'skeletal' | 'cardiovascular' | 'nervous' | 'muscular' | 'joints' | 'lymphoid' | 'insertions';
}

export const ANATOMY_DATA: Record<string, AnatomyPart> = {
  "Femur": {
    id: "Femur",
    name: "Femur (Thigh Bone)",
    number: 1,
    position: [0.092, 0.657, -0.019],
    system: 'skeletal',
    medicalExplanation: "Tulang terpanjang dan terkuat di tubuh manusia. Signifikan secara klinis karena perannya dalam menahan beban tubuh dan lokomosi. Fraktur proksimal (patah tulang panggul) sangat kritis pada kedokteran geriatri, seringkali memerlukan intervensi bedah (ORIF). Leher femur adalah lokasi umum bagi fraktur osteoporotik karena profil pembebanan strukturalnya."
  },
  "Tibia": {
    id: "Tibia",
    name: "Tibia (Shin Bone)",
    number: 2,
    position: [0.075, 0.303, -0.034],
    system: 'skeletal',
    medicalExplanation: "Tulang penahan beban utama pada tungkai bawah. Dataran tinggi tibia (tibial plateau) merupakan permukaan artikular kritis bagi sendi lutut; fraktur pada area ini dapat menyebabkan penyakit sendi degeneratif dini. Lokasinya yang subkutan membuatnya rentan terhadap fraktur terbuka (komposit)."
  },
  "Fibula": {
    id: "Fibula",
    name: "Fibula",
    number: 3,
    position: [0.106, 0.256, -0.047],
    system: 'skeletal',
    medicalExplanation: "Tulang ramping yang memberikan stabilitas lateral pada sendi pergelangan kaki melalui maleolus lateral. Meskipun bukan penahan beban utama, ia berfungsi sebagai lokasi penting untuk perlekatan otot. Dalam bedah rekonstruksi ortopedi, bagian tengahnya dapat diambil sebagai cangkok tulang tervaskularisasi untuk rekonstruksi mandibula atau tulang panjang."
  },
  "Patella": {
    id: "Patella",
    name: "Patella (Knee Cap)",
    number: 4,
    position: [0.086, 0.443, 0.007],
    system: 'skeletal',
    medicalExplanation: "Tulang sesamoid terbesar di tubuh, tertanam di dalam tendon kuadrisep. Berfungsi seperti katrol, meningkatkan keuntungan mekanis (daya ungkit) kelompok otot kuadrisep selama ekstensi lutut. Gangguan pelacakan patelar adalah sumber umum nyeri lutut anterior dalam praktik klinis."
  },
  "Humerus": {
    id: "Humerus",
    name: "Humerus",
    number: 5,
    position: [0.197, 1.248, -0.031],
    system: 'skeletal',
    medicalExplanation: "Tulang lengan atas. Secara klinis, leher bedah (surgical neck) adalah lokasi umum fraktur yang berisiko mencederai saraf aksila. Alur radial (spiral groove) menampung saraf radial; fraktur di tengah batang tulang seringkali muncul dengan gejala 'wrist drop' akibat neuropraksia saraf radial."
  },
  "Radius": {
    id: "Radius",
    name: "Radius",
    number: 6,
    position: [0.257, 0.965, -0.006],
    system: 'skeletal',
    medicalExplanation: "Tulang lateral pada lengan bawah (sisi ibu jari). Berputar di sekitar ulna untuk memungkinkan gerakan pronasi dan supinasi. Fraktur radius distal (fraktur Colles) adalah salah satu cedera ortopedi paling umum, biasanya akibat jatuh dengan tangan terentang (FOOSH), sering menunjukkan deformitas 'garpu makan'."
  },
  "Ulna": {
    id: "Ulna",
    name: "Ulna",
    number: 7,
    position: [0.226, 1.02, -0.024],
    system: 'skeletal',
    medicalExplanation: "Tulang medial pada lengan bawah. Ujung proksimalnya membentuk olekranon (tonjolan tulang siku). Berfungsi sebagai tulang penstabil lengan bawah. Fraktur ulna proksimal dengan dislokasi kepala radial yang terkait dikenal sebagai fraktur Monteggia, sebuah keadaan darurat ortopedi yang kritis."
  },
  "Scapula": {
    id: "Scapula",
    name: "Scapula (Shoulder Blade)",
    number: 8,
    position: [0.121, 1.369, -0.061],
    system: 'skeletal',
    medicalExplanation: "Tulang pipih berbentuk segitiga besar yang membentuk bagian posterior gelang bahu. Berfungsi sebagai tempat perlekatan bagi 17 otot yang berbeda. Gejala 'scapula winging' adalah tanda diagnostik cedera saraf toraks panjang, yang melumpuhkan otot serratus anterior."
  },
  "Clavicle": {
    id: "Clavicle",
    name: "Clavicle (Collarbone)",
    number: 9,
    position: [0.083, 1.41, 0.001],
    system: 'skeletal',
    medicalExplanation: "Meneruskan gaya dari anggota gerak atas ke kerangka aksial. Merupakan tulang yang paling sering mengalami fraktur di tubuh, terutama pada anak-anak dan atlet. Sepertiga tengah adalah lokasi fraktur paling umum. Trauma signifikan di sini dapat berisiko merusak pleksus brakialis atau pembuluh darah subklavia di bawahnya."
  },
  "Frontal_bone": {
    id: "Frontal_bone",
    name: "Frontal Bone",
    number: 10,
    position: [0, 1.634, 0.05],
    system: 'skeletal',
    medicalExplanation: "Membentuk bagian anterior kalvaria dan atap rongga mata (orbit). Tulang ini menampung sinus frontal. Secara klinis, fraktur frontal yang tertekan membawa risiko tinggi robekan dura dan infeksi intrakranial (meningitis) karena kedekatannya dengan otak dan sinus paranasal."
  },
  "Mandible": {
    id: "Mandible",
    name: "Mandible (Jawbone)",
    number: 11,
    position: [0, 1.538, 0.044],
    system: 'skeletal',
    medicalExplanation: "Satu-satunya tulang yang dapat bergerak pada kerangka wajah. Berartikulasi dengan tulang temporal pada sendi TMJ (Temporomandibular Joint). Fraktur sering terjadi berpasangan (misalnya, pada simpisis dan sudut kontralateral) karena struktur bentuk cincinnya (aturan 'pretzel')."
  },
  "Maxilla": {
    id: "Maxilla",
    name: "Maxilla (Upper Jaw)",
    number: 12,
    position: [0.018, 1.56, 0.065],
    system: 'skeletal',
    medicalExplanation: "Membentuk rahang atas, bagian dari langit-langit mulut, dan dasar rongga mata. Fraktur wajah tengah yang melibatkan maksila diklasifikasikan melalui sistem Le Fort (I, II, III), yang menentukan tingkat disosiasi kraniofasial dan prioritas bedah."
  },
  "Sphenoid_bone": {
    id: "Sphenoid_bone",
    name: "Sphenoid Bone",
    number: 13,
    position: [0, 1.589, 0.027],
    system: 'skeletal',
    medicalExplanation: "Merupakan 'batu kunci' (keystone) dari dasar kranium. Menampung sella turcica, yang menjadi tempat bagi kelenjar pituitari. Bedah transsfenoidal adalah pendekatan bedah saraf standar untuk reseksi adenoma pituitari, memanfaatkan sinus sfenoid sebagai jalur akses."
  },
  "Temporal_bone": {
    id: "Temporal_bone",
    name: "Temporal Bone",
    number: 14,
    position: [0.048, 1.583, -0.006],
    system: 'skeletal',
    medicalExplanation: "Menampung struktur telinga dalam dan tengah. Termasuk prosesus mastoid dan bagian petrosa. Fraktur tulang temporal petrosa dikaitkan dengan tanda Battle (ekimosis postaurikular) dan potensi kelumpuhan saraf wajah (Nervus Cranialis VII)."
  },
  "Hip_bone": {
    id: "Hip_bone",
    name: "Hip Bone (Innominate Bone)",
    number: 15,
    position: [0.066, 0.898, -0.012],
    system: 'skeletal',
    medicalExplanation: "Terdiri dari ilium, iskium, dan pubis yang menyatu di asetabulum (soket panggul). Integritas cincin panggul sangat vital; fraktur panggul berenergi tinggi (fraktur 'open book') dapat menyebabkan perdarahan retroperitoneal masif dari sistem arteri iliaka interna."
  },
  "Sacrum": {
    id: "Sacrum",
    name: "Sacrum",
    number: 16,
    position: [0, 0.927, -0.059],
    system: 'skeletal',
    medicalExplanation: "Tulang segitiga besar di dasar tulang belakang, terbentuk dari penyatuan lima vertebra. Meneruskan berat tubuh bagian atas ke panggul. Foramina sakral memungkinkan keluarnya saraf spinal sakral (S1-S4) yang mengontrol fungsi kandung kemih dan usus."
  },
  "Sternum": {
    id: "Sternum",
    name: "Sternum (Breastbone)",
    number: 17,
    position: [0, 1.296, 0.092],
    system: 'skeletal',
    medicalExplanation: "Terdiri dari manubrium, korpus (badan), dan prosesus xifoideus. Sudut sternal (Angle of Louis) adalah penanda klinis utama untuk menghitung tulang rusuk (perlekatan rusuk ke-2) dan mengidentifikasi tingkat diskus intervertebralis T4/T5 serta bifurkasi trakea."
  },
  "Incus": {
    id: "Incus",
    name: "Incus (Anvil)",
    number: 18,
    position: [0.047, 1.582, -0.006],
    system: 'skeletal',
    medicalExplanation: "Bagian tengah dari tiga tulang kecil di telinga tengah. Meneruskan getaran dari maleus ke stapes. Disartikulasi rantai osikular, seringkali karena otitis media kronis atau trauma, mengakibatkan gangguan pendengaran konduktif yang signifikan."
  },
  "Malleus": {
    id: "Malleus",
    name: "Malleus (Hammer)",
    number: 19,
    position: [0.048, 1.582, -0.004],
    system: 'skeletal',
    medicalExplanation: "Melekat pada gendang telinga (membran timpani), merupakan osikel pertama yang menerima getaran suara. 'Refleks cahaya' yang terlihat selama otoskopi diciptakan oleh prosesus lateral maleus. Fraktur jarang terjadi tetap dapat terjadi pada trauma tulang temporal yang parah."
  },
  "Stapes": {
    id: "Stapes",
    name: "Stapes (Stirrup)",
    number: 20,
    position: [0.043, 1.581, -0.005],
    system: 'skeletal',
    medicalExplanation: "Tulang terkecil dalam tubuh manusia. Lempeng dasarnya (footplate) meneruskan getaran ke jendela oval telinga dalam. Otosklerosis adalah penyakit di mana stapes menjadi kaku, mencegah getaran dan menyebabkan gangguan pendengaran, seringkali diobati dengan stapedektomi."
  },
  "Calcaneus": {
    id: "Calcaneus",
    name: "Calcaneus (Heel Bone)",
    number: 21,
    position: [0.08, 0.041, -0.049],
    system: 'skeletal',
    medicalExplanation: "Tulang tarsal terbesar. Berfungsi sebagai titik perlekatan untuk tendon Achilles. 'Don Juan fractures' (fraktur kompresi) sering terjadi akibat melompat dari ketinggian, dan memiliki kaitan tinggi dengan fraktur kompresi tulang belakang lumbal yang menyertainya."
  },
  "Navicular_bone": {
    id: "Navicular_bone",
    name: "Navicular Bone",
    number: 22,
    position: [0.075, 0.064, -0.003],
    system: 'skeletal',
    medicalExplanation: "Tulang berbentuk perahu yang terletak di tengah kaki (midfoot). Sangat penting untuk lengkungan longitudinal medial kaki. Fraktur stres umum terjadi pada atlet dan memerlukan manajemen yang hati-hati karena pasokan darah tulang yang terbatas (bahaya non-union)."
  },
  "Lacrimal_bone": {
    id: "Lacrimal_bone",
    name: "Lacrimal Bone",
    number: 23,
    position: [0.011, 1.585, 0.069],
    system: 'skeletal',
    medicalExplanation: "Tulang terkecil dan paling rapuh di wajah, terletak di bagian depan dinding medial rongga mata. Berisi alur lakrimal untuk kantung lakrimal (sistem saluran air mata)."
  },
  "Axis_(C2)_1": {
    id: "Axis",
    name: "Axis (C2 Vertebra)",
    number: 24,
    position: [0, 1.525, -0.02],
    system: 'skeletal',
    medicalExplanation: "Vertebra serviks kedua, dicirikan oleh dens (prosesus odontoid) yang bertindak sebagai poros untuk rotasi kepala. Fraktur Hangman melibatkan pars interartikular C2."
  },
  "Atlas_(C1)_1": {
    id: "Atlas",
    name: "Atlas (C1 Vertebra)",
    number: 25,
    position: [0, 1.543, -0.018],
    system: 'skeletal',
    medicalExplanation: "Vertebra serviks pertama (C1), dinamai berdasarkan Titan dalam mitologi Yunani yang memikul dunia. Menopang tengkorak dan memungkinkan gerakan menganggukkan kepala."
  },
  "Capitate_bone": {
    id: "Capitate_bone",
    name: "Capitate",
    number: 26,
    position: [0.265, 0.844, 0.019],
    system: 'skeletal',
    medicalExplanation: "Tulang karpal terbesar, terletak di pusat pergelangan tangan. Merupakan batu kunci (keystone) dari deretan karpal distal."
  },
  "Occipital_bone_1": {
    id: "Occipital_bone",
    name: "Occipital Bone",
    number: 27,
    position: [0, 1.595, -0.058],
    system: 'skeletal',
    medicalExplanation: "Membentuk bagian posterior-inferior tengkorak. Berisi foramen magnum, tempat sumsum tulang belakang lewat untuk terhubung dengan otak."
  },
  "Parietal_bonel_1": {
    id: "Parietal_bone",
    name: "Parietal Bone",
    number: 28,
    position: [0.024, 1.663, -0.035],
    system: 'skeletal',
    medicalExplanation: "Sepasang tulang yang membentuk sebagian besar atap dan sisi tengkorak. Mereka bertemu di sutura sagital."
  },
  "Zygomatic_bone": {
    id: "Zygomatic_bone",
    name: "Zygomatic Bone (Cheekbone)",
    number: 29,
    position: [0.046, 1.577, 0.054],
    system: 'skeletal',
    medicalExplanation: "Membentuk tonjolan pipi serta bagian dari dinding lateral dan dasar rongga mata."
  },
  "Nasal_bone": {
    id: "Nasal_bone",
    name: "Nasal Bone",
    number: 30,
    position: [0.004, 1.591, 0.088],
    system: 'skeletal',
    medicalExplanation: "Dua tulang lonjong kecil yang membentuk pangkal hidung ('batang hidung'). Ukurannya bervariasi pada setiap individu."
  },
  "Ethmoid_bone": {
    id: "Ethmoid_bone",
    name: "Ethmoid Bone",
    number: 31,
    position: [0, 1.587, 0.056],
    system: 'skeletal',
    medicalExplanation: "Tulang tunggal di tengkorak yang memisahkan rongga hidung dari otak. Terletak di atap hidung, di antara dua rongga mata."
  },
  "Coccyx": {
    id: "Coccyx",
    name: "Coccyx (Tailbone)",
    number: 32,
    position: [0, 0.846, -0.077],
    system: 'skeletal',
    medicalExplanation: "Segmen terakhir dari kolom tulang belakang. Merupakan tulang segitiga kecil yang menyerupai ekor yang memendek."
  },
  "Body_of_sternum_1": {
    id: "Sternum_Body",
    name: "Sternal Body",
    number: 33,
    position: [0, 1.296, 0.092],
    system: 'skeletal',
    medicalExplanation: "Bagian tengah dan terpanjang dari sternum. Melekat pada tulang rusuk ke-2 sampai ke-7."
  },
  "Manubrium_of_sternum_1": {
    id: "Manubrium",
    name: "Manubrium",
    number: 34,
    position: [0, 1.377, 0.055],
    system: 'skeletal',
    medicalExplanation: "Bagian atas sternum. Berartikulasi dengan klavikula dan sepasang tulang rusuk pertama."
  },
  "Vomer": {
    id: "Vomer",
    name: "Vomer",
    number: 35,
    position: [0, 1.57, 0.045],
    system: 'skeletal',
    medicalExplanation: "Tulang wajah tunggal pada tengkorak. Membentuk bagian posterior septum hidung."
  },
  "Hamate_bone": {
    id: "Hamate",
    name: "Hamate Bone",
    number: 36,
    position: [0.253, 0.839, 0.021],
    system: 'skeletal',
    medicalExplanation: "Tulang karpal berbentuk baji di sisi luar pergelangan tangan. Memiliki prosesus khas seperti pengait (hamulus)."
  },
  "Scaphoid_bone": {
    id: "Scaphoid",
    name: "Scaphoid Bone",
    number: 37,
    position: [-0.272, 0.855, 0.018],
    system: 'skeletal',
    medicalExplanation: "Tulang terbesar di barisan proksimal tulang karpal. Merupakan tulang karpal yang paling sering mengalami fraktur, biasanya karena jatuh dengan tangan terentang."
  },
  "Trapezium_bone": {
    id: "Trapezium",
    name: "Trapezium Bone",
    number: 38,
    position: [0.281, 0.848, 0.028],
    system: 'skeletal',
    medicalExplanation: "Tulang karpal yang berartikulasi dengan metakarpal ibu jari, membentuk sendi karpometakarpal pertama."
  },
  "First_metatarsal_bone": {
    id: "Metatarsal_1",
    name: "First Metatarsal",
    number: 39,
    position: [0.072, 0.035, 0.051],
    system: 'skeletal',
    medicalExplanation: "Tulang metatarsal paling tebal dan terpendek, memberikan dukungan signifikan bagi berat tubuh saat berjalan."
  },
  "Second_metatarsal_bone": {
    id: "Metatarsal_2",
    name: "Second Metatarsal",
    number: 40,
    position: [0.09, 0.043, 0.04],
    system: 'skeletal',
    medicalExplanation: "Tulang metatarsal terpanjang. Terjepit kuat di antara tulang-tulang kuneiformis dan merupakan lokasi umum untuk fraktur stres."
  },
  "First_rib": {
    id: "Rib_1",
    name: "First Rib",
    number: 41,
    position: [0.044, 1.421, -0.005],
    system: 'skeletal',
    medicalExplanation: "Tulang rusuk yang paling tinggi, terpendek, terlebar, dan paling melengkung di antara semua tulang rusuk. Berartikulasi dengan vertebra toraks pertama."
  },
  "Hyoid_bone": {
    id: "Hyoid",
    name: "Hyoid Bone",
    number: 42,
    position: [0, 1.502, 0.025],
    system: 'skeletal',
    medicalExplanation: "Tulang berbentuk U di leher yang menopang lidah. Merupakan satu-satunya tulang di tubuh yang tidak berartikulasi dengan tulang lainnya."
  },
  "Vertebra_L1_1": {
    id: "L1",
    name: "L1 Vertebra",
    number: 43,
    position: [0, 1.106, -0.036],
    system: 'skeletal',
    medicalExplanation: "Vertebra lumbal pertama. Vertebra lumbal adalah yang terbesar di antara vertebra yang dapat bergerak, dirancang untuk menopang berat badan."
  },
  "Vertebra_L5_1": {
    id: "L5",
    name: "L5 Vertebra",
    number: 44,
    position: [0, 0.986, -0.032],
    system: 'skeletal',
    medicalExplanation: "Vertebra lumbal kelima. Berartikulasi dengan sakrum dan merupakan area umum bagi masalah punggung bawah (saraf terjepit/herniasi diskus)."
  },
  "Vertebra_T1_1": {
    id: "T1",
    name: "T1 Vertebra",
    number: 45,
    position: [0, 1.299, -0.059],
    system: 'skeletal',
    medicalExplanation: "Vertebra toraks pertama. Berartikulasi dengan sepasang tulang rusuk pertama."
  },
  "Vertebra_C7": {
    id: "C7",
    name: "C7 Vertebra (Vertebra Prominens)",
    number: 46,
    position: [0, 1.467, -0.025],
    system: 'skeletal',
    medicalExplanation: "Vertebra serviks ketujuh. Memiliki prosesus spinosus yang panjang dan menonjol yang dapat diraba di dasar leher."
  },
  "Fifth_metacarpal_bone": {
    id: "Metacarpal_5",
    name: "Fifth Metacarpal",
    number: 47,
    position: [0.243, 0.808, 0.032],
    system: 'skeletal',
    medicalExplanation: "Tulang yang menghubungkan pergelangan tangan dengan jari kelingking."
  },
  "First_metacarpal_bone": {
    id: "Metacarpal_1_hand",
    name: "First Metacarpal",
    number: 48,
    position: [0.303, 0.825, 0.04],
    system: 'skeletal',
    medicalExplanation: "Tulang yang menghubungkan pergelangan tangan dengan ibu jari. Lebih pendek dan lebih tebal dari metakarpal lainnya dan memungkinkan mobilitas tinggi."
  },
  "Lunate_bone": {
    id: "Lunate_bone",
    name: "Lunate Bone",
    number: 49,
    position: [0.253, 0.854, 0.017],
    system: 'skeletal',
    medicalExplanation: "Tulang karpal berbentuk bulan sabit di tengah barisan proksimal. Dislokasi tulang ini merupakan cedera pergelangan tangan yang serius."
  },
  "Trapezoid_bone": {
    id: "Trapezoid_bone",
    name: "Trapezoid Bone",
    number: 50,
    position: [0.275, 0.839, 0.02],
    system: 'skeletal',
    medicalExplanation: "Tulang terkecil di barisan distal tulang karpal."
  },
  "Fourth_metatarsal_bone": {
    id: "Fourth_metatarsal_bone",
    name: "Fourth Metatarsal",
    number: 51,
    position: [0.107, 0.031, 0.032],
    system: 'skeletal',
    medicalExplanation: "Salah satu dari lima tulang panjang pada kaki."
  },
  "Sesamoid_bones_of_foot": {
    id: "Sesamoid_bones_of_foot",
    name: "Sesamoid Bones (Foot)",
    number: 52,
    position: [-0.074, 0.015, 0.07],
    system: 'skeletal',
    medicalExplanation: "Tulang kecil yang tertanam di dalam tendon di kaki, memberikan daya ungkit untuk ibu jari kaki."
  },
  "Distal_phalanx_of_first_finger_of_foot": {
    id: "Distal_phalanx_of_first_finger_of_foot",
    name: "Distal Phalanx (1st Toe)",
    number: 53,
    position: [0.081, 0.014, 0.121],
    system: 'skeletal',
    medicalExplanation: "Tulang di ujung ibu jari kaki."
  },
  "Cuboid_bone": {
    id: "Cuboid_bone",
    name: "Cuboid Bone",
    number: 54,
    position: [0.096, 0.043, -0.007],
    system: 'skeletal',
    medicalExplanation: "Tulang tarsal berbentuk kubus di sisi luar kaki."
  },
  "Intermediate_cuneiform_boner_1": {
    id: "Intermediate_cuneiform_boner_1",
    name: "Intermediate Cuneiform",
    number: 55,
    position: [0.083, 0.058, 0.011],
    system: 'skeletal',
    medicalExplanation: "Salah satu dari tiga tulang kuneiformis di kaki bagian tengah."
  },
  "Medial_cuneiform_boner_1": {
    id: "Medial_cuneiform_boner_1",
    name: "Medial Cuneiform",
    number: 56,
    position: [0.071, 0.051, 0.017],
    system: 'skeletal',
    medicalExplanation: "Tulang kuneiformis terbesar, terletak di sisi dalam kaki."
  },
  "Eighth_rib": {
    id: "Eighth_rib",
    name: "Eighth Rib",
    number: 57,
    position: [0.084, 1.224, -0.038],
    system: 'skeletal',
    medicalExplanation: "Salah satu tulang rusuk 'palsu' yang terhubung ke sternum secara tidak langsung melalui tulang rawan."
  },
  "Eleventh_rib": {
    id: "Eleventh_rib",
    name: "Eleventh Rib (Floating Rib)",
    number: 58,
    position: [0.072, 1.131, -0.044],
    system: 'skeletal',
    medicalExplanation: "Salah satu tulang rusuk melayang yang tidak memiliki perlekatan anterior ke sternum."
  },
  "Vertebra_L3_1": {
    id: "Vertebra_L3_1",
    name: "L3 Vertebra",
    number: 59,
    position: [0, 1.045, -0.03],
    system: 'skeletal',
    medicalExplanation: "Vertebra lumbal ketiga, bagian dari bagian punggung bawah kolom tulang belakang."
  },
  "Vertebra_L4_1": {
    id: "Vertebra_L4_1",
    name: "L4 Vertebra",
    number: 60,
    position: [0, 1.015, -0.028],
    system: 'skeletal',
    medicalExplanation: "Vertebra lumbal keempat. Merupakan tulang penahan beban utama pada punggung bawah."
  },
  "Right_common_carotid_artery": {
    id: "Right_common_carotid_artery",
    name: "Right Common Carotid Artery",
    number: 1,
    position: [-0.021, 1.442, 0.01],
    system: 'cardiovascular',
    medicalExplanation: "Arteri karotis komunis kanan berasal dari trunkus brakiosfalkika. Arteri ini naik ke leher, menyediakan suplai darah utama ke belahan otak kanan dan struktur wajah. Konteks klinis: Arteri ini bercabang (bifurkasi) pada tingkat C4 menjadi karotis interna dan eksterna. Sinus karotis, yang terletak pada bifurkasi, mengandung baroreseptor yang vital untuk regulasi tekanan darah. Endarterektomi karotis sering dilakukan di sini untuk mencegah stroke."
  },
  "Anterior_communicating_artery": {
    id: "Anterior_communicating_artery",
    name: "Anterior Communicating Artery",
    number: 2,
    position: [0, 1.61, 0.023],
    system: 'cardiovascular',
    medicalExplanation: "Pembuluh darah kecil namun vital yang menghubungkan kedua arteri serebral anterior di dalam Sirkulus Willis di dasar otak. Memberikan sirkulasi kolateral penting antara sistem karotis kiri dan kanan. Secara patologis, ini adalah lokasi paling umum untuk aneurisma berry (sakular) intrakranial. Ruptur menyebabkan perdarahan subaraknoid yang sering muncul sebagai sakit kepala 'gelegar' yang tiba-tiba."
  },
  "Left_coronary_leaflet": {
    id: "Left_coronary_leaflet",
    name: "Left Coronary Leaflet / Artery",
    number: 3,
    position: [0.023, 1.317, 0.021],
    system: 'cardiovascular',
    medicalExplanation: "Terkait dengan katup aorta puncak koroner kiri, yang menjadi asal (ostium) arteri koroner utama kiri. Arteri koroner kiri menyuplai sebagian besar miokardium ventrikel kiri. Oklusi akut pada arteri koroner kiri utama atau cabang utamanya (LAD), dikenal sebagai serangan jantung 'widow-maker' karena area infark yang masif dan tingkat kematian yang tinggi."
  },
  "Inferior_leaflet": {
    id: "Inferior_leaflet",
    name: "Atrioventricular Valve Leaflet",
    number: 4,
    position: [-0.002, 1.269, 0.032],
    system: 'cardiovascular',
    medicalExplanation: "Komponen fungsional dari katup trikuspid (kanan) atau mitral (kiri) yang mencegah regurgitasi ventrikel-atrium selama sistol. Daun katup ini ditambatkan oleh korda tendinea ke otot papilaris. Penyakit katup jantung (seperti prolaps katup mitral atau penyakit jantung rematik) menyebabkan pelemahan struktural daun katup ini, menyebabkan kelebihan beban volume dan akhirnya gagal jantung."
  },
  "Right_atrium": {
    id: "Right_atrium",
    name: "Right Atrium",
    number: 5,
    position: [0.03, 1.35, 0.02],
    system: 'cardiovascular',
    medicalExplanation: "Ruang penerima darah sistemik terdeoksigenasi yang kembali melalui vena kava superior/inferior dan sinus koronarius. Berisi nodus Sinoatrial (SA), pacu jantung elektrofisiologis utama jantung. Pembesaran (RAE) dapat terlihat pada penyakit paru kronis. Flutter/fibrilasi atrium sering melibatkan sirkuit makro-reentrant di dalam atrium kanan."
  },
  "Pulmonary_trunk": {
    id: "Pulmonary_trunk",
    name: "Pulmonary Trunk",
    number: 6,
    position: [0.007, 1.307, -0.017],
    system: 'cardiovascular',
    medicalExplanation: "Pembuluh darah besar yang berasal dari ventrikel kanan yang membawa darah terdeoksigenasi ke paru-paru. Merupakan pembuluh berkapasitas tinggi yang terbagi menjadi arteri pulmonalis kanan dan kiri. Pada tetralogi Fallot, stenosis pulmonal adalah temuan khas. Hipertensi arteri pulmonalis (PAH) menyebabkan kelebihan beban tekanan yang signifikan pada batang proksimal."
  },
  "Bifurcation_of_pulmonary_trunk": {
    id: "Bifurcation_of_pulmonary_trunk",
    name: "Pulmonary Trunk Bifurcation",
    number: 7,
    position: [0.007, 1.315, -0.017],
    system: 'cardiovascular',
    medicalExplanation: "Titik di mana trunkus pulmonalis terbagi menjadi arteri pulmonalis kanan dan kiri pada setinggi vertebra T5. Signifikansi klinis: 'Emboli pelana' (saddle embolus) adalah trombosis vena dalam yang besar yang tersangkut tepat di bifurkasi ini, menghambat aliran ke kedua paru-paru. Ini menyebabkan gagal jantung kanan akut (cor pulmonale) dan merupakan keadaan darurat yang mengancam jiwa."
  },
  "Superior_vena_cava": {
    id: "Superior_vena_cava",
    name: "Superior Vena Cava",
    number: 8,
    position: [-0.016, 1.358, 0.021],
    system: 'cardiovascular',
    medicalExplanation: "Terbentuk oleh vena brakiosefalika, SVC mengembalikan darah terdeoksigenasi dari bagian atas tubuh ke atrium kanan. Sindrom Vena Kava Superior (SVCS) terjadi ketika pembuluh darah ini terkompresi, biasanya oleh keganasan mediastinum (seperti kanker paru sel kecil), menyebabkan wajah sembab, distensi vena leher, dan sakit kepala."
  },
  "Right_superior_pulmonary_vein": {
    id: "Right_superior_pulmonary_vein",
    name: "Right Superior Pulmonary Vein",
    number: 9,
    position: [-0.03, 1.323, -0.005],
    system: 'cardiovascular',
    medicalExplanation: "Membawa darah kaya oksigen dari lobus paru kanan atas ke atrium kiri. Berbeda dengan sebagian besar vena, pembuluh ini membawa darah beroksigen. Kepentingan klinis: Fokus listrik ektopik yang berasal dari selubung otot vena-vena ini sering kali menjadi pemicu fibrilasi atrium paroksismal; mereka sering menjadi target ablasi isolasi vena pulmonal (PVI)."
  },
  "Object_39": {
    id: "Object_39",
    name: "Cerebrum (Brain)",
    number: 1,
    system: 'nervous',
    medicalExplanation: "Bagian terbesar dari otak, bertanggung jawab atas fungsi yang lebih tinggi seperti pikiran, memori, dan gerakan otot sadar. Terbagi menjadi dua hemisfer dan empat lobus utama: frontal, parietal, temporal, dan oksipital. Korteks (materi abu-abu) mengandung sekitar 16 miliar neuron. Suplai darah terutama melalui karotis interna dan arteri vertebralis (Sirkulus Willis). Konteks klinis: Kecelakaan neurovaskular (stroke) pada wilayah arteri serebral media (MCA) sering mengakibatkan hemiparesis kontralateral dan afasia."
  },
  "Object_168": {
    id: "Object_168",
    name: "Cerebral White Matter",
    number: 2,
    system: 'nervous',
    medicalExplanation: "Jaringan otak dalam yang mengandung serat saraf (akson) yang terbungkus mielin, yang memberikan tampilan putih. Serat-serat ini mentransmisikan sinyal antara bagian-bagian berbeda dari materi abu-abu. Korpus kalosum adalah struktur materi putih terbesar, yang menghubungkan kedua hemisfer. Konteks klinis: Penyakit demielinasi seperti Sklerosis Ganda (MS) menyerang mielin ini, menyebabkan 'korsleting' pada transmisi listrik yang berujung pada berbagai gejala neurologis."
  },
  "Object_157": {
    id: "Object_157",
    name: "Basal Ganglia / Thalamus",
    number: 3,
    system: 'nervous',
    medicalExplanation: "Struktur subkortikal yang kritis untuk kontrol motorik, pembelajaran prosedural, dan relai sensorik. Talamus bertindak sebagai 'papan hubung' bagi hampir semua informasi sensorik (kecuali penciuman) yang menuju ke korteks. Basal Ganglia mengoordinasikan gerakan otot yang halus. Konteks klinis: Disfungsi pada substansia nigra (bagian dari basal ganglia) menyebabkan tremor dan bradikinesia pada penyakit Parkinson."
  },
  "Object_4": {
    id: "Object_4",
    name: "Spinal Cord Pathways",
    number: 4,
    system: 'nervous',
    medicalExplanation: "Pusat konektivitas utama antara sistem saraf perifer dan otak. Mengandung traktus sensorik asenden (seperti kolumna dorsalis) dan traktus motorik desenden (seperti traktus kortikospinalis). Konteks klinis: Cedera sumsum tulang belakang diklasifikasikan sebagai 'lengkap' atau 'tidak lengkap'. Lesi pada tingkat C4 atau di atasnya mengancam jiwa karena melumpuhkan diafragma (dikendalikan oleh saraf frenikus)."
  },
  "Object_102": {
    id: "Object_102",
    name: "Cranial Nerve Branches",
    number: 5,
    system: 'nervous',
    medicalExplanation: "Saraf yang muncul langsung dari otak dan batang otak (NC I-XII). Saraf-saraf ini mengatur fungsi sensorik dan motorik kepala dan leher. Contohnya termasuk saraf Trigeminal (sensasi wajah) dan saraf Vagus (regulasi viseral). Konteks klinis: Neuralgia trigeminal melibatkan nyeri wajah yang hebat, sementara Bell's Palsy akibat kelumpuhan saraf Wajah (NC VII)."
  },
  "Object_82": {
    id: "Object_82",
    name: "Ocular Structures (Eyes)",
    number: 6,
    system: 'nervous',
    medicalExplanation: "Organ sensorik utama penglihatan, mengandung retina yang secara embriologis merupakan perpanjangan dari otak. Fotoreseptor (sel batang dan kerucut) mengubah cahaya menjadi sinyal listrik yang dikirim melalui Saraf Optik (NC II). Konteks klinis: Glaukoma diakibatkan oleh peningkatan tekanan intraokular yang merusak kepala saraf optik, menyebabkan hilangnya penglihatan perifer yang permanen."
  },
  "Object_5": {
    id: "Object_5",
    name: "Cerebral Vasculature (Circle of Willis)",
    number: 7,
    system: 'nervous',
    medicalExplanation: "Anastomosis sirkulasi di dasar otak yang menyediakan aliran darah kolateral. Menghubungkan sistem anterior (karotis) dan posterior (vertebral). Konteks klinis: Aneurisma pada persambungan arteri komunikans anterior umum terjadi. Vasospasme serebral setelah perdarahan subaraknoid adalah komplikasi kritis yang harus dikelola oleh ahli bedah saraf."
  },
  "Object_163": {
    id: "Object_163",
    name: "Maxillary/Mandibular Nerve Area",
    number: 8,
    system: 'nervous',
    medicalExplanation: "Wilayah yang diinervasi oleh cabang V2 (maksilaris) dan V3 (mandibularis) dari saraf Trigeminal. Cabang-cabang ini memberikan sensasi pada gigi dan gusi serta kontrol motorik untuk mengunyah (mastikasi). Konteks klinis: Anestesi dental menargetkan saraf alveolar inferior (cabang dari V3) untuk prosedur pada gigi bawah."
  },
  "Deltoid": {
    id: "Deltoid",
    name: "Deltoid Muscle",
    number: 1,
    system: 'muscular',
    medicalExplanation: "Otot segitiga besar yang menutupi sendi bahu. Merupakan abduktor utama lengan. Konteks klinis: Lokasi umum untuk suntikan intramuskular. Kerusakan pada saraf aksila dapat menyebabkan atrofi pada otot ini."
  },
  "Pectoralis_Major": {
    id: "Pectoralis_Major",
    name: "Pectoralis Major",
    number: 2,
    system: 'muscular',
    medicalExplanation: "Otot terbesar di dinding dada anterior. Bertanggung jawab atas adduksi dan rotasi internal humerus. Dalam bedah rekonstruksi, flap 'pec major' digunakan untuk rekonstruksi kepala dan leher."
  },
  "Biceps_Brachii": {
    id: "Biceps_Brachii",
    name: "Biceps Brachii",
    number: 3,
    system: 'muscular',
    medicalExplanation: "Otot berkepala dua yang terletak di lengan atas antara bahu dan siku. Merupakan supinator lengan bawah yang kuat dan fleksor siku."
  },
  "Rectus_Abdominis": {
    id: "Rectus_Abdominis",
    name: "Rectus Abdominis",
    number: 4,
    system: 'muscular',
    medicalExplanation: "Otot 'perut', otot berpasangan yang berjalan vertikal di setiap sisi dinding anterior perut manusia. Sangat penting untuk fleksi batang tubuh dan menstabilkan panggul saat berjalan."
  },
  "Quadriceps_Femoral": {
    id: "Quadriceps_Femoral",
    name: "Quadriceps Femoris",
    number: 5,
    system: 'muscular',
    medicalExplanation: "Kelompok otot besar yang mencakup empat otot utama di bagian depan paha. Merupakan ekstensor lutut terkuat dan esensial untuk berjalan, berlari, dan melompat."
  },
  "Trapezius": {
    id: "Trapezius",
    name: "Trapezius",
    number: 6,
    system: 'muscular',
    medicalExplanation: "Otot superfisial besar yang memanjang secara longitudinal dari tulang oksipital ke vertebra toraks bawah dan secara lateral ke spina skapula. Menggerakkan skapula dan menopang lengan."
  },
  "Gastrocnemius": {
    id: "Gastrocnemius",
    name: "Gastrocnemius (Calf Muscle)",
    number: 7,
    system: 'muscular',
    medicalExplanation: "Otot utama pada betis kaki, yang memfleksikan lutut dan kaki. Sangat penting untuk berlari dan melompat. Tendon Achilles menghubungkannya ke tulang tumit."
  },
  "Gluteus_Maximus": {
    id: "Gluteus_Maximus",
    name: "Gluteus Maximus",
    number: 8,
    system: 'muscular',
    medicalExplanation: "Otot terbesar dan terberat di tubuh. Merupakan ekstensor utama panggul. Ukurannya adalah karakteristik unik manusia, esensial untuk menjaga postur tegak."
  },
  // Joints / Arthrology
  "Articular_capsule_of_knee_jointl": {
    id: "Articular_capsule_of_knee_jointl",
    name: "Knee Joint Capsule",
    number: 1,
    position: [0.077, 0.443, -0.03],
    system: 'joints',
    medicalExplanation: "Sendi engsel kompleks yang melibatkan femur, tibia, dan patella. Didukung oleh ligamen ACL, PCL, MCL, dan LCL. Meniskus berfungsi sebagai peredam kejut. Konteks klinis: Robekan ACL adalah cedera olahraga umum yang memerlukan rekonstruksi bedah."
  },
  "Anterior_cruciate_ligamentl": {
    id: "Anterior_cruciate_ligamentl",
    name: "Anterior Cruciate Ligament (ACL)",
    number: 2,
    position: [0.076, 0.439, -0.037],
    system: 'joints',
    medicalExplanation: "Ligamen intra-artikular kunci yang mencegah pergeseran anterior tibia terhadap femur. Merupakan struktur vital bagi stabilitas rotasi lutut. Rekonstruksi ACL sering menggunakan autograft dari tendon patela atau hamstring."
  },
  "Articular_capsule_of_hip_jointl": {
    id: "Articular_capsule_of_hip_jointl",
    name: "Hip Joint Capsule",
    number: 3,
    position: [0.094, 0.851, -0.006],
    system: 'joints',
    medicalExplanation: "Sendi peluru penahan beban. Dioptimalkan untuk stabilitas dan transfer berat badan, diperkuat oleh ligamen kapsular yang kuat seperti ligamen iliofemoral. Konteks klinis: Osteoartritis panggul seringkali memerlukan penggantian panggul total (total hip arthroplasty)."
  },
  "Articular_capsule_of_glenohumeral_jointl": {
    id: "Articular_capsule_of_glenohumeral_jointl",
    name: "Glenohumeral (Shoulder) Joint",
    number: 4,
    position: [0.161, 1.383, -0.028],
    system: 'joints',
    medicalExplanation: "Sendi peluru (ball-and-socket) yang memungkinkan rentang gerak terbesar di tubuh. Stabilitasnya sangat bergantung pada otot-otot rotator cuff. Konteks klinis: Bahu kaku (capsulitis adhesiva) menyebabkan nyeri hebat dan kekakuan."
  },
  "Articular_capsule_of_elbow_jointl": {
    id: "Articular_capsule_of_elbow_jointl",
    name: "Elbow Joint Capsule",
    number: 5,
    position: [0.22, 1.106, -0.037],
    system: 'joints',
    medicalExplanation: "Sendi engsel antara humerus, radius, dan ulna. Memungkinkan fleksi/ekstensi dan rotasi lengan bawah. Konteks klinis: 'Tennis elbow' (epikondilitis lateral) melibatkan peradangan tendon yang melekat pada sendi."
  },
  "Anterior_talofibular_ligamentl": {
    id: "Anterior_talofibular_ligamentl",
    name: "Anterior Talofibular Ligament",
    number: 6,
    position: [0.096, 0.065, -0.036],
    system: 'joints',
    medicalExplanation: "Ligamen pergelangan kaki yang paling sering cedera. Menghubungkan talus ke fibula. Keseleo pergelangan kaki biasanya melibatkan cedera pada ligamen ini (ATFL)."
  },
  "Articular_capsule_of_radiocarpal_jointl": {
    id: "Articular_capsule_of_radiocarpal_jointl",
    name: "Radiocarpal (Wrist) Joint",
    number: 7,
    position: [0.264, 0.85, 0.02],
    system: 'joints',
    medicalExplanation: "Sendi elipsoid yang menghubungkan radius dan tulang karpal. Memfasilitasi gerakan tangan yang kompleks. Konteks klinis: Sindrom terowongan karpal melibatkan kompresi saraf median pada persambungan ini."
  },
  "Articular_capsule_of_temporomandibular_jointl": {
    id: "Articular_capsule_of_temporomandibular_jointl",
    name: "Temporomandibular Joint (TMJ)",
    number: 8,
    position: [0.044, 1.572, 0.007],
    system: 'joints',
    medicalExplanation: "Sendi yang menghubungkan rahang bawah ke tengkorak. Merupakan sendi 'engsel geser' yang unik dengan diskus fibrokartilago. Konteks klinis: Gangguan TMJ dapat menyebabkan bunyi klik, letupan, dan penguncian rahang."
  },
  // Lymphoid
  "Left_lobe_of_thymus_Gland_0": {
    id: "Left_lobe_of_thymus_Gland_0",
    name: "Thymus Gland",
    number: 1,
    system: 'lymphoid',
    medicalExplanation: "Organ limfoid primer khusus dari sistem kekebalan di mana sel-T menjadi matang. Paling aktif selama periode neonatal dan pra-remaja. Konteks klinis: Miastenia gravis sering dikaitkan dengan kelainan timus seperti hiperplasia atau timoma."
  },
  "Spleen_Organ_0": {
    id: "Spleen_Organ_0",
    name: "Spleen",
    number: 2,
    system: 'lymphoid',
    medicalExplanation: "Organ limfoid terbesar. Bertindak sebagai penyaring darah sebagai bagian dari sistem kekebalan. Sel darah merah tua didaur ulang di limpa, serta trombosit dan sel darah putih disimpan di sana. Konteks klinis: Splenomegali (pembesaran limpa) dapat terjadi pada hipertensi portal atau keganasan hematologi."
  },
  "Palatine_tonsill_Lymph-2_0": {
    id: "Palatine_tonsill_Lymph-2_0",
    name: "Palatine Tonsils",
    number: 3,
    system: 'lymphoid',
    medicalExplanation: "Jaringan limfoid yang terletak di bagian belakang tenggorokan. Merupakan garis pertahanan pertama terhadap patogen yang tertelan atau terhirup. Konteks klinis: Tonsilitis sering terjadi pada anak-anak; peradangan kronis mungkin memerlukan tonsilektomi."
  },
  "Pre-auricular_nodesr_Lymph-4_0": {
    id: "Pre-auricular_nodesr_Lymph-4_0",
    name: "Pre-auricular Lymph Nodes",
    number: 4,
    system: 'lymphoid',
    medicalExplanation: "Nodus yang terletak di depan telinga. Mengalirkan cairan limfa dari bagian lateral kelopak mata dan konjungtiva. Pembengkakan dapat mengindikasikan konjungtivitis virus atau infeksi pada wilayah temporal."
  },
  "Supraclavicular_nodesr_Lymph-5_0": {
    id: "Supraclavicular_nodesr_Lymph-5_0",
    name: "Supraclavicular Lymph Nodes",
    number: 5,
    system: 'lymphoid',
    medicalExplanation: "Terletak di atas klavikula. Nodus supraklavikularis kiri (Nodus Virchow) sangat signifikan secara klinis karena pembesarannya dapat menjadi tanda pertama keganasan perut, terutama kanker lambung (tanda Troisier)."
  },
  "Axillary_nodesr_Lymph-5_0": {
    id: "Axillary_nodesr_Lymph-5_0",
    name: "Axillary Lymph Nodes",
    number: 6,
    system: 'lymphoid',
    medicalExplanation: "Nodus di ketiak. Mengalirkan cairan limfa dari anggota gerak atas dan jaringan payudara. Konteks klinis: Biopsi nodus sentinel adalah standar perawatan dalam penentuan stadium kanker payudara untuk memeriksa metastasis."
  },
  "Deep_popliteal_nodesr_Lymph-5_0": {
    id: "Deep_popliteal_nodesr_Lymph-5_0",
    name: "Popliteal Lymph Nodes",
    number: 7,
    system: 'lymphoid',
    medicalExplanation: "Nodus yang terletak di fosa poplitea (belakang lutut). Mengalirkan cairan limfa dari sisi lateral kaki dan tungkai. Lokasinya yang dalam membuatnya sulit diraba kecuali jika membesar secara signifikan."
  },
  "Inferior_superficial_inguinal_nodesr_Lymph-2_0": {
    id: "Inferior_superficial_inguinal_nodesr_Lymph-2_0",
    name: "Inguinal Lymph Nodes",
    number: 8,
    system: 'lymphoid',
    medicalExplanation: "Terletak di area selangkangan. Mengalirkan cairan limfa dari anggota gerak bawah, genetalia eksterna, dan perineum. Pembesaran dapat terjadi pada infeksi ekstremitas bawah atau infeksi menular seksual."
  },
  // Insertions
  "Deltoid_Insertion": {
    id: "Deltoid_Insertion",
    name: "Deltoid Tuberosity (Humerus)",
    number: 1,
    system: 'insertions',
    medicalExplanation: "Area segitiga kasar di permukaan anterolateral tengah humerus tempat melekatnya otot deltoid. Titik perlekatan ini berfungsi sebagai lengan pengungkit untuk abduksi lengan."
  },
  "Biceps_Insertion": {
    id: "Biceps_Insertion",
    name: "Radial Tuberosity",
    number: 2,
    system: 'insertions',
    medicalExplanation: "Titik insersi untuk otot bisep brakii. Terletak pada tulang radius, kontraksi di sini menghasilkan fleksi lengan bawah dan supinasi yang kuat (memutar telapak tangan ke atas)."
  },
  "Triceps_Insertion": {
    id: "Triceps_Insertion",
    name: "Olecranon of Ulna",
    number: 3,
    system: 'insertions',
    medicalExplanation: "Prosesus proksimal ulna yang besar dan tumpul. Berfungsi sebagai titik insersi bagi otot trisep brakii, ekstensor utama sendi siku."
  },
  "Hamstring_Origin": {
    id: "Hamstring_Origin",
    name: "Ischial Tuberosity",
    number: 4,
    system: 'insertions',
    medicalExplanation: "Umumnya dikenal sebagai 'tulang duduk'. Merupakan titik asal bagi otot hamstring (bisep femoris, semitendinosus, semimembranosus). Fraktur avulsi dapat terjadi di sini pada atlet muda."
  },
  "Quadriceps_Insertion": {
    id: "Quadriceps_Insertion",
    name: "Tibial Tuberosity",
    number: 5,
    system: 'insertions',
    medicalExplanation: "Tonjolan tulang pada bagian anterior proksimal tibia tempat melekatnya ligamen patela. Pada remaja, stres berulang dapat menyebabkan penyakit Osgood-Schlatter di titik insersi ini."
  },
  "Gastrocnemius_Insertion": {
    id: "Gastrocnemius_Insertion",
    name: "Calcaneal Tuberosity",
    number: 6,
    system: 'insertions',
    medicalExplanation: "Bagian posterior tulang tumit (kalkaneus) tempat menempelnya tendon Achilles. Merupakan lokasi insersi bagi otot gastrocnemius dan soleus, yang memfasilitasi gerakan plantar fleksi."
  },
  "Latissimus_Dorsi_Insertion": {
    id: "Latissimus_Dorsi_Insertion",
    name: "Intertubercular Groove (Humerus)",
    number: 7,
    system: 'insertions',
    medicalExplanation: "Titik insersi bagi otot latissimus dorsi. Otot yang kuat ini menarik lengan ke bawah dan ke belakang (ekstensi, adduksi, dan rotasi internal)."
  },
  "Gluteus_Maximus_Insertion": {
    id: "Gluteus_Maximus_Insertion",
    name: "Gluteal Tuberosity (Femur)",
    number: 8,
    system: 'insertions',
    medicalExplanation: "Punggungan kasar pada permukaan posterior batang femur tempat insersi gluteus maksimus. Sangat penting untuk ekstensi panggul, terutama saat bangkit dari posisi duduk."
  },
};
