import {
  Student,
  AcademicRecord,
  BehaviorLog,
  Group,
  GroupHistory,
  Assignment,
  Intervention,
  ReteachPlan,
  LessonSuggestion,
  AppliedModification,
  CommsHistory,
  PacingSuggestion,
  StandardsCoverage
} from '@/types';

// Pre-seeded list of exactly 28 students (5 At Risk, 18 On Track, 5 Advanced)
export const initialStudents: Student[] = [
  // Advanced Students (5)
  {
    id: 's1',
    name: 'Alisha Patel',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Advanced',
    readingLevel: '5A',
    avgScore: 94,
    attendanceRate: 98,
    group: 'A',
    parentName: 'Ramesh Patel',
    parentEmail: 'ramesh.patel@example.com',
    mathScore: 95
  },
  {
    id: 's2',
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Advanced',
    readingLevel: '4Z',
    avgScore: 92,
    attendanceRate: 99,
    group: 'A',
    parentName: 'Hsin Chen',
    parentEmail: 'chen.family@example.com',
    mathScore: 93
  },
  {
    id: 's3',
    name: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Advanced',
    readingLevel: '5B',
    avgScore: 91,
    attendanceRate: 96,
    group: 'A',
    parentName: 'Sarah Vance',
    parentEmail: 'svance@example.com',
    mathScore: 91
  },
  {
    id: 's4',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Advanced',
    readingLevel: '4Y',
    avgScore: 89,
    attendanceRate: 97,
    group: 'A',
    parentName: 'Paul Jenkins',
    parentEmail: 'pjenkins@example.com',
    mathScore: 88
  },
  {
    id: 's5',
    name: 'Benjamin Wright',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Advanced',
    readingLevel: '5A',
    avgScore: 90,
    attendanceRate: 95,
    group: 'A',
    parentName: 'Elizabeth Wright',
    parentEmail: 'ewright@example.com',
    mathScore: 89
  },

  // At Risk Students (5)
  {
    id: 's6',
    name: 'Marcus Thompson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'At Risk',
    readingLevel: '3B',
    avgScore: 58,
    attendanceRate: 89,
    group: 'D',
    parentName: 'Robert Thompson',
    parentEmail: 'rthompson@example.com',
    mathScore: 44
  },
  {
    id: 's7',
    name: 'Devon R.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'At Risk',
    readingLevel: '3C',
    avgScore: 61,
    attendanceRate: 88,
    group: 'D',
    parentName: 'Tina Rogers',
    parentEmail: 'trogers@example.com',
    mathScore: 48,
    scoreDeclineAlert: true
  },
  {
    id: 's8',
    name: 'Jasmine Taylor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'At Risk',
    readingLevel: '3A',
    avgScore: 52,
    attendanceRate: 85,
    group: 'D',
    parentName: 'Marcus Taylor Sr.',
    parentEmail: 'mtaylor@example.com',
    mathScore: 41
  },
  {
    id: 's9',
    name: 'Tyler Vance',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'At Risk',
    readingLevel: '3C',
    avgScore: 55,
    attendanceRate: 84,
    group: 'D',
    parentName: 'Corey Vance',
    parentEmail: 'cvance99@example.com',
    mathScore: 45
  },
  {
    id: 's10',
    name: 'Hailey Gomez',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'At Risk',
    readingLevel: '3A',
    avgScore: 51,
    attendanceRate: 82,
    group: 'D',
    parentName: 'Maria Gomez',
    parentEmail: 'mgomez@example.com',
    mathScore: 42
  },

  // On Track / Developing (18)
  {
    id: 's11',
    name: 'Carlos Mendez',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4P',
    avgScore: 78,
    attendanceRate: 95,
    group: 'B',
    parentName: 'Juan Mendez',
    parentEmail: 'jmendez@example.com',
    mathScore: 76
  },
  {
    id: 's12',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4R',
    avgScore: 79,
    attendanceRate: 94,
    group: 'B',
    parentName: 'Grace Lin',
    parentEmail: 'glin@example.com',
    mathScore: 77
  },
  {
    id: 's13',
    name: 'Jordan Brooks',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4M',
    avgScore: 75,
    attendanceRate: 92,
    group: 'B',
    parentName: 'Kim Brooks',
    parentEmail: 'kbrooks@example.com',
    mathScore: 74
  },
  {
    id: 's14',
    name: 'Chloe Smith',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4N',
    avgScore: 74,
    attendanceRate: 91,
    group: 'B',
    parentName: 'Derrick Smith',
    parentEmail: 'dsmith@example.com',
    mathScore: 72
  },
  {
    id: 's15',
    name: 'Ethan Ross',
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4O',
    avgScore: 72,
    attendanceRate: 93,
    group: 'B',
    parentName: 'Jack Ross',
    parentEmail: 'jross@example.com',
    mathScore: 73
  },
  {
    id: 's16',
    name: 'Sophia Carter',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4Q',
    avgScore: 76,
    attendanceRate: 96,
    group: 'B',
    parentName: 'Lisa Carter',
    parentEmail: 'lcarter@example.com',
    mathScore: 75
  },
  {
    id: 's17',
    name: 'Lucas Diaz',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4R',
    avgScore: 81,
    attendanceRate: 95,
    group: 'B',
    parentName: 'Ana Diaz',
    parentEmail: 'adiaz@example.com',
    mathScore: 80
  },
  {
    id: 's18',
    name: 'Zoe Barnes',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4P',
    avgScore: 73,
    attendanceRate: 90,
    group: 'B',
    parentName: 'Aaron Barnes',
    parentEmail: 'abarnes@example.com',
    mathScore: 71
  },
  {
    id: 's19',
    name: 'Alexander Wu',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'On Track',
    readingLevel: '4S',
    avgScore: 80,
    attendanceRate: 97,
    group: 'B',
    parentName: 'Lin Wu',
    parentEmail: 'linwu@example.com',
    mathScore: 83
  },
  {
    id: 's20',
    name: 'Mia Jackson',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4L',
    avgScore: 65,
    attendanceRate: 89,
    group: 'C',
    parentName: 'Valerie Jackson',
    parentEmail: 'vjackson@example.com',
    mathScore: 63
  },
  {
    id: 's21',
    name: 'Willie Green',
    avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4K',
    avgScore: 61,
    attendanceRate: 87,
    group: 'C',
    parentName: 'Marcus Green',
    parentEmail: 'mgreen@example.com',
    mathScore: 59
  },
  {
    id: 's22',
    name: 'Lily Sterling',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4M',
    avgScore: 64,
    attendanceRate: 91,
    group: 'C',
    parentName: 'Hugh Sterling',
    parentEmail: 'hsterling@example.com',
    mathScore: 62
  },
  {
    id: 's23',
    name: 'Aron Cole',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4L',
    avgScore: 60,
    attendanceRate: 88,
    group: 'C',
    parentName: 'Darren Cole',
    parentEmail: 'dcole@example.com',
    mathScore: 58
  },
  {
    id: 's24',
    name: 'Emma Foster',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4N',
    avgScore: 66,
    attendanceRate: 92,
    group: 'C',
    parentName: 'Regina Foster',
    parentEmail: 'rfoster@example.com',
    mathScore: 65
  },
  {
    id: 's25',
    name: 'Nathaniel West',
    avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4M',
    avgScore: 62,
    attendanceRate: 89,
    group: 'C',
    parentName: 'Sean West',
    parentEmail: 'swest@example.com',
    mathScore: 60
  },
  {
    id: 's26',
    name: 'Olivia Martinez',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4N',
    avgScore: 67,
    attendanceRate: 92,
    group: 'C',
    parentName: 'Carlos Martinez',
    parentEmail: 'cmartinez@example.com',
    mathScore: 66
  },
  {
    id: 's27',
    name: 'Amir Butler',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4K',
    avgScore: 59,
    attendanceRate: 86,
    group: 'C',
    parentName: 'Jamal Butler',
    parentEmail: 'jbutler@example.com',
    mathScore: 57
  },
  {
    id: 's28',
    name: 'Kenzie Brooks',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    grade: 'Grade 4',
    room: 'Room 12',
    riskLevel: 'Developing',
    readingLevel: '4P',
    avgScore: 63,
    attendanceRate: 90,
    group: 'C',
    parentName: 'Lisa Brooks',
    parentEmail: 'lbrooks@example.com',
    mathScore: 61
  }
];

// Initial academic history
export const initialAcademicRecords: AcademicRecord[] = [
  {
    id: 'ac1',
    studentId: 's6',
    subject: 'Math',
    testName: 'Multiplication Pre-Test',
    score: 44,
    date: '2026-06-12',
    readingLevel: '3B',
    standards: ['CCSS.Math.3.OA.A.1']
  },
  {
    id: 'ac2',
    studentId: 's6',
    subject: 'Reading',
    testName: 'Paragraph Inference Unit 1',
    score: 58,
    date: '2026-06-10',
    readingLevel: '3B',
    standards: ['CCSS.ELA.RI.4.1']
  },
  {
    id: 'ac3',
    studentId: 's7',
    subject: 'Math',
    testName: 'Multiplication Pre-Test',
    score: 48,
    date: '2026-06-12',
    readingLevel: '3C',
    standards: ['CCSS.Math.3.OA.A.1']
  },
  {
    id: 'ac4',
    studentId: 's1',
    subject: 'Math',
    testName: 'Multiplication Pre-Test',
    score: 95,
    date: '2026-06-12',
    readingLevel: '5A',
    standards: ['CCSS.Math.3.OA.A.1']
  },
  {
    id: 'ac5',
    studentId: 's11',
    subject: 'Math',
    testName: 'Multiplication Pre-Test',
    score: 76,
    date: '2026-06-12',
    readingLevel: '4P',
    standards: ['CCSS.Math.3.OA.A.1']
  },
  {
    id: 'ac6',
    studentId: 's6',
    subject: 'Science',
    testName: 'Ecosystems Basics',
    score: 62,
    date: '2026-06-05',
    readingLevel: '3B',
    standards: ['NGSS.4-LS1-1']
  },
  {
    id: 'ac7',
    studentId: 's6',
    subject: 'Social Studies',
    testName: 'State Foundations',
    score: 67,
    date: '2026-06-02',
    readingLevel: '3B',
    standards: ['CCSS.ELA.RI.4.3']
  },
  {
    id: 'ac8',
    studentId: 's6',
    subject: 'Writing',
    testName: 'Persuasive Paragraph',
    score: 60,
    date: '2026-05-28',
    readingLevel: '3B',
    standards: ['CCSS.ELA.W.4.1']
  }
];

// Behavior logs
export const initialBehaviorLogs: BehaviorLog[] = [
  {
    id: 'b1',
    studentId: 's6',
    date: '2026-06-12',
    type: 'Concern',
    notes: 'Difficulty staying focused during multiplication small-group instruction. Kept drumming pencils.',
    rating: 2
  },
  {
    id: 'b2',
    studentId: 's6',
    date: '2026-06-15',
    type: 'Positive',
    notes: 'Helped clean up the class library without being asked. Positive peer cooperation.',
    rating: 5
  },
  {
    id: 'b3',
    studentId: 's6',
    date: '2026-06-11',
    type: 'Neutral',
    notes: 'Quiet today, finished half of independent reading task.',
    rating: 3
  }
];

// Initial group mapping based on Risk Levels explicitly requested
export const initialGroups: Group[] = [
  {
    id: 'A',
    name: 'Group A',
    type: 'Advanced',
    avgScore: 91,
    studentIds: ['s1', 's2', 's3', 's4', 's5'],
    tag: 'Above Grade Level',
    color: '#3B82F6',
    borderColor: '#3B82F6'
  },
  {
    id: 'B',
    name: 'Group B',
    type: 'On Track',
    avgScore: 74,
    studentIds: ['s11', 's12', 's13', 's14', 's15', 's16', 's17', 's18', 's19'],
    tag: 'At Grade Level',
    color: '#10B981',
    borderColor: '#10B981'
  },
  {
    id: 'C',
    name: 'Group C',
    type: 'Developing',
    avgScore: 61,
    studentIds: ['s20', 's21', 's22', 's23', 's24', 's25', 's26', 's27', 's28'],
    tag: 'Approaching Grade Level',
    color: '#F59E0B',
    borderColor: '#F59E0B'
  },
  {
    id: 'D',
    name: 'Group D',
    type: 'At Risk',
    avgScore: 44,
    studentIds: ['s6', 's7', 's8', 's9', 's10'],
    tag: 'Below Grade Level',
    color: '#EF4444',
    borderColor: '#EF4444'
  }
];

// Group generation history
export const initialGroupHistory: GroupHistory[] = [
  {
    id: 'gh1',
    date: '2026-06-14',
    groupsCreatedCount: 4,
    trigger: 'AI Recommendation — Multi-factor Score Diagnostic'
  },
  {
    id: 'gh2',
    date: '2026-06-05',
    groupsCreatedCount: 4,
    trigger: 'Weekly Diagnostic Assessment Sync'
  },
  {
    id: 'gh3',
    date: '2026-05-28',
    groupsCreatedCount: 3,
    trigger: 'Reading Placement Level Refresh'
  }
];

// Pre-seeded assignments
export const initialAssignments: Assignment[] = [
  {
    id: 'as1',
    title: 'Multiplication Word Problems',
    type: 'Assignment',
    difficulty: 'Medium',
    targetType: 'Group',
    targetValue: 'Group D',
    dueDate: '2026-06-20',
    standards: ['CCSS.Math.3.OA.A.1', 'CCSS.Math.3.OA.A.3'],
    instructions: 'Complete standard modeling worksheets with visual arrays. Focus on grouping representations.',
    levelBadge: 'Below'
  },
  {
    id: 'as2',
    title: 'Advanced Factoring Techniques',
    type: 'Assignment',
    difficulty: 'High',
    targetType: 'Group',
    targetValue: 'Group A',
    dueDate: '2026-06-20',
    standards: ['CCSS.Math.4.OA.B.4'],
    instructions: 'Determine all prime factor trees for numbers beyond 100 and write a short defense of their modular properties.',
    levelBadge: 'Advanced'
  },
  {
    id: 'as3',
    title: 'Peer Division Practice',
    type: 'Homework',
    difficulty: 'Medium',
    targetType: 'Group',
    targetValue: 'Group B',
    dueDate: '2026-06-18',
    standards: ['CCSS.Math.3.OA.C.7'],
    instructions: 'Work through Division Cards 1-15. Record partner confirmation answers on the back panel grid.',
    levelBadge: 'On Track'
  },
  {
    id: 'as4',
    title: 'Basic Graphing & Tallying',
    type: 'Assignment',
    difficulty: 'Low',
    targetType: 'Level',
    targetValue: 'Below',
    dueDate: '2026-06-22',
    standards: ['CCSS.Math.3.MD.B.3'],
    instructions: 'Draw a bar graph representing your family favorites. Use colored block stickers for visual count.',
    levelBadge: 'Below'
  },
  {
    id: 'as5',
    title: 'Ecosystem Interactions Journal',
    type: 'Assignment',
    difficulty: 'Medium',
    targetType: 'Level',
    targetValue: 'On Track',
    dueDate: '2026-06-19',
    standards: ['NGSS.4-LS1-1'],
    instructions: 'Write a two-paragraph reflection on how producers and consumers depend directly on solar cycles.',
    levelBadge: 'On Track'
  },
  {
    id: 'as6',
    title: 'Inference Analysis Writing',
    type: 'Homework',
    difficulty: 'High',
    targetType: 'Level',
    targetValue: 'Advanced',
    dueDate: '2026-06-21',
    standards: ['CCSS.ELA.RI.4.1'],
    instructions: 'Read custom biography snippet page 14 and summarize the subtle underlying motives of the explorer.',
    levelBadge: 'Advanced'
  }
];

// Interventions
export const initialInterventions: Intervention[] = [
  {
    id: 'i1',
    studentId: 's6', // Marcus Thompson
    strategy: '1:1 Support',
    activities: [
      'Tactile number blocks for division loops',
      'Daily 5-minute math reflex card warmup',
      'Prompt-guided structural visual graphing support'
    ],
    startDate: '2026-06-10',
    endDate: '2026-06-28',
    progress: 35,
    status: 'Active'
  },
  {
    id: 'i2',
    studentId: 's7', // Devon R.
    strategy: 'Small Group',
    activities: [
      'Multiplication Fact fluency group meetings on M/W',
      'Self-monitoring tracker checklist reviews',
      'Double-check peer coaching assignments'
    ],
    startDate: '2026-06-12',
    endDate: '2026-06-28',
    progress: 20,
    status: 'Active'
  },
  {
    id: 'i3',
    studentId: 's8', // Jasmine Taylor
    strategy: 'Peer Support',
    activities: [
      'Paired with Alisha Patel for solar ecosystem cycles review',
      'Daily checks with academic mentor tutor Emily',
      'Oral comprehension check-ins prior to writing sessions'
    ],
    startDate: '2026-06-10',
    endDate: '2026-06-24',
    progress: 42,
    status: 'Active'
  }
];

export const initialReteachPlans: ReteachPlan[] = [
  {
    id: 'rp1',
    standard: 'CCSS.Math.3.OA.A.1 (Multiplication Modeling)',
    studentCount: 5,
    method: 'Explicit structured scaffolding with wooden grids and visual tile counters'
  },
  {
    id: 'rp2',
    standard: 'CCSS.ELA.RI.4.1 (Drawing Clear Inferences)',
    studentCount: 7,
    method: 'Sentence starter scaffolding strips and highlights of underlying key words'
  },
  {
    id: 'rp3',
    standard: 'NGSS.4-LS1-1 (Ecosystem Adaptations)',
    studentCount: 4,
    method: 'Graphic organizers with colored flows mapped directly on classroom whiteboards'
  }
];

// Lesson modification tips (Screen 7)
export const initialLessonSuggestions: LessonSuggestion[] = [
  // Struggling Suggestions
  {
    id: 'ls1',
    type: 'struggling',
    tag: 'Scaffolding',
    description: 'Provide an interactive multi-colored fractional block set. Hand out standard strip guides where 1/2, 1/4, and 1/8 are visually layered.',
    standards: ['CCSS.Math.3.NF.A.1']
  },
  {
    id: 'ls2',
    type: 'struggling',
    tag: 'Visual Aid',
    description: 'Project dynamic fraction pie charts on the whiteboard. Play standard 3-minute video on cutting circular cakes into equivalent shares.',
    standards: ['CCSS.Math.3.NF.A.3']
  },
  {
    id: 'ls3',
    type: 'struggling',
    tag: 'Simplified Text',
    description: 'Rewrite standard fraction word problems using simple everyday words like apples or pencils. Keep sentence lengths under 8 words.',
    standards: ['CCSS.Math.3.NF.A.2']
  },
  // Advanced Suggestions
  {
    id: 'ls4',
    type: 'advanced',
    tag: 'Extension',
    description: 'Introduce equivalent fractions with larger factors (hundreds). Ask them to multiply numerator and denominator recursively.',
    standards: ['CCSS.Math.4.NF.A.1']
  },
  {
    id: 'ls5',
    type: 'advanced',
    tag: 'Challenge',
    description: 'Create real-life recipes containing combined fractional cups. Challenge them to triple or quadruple the complete list of quantities.',
    standards: ['CCSS.Math.4.NF.B.3.C']
  },
  {
    id: 'ls6',
    type: 'advanced',
    tag: 'Enrichment',
    description: 'Explore Egyptian unit fractions (expressing fractions as a sum of distinct unit fractions like 3/4 = 1/2 + 1/4). Write a 2-sentence rationale.',
    standards: ['CCSS.Math.4.NF.A.2']
  }
];

export const initialAppliedModifications: AppliedModification[] = [
  {
    id: 'am1',
    date: '2026-06-15',
    lessonName: 'Introduction to Equivalent Fractions',
    modType: 'Tactile Scaffolding Block Sets',
    appliedFor: 'Group D (Below Grade Level)',
    status: 'Applied'
  },
  {
    id: 'am2',
    date: '2026-06-12',
    lessonName: 'Basic Area Layouts',
    modType: 'Grid Drawing Graph Organizers',
    appliedFor: 'Marcus Thompson & Tyler Vance',
    status: 'Applied'
  }
];

// Parent Comms sent history (Screen 9)
export const initialCommsHistory: CommsHistory[] = [
  {
    id: 'ch1',
    date: '2026-06-15',
    studentId: 's6',
    type: 'Concern',
    tone: 'Friendly',
    sentBy: 'Ms. Johnson (Email)'
  },
  {
    id: 'ch2',
    date: '2026-06-14',
    studentId: 's1',
    type: 'Achievement',
    tone: 'Friendly',
    sentBy: 'Ms. Johnson (Email)'
  },
  {
    id: 'ch3',
    date: '2026-06-11',
    studentId: 's11',
    type: 'Progress Update',
    tone: 'Formal',
    sentBy: 'Ms. Johnson (Email)'
  },
  {
    id: 'ch4',
    date: '2026-06-08',
    studentId: 's6',
    type: 'Progress Update',
    tone: 'Friendly',
    sentBy: 'Ms. Johnson (Email)'
  },
  {
    id: 'ch5',
    date: '2026-06-01',
    studentId: 's20',
    type: 'Achievement',
    tone: 'Friendly',
    sentBy: 'Ms. Johnson (Email)'
  }
];

// Pacing Suggestions (Screen 10)
export const initialPacingSuggestions: PacingSuggestion[] = [
  {
    id: 'ps1',
    priority: 'High',
    suggestion: 'Combine Introduction to Equivalent Fractions and Fraction Strips into a unified 2-day session. Saves 1 instructional day.',
    standardsImpacted: 'CCSS.Math.3.NF.A.1, CCSS.Math.3.NF.A.2'
  },
  {
    id: 'ps2',
    priority: 'High',
    suggestion: 'Move independent homework validation checklists into a collaborative digital warm-up routine. Drastically saves 15 minutes of in-class time.',
    standardsImpacted: 'CCSS.Math.3.NF.A.3'
  },
  {
    id: 'ps3',
    priority: 'Medium',
    suggestion: 'Defer the advanced Area Estimation challenge module until the next assessment unit week. Provides 1 floating remedial day for group reteach.',
    standardsImpacted: 'CCSS.Math.4.OA.B.4'
  },
  {
    id: 'ps4',
    priority: 'Medium',
    suggestion: 'Provide high-quality homework screen recordings to families. Decreases student blockages and increases immediate homework pass-rates.',
    standardsImpacted: 'General Grade 4 Standards'
  }
];

// Standards Coverage Checklist (Screen 10)
export const initialStandardsCoverage: StandardsCoverage[] = [
  {
    code: 'CCSS.Math.3.OA.A.1',
    name: 'Interpret products of whole numbers, e.g., 5 * 7 as 5 groups of 7.',
    covered: true,
    status: 'Mastered'
  },
  {
    code: 'CCSS.Math.3.OA.A.3',
    name: 'Use multiplication and division within 100 to solve word problems.',
    covered: true,
    status: 'Mastered'
  },
  {
    code: 'CCSS.Math.3.OA.C.7',
    name: 'Fluently multiply and divide within 100, using strategies carefully.',
    covered: true,
    status: 'Mastered'
  },
  {
    code: 'CCSS.Math.3.NF.A.1',
    name: 'Understand a fraction 1/b as the quantity formed by 1 part of b.',
    covered: true,
    status: 'In Progress'
  },
  {
    code: 'CCSS.Math.3.NF.A.2',
    name: 'Represent a fraction 1/b on a number line diagram accurately.',
    covered: false,
    status: 'In Progress'
  },
  {
    code: 'CCSS.Math.3.NF.A.3',
    name: 'Explain equivalence of fractions and compare simple shares.',
    covered: false,
    status: 'Not Started'
  },
  {
    code: 'CCSS.ELA.RI.4.1',
    name: 'Refer to details and examples in a text when explaining inferences.',
    covered: true,
    status: 'In Progress'
  },
  {
    code: 'NGSS.4-LS1-1',
    name: 'Construct an argument that plants/animals have internal systems.',
    covered: true,
    status: 'Mastered'
  }
];
