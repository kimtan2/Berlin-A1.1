// ============================================================================
// LOCAL STORAGE UTILITIES FOR GERMAN LEARNING APP
// ============================================================================

import { UserProgress, PlaceId, VisitScore } from '../types';

const STORAGE_KEYS = {
  USER_PROGRESS: 'german_app_progress',
  SETTINGS: 'german_app_settings',
  AUDIO_CACHE: 'german_app_audio_cache',
} as const;

// Default progress state
const DEFAULT_PROGRESS: UserProgress = {
  completedVisits: {
    baeckerei: [],
    rewe: [],
    park: []
  },
  visitScores: {},
  unlockedPlaces: ['baeckerei'], // Bakery is unlocked by default
  totalVocabularyLearned: 0,
  overallProgress: 0
};

/**
 * Load user progress from localStorage
 */
export const loadProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (!stored) {
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(stored);
    
    // Ensure all required fields exist with defaults
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedVisits: {
        ...DEFAULT_PROGRESS.completedVisits,
        ...parsed.completedVisits
      }
    };
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
    return DEFAULT_PROGRESS;
  }
};

/**
 * Save user progress to localStorage
 */
export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
};

/**
 * Reset all progress (clear localStorage)
 */
export const resetProgress = (): UserProgress => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
    return DEFAULT_PROGRESS;
  } catch (error) {
    console.error('Error resetting progress:', error);
    return DEFAULT_PROGRESS;
  }
};

/**
 * Check if a specific visit is completed
 */
export const isVisitCompleted = (progress: UserProgress, placeId: PlaceId, visitNumber: number): boolean => {
  const completedVisits = progress.completedVisits[placeId] || [];
  return completedVisits.includes(visitNumber);
};

/**
 * Check if a place is unlocked
 */
export const isPlaceUnlocked = (progress: UserProgress, placeId: PlaceId): boolean => {
  return progress.unlockedPlaces.includes(placeId);
};

/**
 * Get progress percentage for a specific place
 */
export const getPlaceProgress = (progress: UserProgress, placeId: PlaceId, totalVisits: number): number => {
  const completedVisits = progress.completedVisits[placeId] || [];
  return Math.round((completedVisits.length / totalVisits) * 100);
};

/**
 * Calculate overall progress across all places
 */
export const calculateOverallProgress = (progress: UserProgress): number => {
  const totalPossibleVisits = 17; // 6 + 6 + 5 across all places
  const totalCompleted = Object.values(progress.completedVisits)
    .flat()
    .length;
  
  return Math.round((totalCompleted / totalPossibleVisits) * 100);
};

/**
 * Add a completed visit and update progress
 */
export const addCompletedVisit = (
  progress: UserProgress, 
  placeId: PlaceId, 
  visitNumber: number, 
  score: VisitScore
): UserProgress => {
  const updatedCompletedVisits = { ...progress.completedVisits };
  const placeVisits = updatedCompletedVisits[placeId] || [];
  
  // Add visit if not already completed
  if (!placeVisits.includes(visitNumber)) {
    updatedCompletedVisits[placeId] = [...placeVisits, visitNumber].sort((a, b) => a - b);
  }

  // Update visit scores
  const visitKey = `${placeId}_${visitNumber}`;
  const updatedScores = {
    ...progress.visitScores,
    [visitKey]: score
  };

  // Check for place unlocks
  const updatedUnlockedPlaces = [...progress.unlockedPlaces];
  
  // Unlock Rewe after completing Bäckerei Visit 3
  if (placeId === 'baeckerei' && visitNumber >= 3 && !updatedUnlockedPlaces.includes('rewe')) {
    updatedUnlockedPlaces.push('rewe');
  }
  
  // Unlock Park after completing Bäckerei Visit 2
  if (placeId === 'baeckerei' && visitNumber >= 2 && !updatedUnlockedPlaces.includes('park')) {
    updatedUnlockedPlaces.push('park');
  }

  const updatedProgress: UserProgress = {
    ...progress,
    completedVisits: updatedCompletedVisits,
    visitScores: updatedScores,
    unlockedPlaces: updatedUnlockedPlaces
  };

  // Calculate new overall progress
  updatedProgress.overallProgress = calculateOverallProgress(updatedProgress);

  return updatedProgress;
};

/**
 * Get next available visit for a place
 */
export const getNextVisit = (progress: UserProgress, placeId: PlaceId, totalVisits: number): number | null => {
  const completedVisits = progress.completedVisits[placeId] || [];
  
  for (let i = 1; i <= totalVisits; i++) {
    if (!completedVisits.includes(i)) {
      return i;
    }
  }
  
  return null; // All visits completed
};

/**
 * Export/backup progress as JSON
 */
export const exportProgress = (): string => {
  const progress = loadProgress();
  return JSON.stringify(progress, null, 2);
};

/**
 * Import/restore progress from JSON
 */
export const importProgress = (jsonString: string): boolean => {
  try {
    const progress = JSON.parse(jsonString) as UserProgress;
    saveProgress(progress);
    return true;
  } catch (error) {
    console.error('Error importing progress:', error);
    return false;
  }
};

/**
 * Get learning statistics
 */
export const getLearningStats = (progress: UserProgress) => {
  const totalVisits = Object.values(progress.completedVisits).flat().length;
  const totalMistakes = Object.values(progress.visitScores)
    .reduce((sum, score) => sum + score.mistakes, 0);
  const totalTimeSpent = Object.values(progress.visitScores)
    .reduce((sum, score) => sum + score.timeSpent, 0);
  const averageScore = Object.values(progress.visitScores)
    .reduce((sum, score) => sum + score.score, 0) / Math.max(Object.keys(progress.visitScores).length, 1);

  return {
    totalVisits,
    totalMistakes,
    totalTimeSpent: Math.round(totalTimeSpent / 1000), // Convert to seconds
    averageScore: Math.round(averageScore * 100) / 100
  };
};