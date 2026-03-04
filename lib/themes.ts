export type ColorMode = 'green' | 'blue' | 'pink' | 'yellow';

export interface SlideTheme {
  id: ColorMode;
  label: string;
  darkBg: string;
  lightBg: string;
  accent: string;
  accentMid: string;
  stroke: string;
  textOnDark: string;
  textOnLight: string;
  bodyOnLight: string;
  mutedOnLight: string;
  mutedOnDark: string;
  logoOnDark: string;
  logoOnLight: string;
  agendaLeftBg: string;
  agendaDotPattern: string;
  heroDotPattern: string;
  diagramColBgs: Array<{ bg: string; text: string }>;
}

export const THEMES: Record<ColorMode, SlideTheme> = {
  green: {
    id: 'green',
    label: 'Green Paper',
    darkBg: '#002910',
    lightBg: '#EEF5F1',
    accent: '#00ff64',
    accentMid: '#008c44',
    stroke: '#d4e8da',
    textOnDark: '#ffffff',
    textOnLight: '#000d05',
    bodyOnLight: '#3a4a3e',
    mutedOnLight: '#676c79',
    mutedOnDark: 'rgba(255,255,255,0.4)',
    logoOnDark: '#ffffff',
    logoOnLight: '#001408',
    agendaLeftBg: '#CCFFE0',
    agendaDotPattern: 'rgba(0,100,40,0.25)',
    heroDotPattern: 'rgba(0,255,100,0.12)',
    diagramColBgs: [
      { bg: '#002910', text: '#00ff64' },
      { bg: '#008c44', text: '#ffffff' },
      { bg: '#00ff64', text: '#002910' },
    ],
  },
  blue: {
    id: 'blue',
    label: 'Blue Paper',
    darkBg: '#0D1B4B',
    lightBg: '#EEF2FF',
    accent: '#7EC8FF',
    accentMid: '#3D78D8',
    stroke: '#C2D0F0',
    textOnDark: '#ffffff',
    textOnLight: '#0D1B4B',
    bodyOnLight: '#1E3260',
    mutedOnLight: '#4a6090',
    mutedOnDark: 'rgba(255,255,255,0.4)',
    logoOnDark: '#ffffff',
    logoOnLight: '#0D1B4B',
    agendaLeftBg: '#D0DEFF',
    agendaDotPattern: 'rgba(61,120,216,0.15)',
    heroDotPattern: 'rgba(126,200,255,0.12)',
    diagramColBgs: [
      { bg: '#0D1B4B', text: '#7EC8FF' },
      { bg: '#3D78D8', text: '#ffffff' },
      { bg: '#7EC8FF', text: '#0D1B4B' },
    ],
  },
  pink: {
    id: 'pink',
    label: 'Pink Paper',
    darkBg: '#3D0A2A',
    lightBg: '#FFF0F8',
    accent: '#FF8AC4',
    accentMid: '#D4639A',
    stroke: '#F0C0DE',
    textOnDark: '#ffffff',
    textOnLight: '#3D0A2A',
    bodyOnLight: '#5A1A3E',
    mutedOnLight: '#705060',
    mutedOnDark: 'rgba(255,255,255,0.4)',
    logoOnDark: '#ffffff',
    logoOnLight: '#3D0A2A',
    agendaLeftBg: '#FFD8EE',
    agendaDotPattern: 'rgba(212,99,154,0.15)',
    heroDotPattern: 'rgba(255,138,196,0.12)',
    diagramColBgs: [
      { bg: '#3D0A2A', text: '#FF8AC4' },
      { bg: '#D4639A', text: '#ffffff' },
      { bg: '#FF8AC4', text: '#3D0A2A' },
    ],
  },
  yellow: {
    id: 'yellow',
    label: 'Yellow Paper',
    darkBg: '#2A1800',
    lightBg: '#FFFBEE',
    accent: '#FFD966',
    accentMid: '#C87000',
    stroke: '#EDE4C0',
    textOnDark: '#ffffff',
    textOnLight: '#2A1800',
    bodyOnLight: '#4A3000',
    mutedOnLight: '#705030',
    mutedOnDark: 'rgba(255,255,255,0.4)',
    logoOnDark: '#ffffff',
    logoOnLight: '#2A1800',
    agendaLeftBg: '#FFEDC0',
    agendaDotPattern: 'rgba(200,112,0,0.15)',
    heroDotPattern: 'rgba(255,217,102,0.12)',
    diagramColBgs: [
      { bg: '#2A1800', text: '#FFD966' },
      { bg: '#C87000', text: '#ffffff' },
      { bg: '#FFD966', text: '#2A1800' },
    ],
  },
};

export const DEFAULT_THEME = THEMES.green;
