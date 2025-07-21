// ============================================================================
// COMPREHENSIVE TYPE DEFINITIONS FOR GERMAN LEARNING APP
// ============================================================================

export type PlaceId = 'baeckerei' | 'rewe' | 'park';

export interface VocabularyItem {
  german: string;
  english: string;
  category?: string;
  learned?: boolean;
}

export interface DialogueOption {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface DialogueStep {
  id: number;
  speaker: 'npc' | 'user';
  text?: string;
  audio?: string;
  prompt?: string;
  options?: DialogueOption[];
}

export interface Visit {
  visitNumber: number;
  title: string;
  objectives: string[];
  newVocabulary: VocabularyItem[];
  availableItems?: string[] | string;
  dialogue: DialogueStep[];
}

export interface Place {
  name: string;
  emoji: string;
  description: string;
  position: { x: number; y: number };
  totalVisits: number;
  unlockRequirement?: string;
  visits: Visit[];
}

export interface PlacesData {
  places: {
    [key in PlaceId]: Place;
  };
}

export interface VisitScore {
  completed: boolean;
  score: number;
  timeSpent: number;
  mistakes: number;
  completedAt: Date;
}

export interface UserProgress {
  currentPlace?: PlaceId;
  currentVisit?: number;
  completedVisits: {
    [placeId in PlaceId]?: number[];
  };
  visitScores: {
    [key: string]: VisitScore;
  };
  unlockedPlaces: PlaceId[];
  totalVocabularyLearned: number;
  overallProgress: number;
}

export interface ProgressContextType {
  progress: UserProgress;
  updateProgress: (update: Partial<UserProgress>) => void;
  completeVisit: (placeId: PlaceId, visitNumber: number, score: VisitScore) => void;
  isVisitCompleted: (placeId: PlaceId, visitNumber: number) => boolean;
  isPlaceUnlocked: (placeId: PlaceId) => boolean;
  getPlaceProgress: (placeId: PlaceId) => number;
  resetProgress: () => void;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentAudio: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface DialogueState {
  currentStep: number;
  selectedOptions: { [stepId: number]: string };
  mistakes: number;
  startTime: number;
  isCompleted: boolean;
}

// Component Props Interfaces
export interface BerlinMapProps {
  onLocationSelect: (placeId: PlaceId) => void;
  progress: UserProgress;
}

export interface PlaceCardProps {
  placeId: PlaceId;
  place: Place;
  progress: UserProgress;
  onClick: () => void;
}

export interface VisitScreenProps {
  placeId: PlaceId;
  visitNumber: number;
  place: Place;
  visit: Visit;
  onComplete: (score: VisitScore) => void;
  onBack: () => void;
}

export interface DialogueInterfaceProps {
  dialogue: DialogueStep[];
  onComplete: (mistakes: number, timeSpent: number) => void;
  onBack: () => void;
}

export interface ProgressTrackerProps {
  progress: UserProgress;
  places: PlacesData['places'];
}

export interface AudioPlayerProps {
  src?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: string) => void;
}

// Learning Analytics Types
export interface LearningSession {
  placeId: PlaceId;
  visitNumber: number;
  startTime: Date;
  endTime?: Date;
  mistakes: number;
  vocabulary: VocabularyItem[];
  completed: boolean;
}

export interface SkillTransfer {
  fromPlace: PlaceId;
  toPlace: PlaceId;
  transferredSkills: string[];
  detectedAt: Date;
}

// Navigation Types
export type AppView = 'map' | 'place' | 'visit';

export interface NavigationState {
  currentView: AppView;
  placeId?: PlaceId;
  visitNumber?: number;
}

// Utility Types
export type PlaceWithProgress = Place & {
  completedVisits: number;
  totalVisits: number;
  progressPercentage: number;
  isUnlocked: boolean;
  nextVisit?: number;
};

export type VisitWithStatus = Visit & {
  isCompleted: boolean;
  isUnlocked: boolean;
  score?: VisitScore;
};

// Error Types
export interface AppError {
  code: string;
  message: string;
  context?: any;
}

// Local Storage Types
export interface StorageKeys {
  USER_PROGRESS: 'german_app_progress';
  SETTINGS: 'german_app_settings';
  AUDIO_CACHE: 'german_app_audio_cache';
}

export interface AppSettings {
  audioEnabled: boolean;
  volume: number;
  autoplay: boolean;
  showTranslations: boolean;
  theme: 'light' | 'dark';
}