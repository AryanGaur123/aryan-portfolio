import sandiskSvg from '../../assets/logos/sandisk.svg';
import spartanSvg from '../../assets/logos/spartan.svg';

export interface LogoConfig {
  /** URL of the SVG to extrude */
  svg: string;
  /** Base material color of the extruded geometry */
  color: string;
  /** Colored accent/rim light */
  accentLight: string;
  /** Secondary fill light */
  fillLight: string;
  /** Uniform scale nudge (SVGs have wildly different viewBox sizes) */
  scale?: number;
}

export interface CardData {
  num: string;
  role: string;
  company: string;
  period: string;
  type: string;
  bullets: string[];
  stack: string[];
  logo?: LogoConfig;
}

export const CARDS: CardData[] = [
  {
    num:     '01',
    role:    'GenAI Intern',
    company: 'SanDisk / Western Digital',
    period:  'Summer 2025',
    type:    'Internship',
    bullets: [
      'Building multi-agent AI pipelines for internal tooling using LangGraph and LangChain.',
      'Developing RAG architectures with semantic retrieval and LangFuse observability.',
      'Full-stack integrations with FastAPI backends and React frontends.',
    ],
    stack:   ['Python', 'LangGraph', 'LangChain', 'RAG', 'FastAPI', 'React'],
    logo: {
      svg: sandiskSvg,
      color: '#e10600',
      accentLight: '#ff2a1a',
      fillLight: '#803030',
      scale: 1.8,
    },
  },
  {
    num:     '02',
    role:    'B.S. Computer Engineering',
    company: 'San Jose State University',
    period:  '2023 — 2027',
    type:    'Education',
    bullets: [
      'Studying digital systems, FPGA design, EE fundamentals, and embedded software.',
      'Coursework in Verilog, circuit analysis, computer architecture, and C++.',
    ],
    stack:   ['Verilog', 'FPGA', 'C++', 'Assembly', 'Circuit Design', 'Embedded Systems'],
    logo: {
      svg: spartanSvg,
      color: '#2751a7',
      accentLight: '#e1a213',
      fillLight: '#2751a7',
      scale: 1.15,
    },
  },
];
