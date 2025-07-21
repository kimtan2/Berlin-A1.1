// ============================================================================
// PROGRESS CONTEXT FOR GERMAN LEARNING APP
// ============================================================================

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UserProgress, ProgressContextType, PlaceId, VisitScore } from '../types';
import { 
  loadProgress, 
  saveProgress, 
  resetProgress as resetStoredProgress,
  addCompletedVisit,
  isVisitCompleted as checkVisitCompleted,
  isPlaceUnlocked as checkPlaceUnlocked,
  getPlaceProgress as calculatePlaceProgress
} from '../utils/localStorage';

// Progress Actions
type ProgressAction = 
  | { type: 'LOAD_PROGRESS'; payload: UserProgress }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'COMPLETE_VISIT'; payload: { placeId: PlaceId; visitNumber: number; score: VisitScore } }
  | { type: 'RESET_PROGRESS' }
  | { type: 'SET_CURRENT_PLACE'; payload: PlaceId }
  | { type: 'SET_CURRENT_VISIT'; payload: number };

// Progress Reducer
const progressReducer = (state: UserProgress, action: ProgressAction): UserProgress => {
  switch (action.type) {
    case 'LOAD_PROGRESS':
      return action.payload;
    
    case 'UPDATE_PROGRESS':
      return { ...state, ...action.payload };
    
    case 'COMPLETE_VISIT':
      return addCompletedVisit(
        state,
        action.payload.placeId,
        action.payload.visitNumber,
        action.payload.score
      );
    
    case 'RESET_PROGRESS':
      return resetStoredProgress();
    
    case 'SET_CURRENT_PLACE':
      return { ...state, currentPlace: action.payload };
    
    case 'SET_CURRENT_VISIT':
      return { ...state, currentVisit: action.payload };
    
    default:
      return state;
  }
};

// Context Creation
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Provider Props
interface ProgressProviderProps {
  children: ReactNode;
}

// Progress Provider Component
export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [progress, dispatch] = useReducer(progressReducer, loadProgress());

  // Load progress on mount
  useEffect(() => {
    const storedProgress = loadProgress();
    dispatch({ type: 'LOAD_PROGRESS', payload: storedProgress });
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Context value with all required methods
  const contextValue: ProgressContextType = {
    progress,
    
    updateProgress: (update: Partial<UserProgress>) => {
      dispatch({ type: 'UPDATE_PROGRESS', payload: update });
    },
    
    completeVisit: (placeId: PlaceId, visitNumber: number, score: VisitScore) => {
      dispatch({ 
        type: 'COMPLETE_VISIT', 
        payload: { placeId, visitNumber, score } 
      });
    },
    
    isVisitCompleted: (placeId: PlaceId, visitNumber: number): boolean => {
      return checkVisitCompleted(progress, placeId, visitNumber);
    },
    
    isPlaceUnlocked: (placeId: PlaceId): boolean => {
      return checkPlaceUnlocked(progress, placeId);
    },
    
    getPlaceProgress: (placeId: PlaceId): number => {
      // Get total visits for each place
      const totalVisitsByPlace = {
        baeckerei: 6,
        rewe: 6,
        park: 5
      };
      return calculatePlaceProgress(progress, placeId, totalVisitsByPlace[placeId]);
    },
    
    resetProgress: () => {
      dispatch({ type: 'RESET_PROGRESS' });
    }
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};

// Custom hook to use progress context
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

// Custom hook for place-specific progress
export const usePlaceProgress = (placeId: PlaceId) => {
  const { progress, isPlaceUnlocked, getPlaceProgress } = useProgress();
  
  const completedVisits = progress.completedVisits[placeId] || [];
  const isUnlocked = isPlaceUnlocked(placeId);
  const progressPercentage = getPlaceProgress(placeId);
  
  // Get next available visit
  const totalVisitsByPlace = {
    baeckerei: 6,
    rewe: 6,
    park: 5
  };
  
  const nextVisit = (() => {
    const totalVisits = totalVisitsByPlace[placeId];
    for (let i = 1; i <= totalVisits; i++) {
      if (!completedVisits.includes(i)) {
        return i;
      }
    }
    return null; // All completed
  })();
  
  return {
    completedVisits,
    isUnlocked,
    progressPercentage,
    nextVisit,
    totalVisits: totalVisitsByPlace[placeId]
  };
};

// Custom hook for visit-specific progress
export const useVisitProgress = (placeId: PlaceId, visitNumber: number) => {
  const { isVisitCompleted, progress } = useProgress();
  
  const isCompleted = isVisitCompleted(placeId, visitNumber);
  const visitKey = `${placeId}_${visitNumber}`;
  const score = progress.visitScores[visitKey];
  
  return {
    isCompleted,
    score
  };
};

// Custom hook for overall learning statistics
export const useLearningStats = () => {
  const { progress } = useProgress();
  
  const totalVisits = Object.values(progress.completedVisits).flat().length;
  const totalPossibleVisits = 17; // 6 + 6 + 5
  
  const completedScores = Object.values(progress.visitScores);
  const totalMistakes = completedScores.reduce((sum, score) => sum + score.mistakes, 0);
  const totalTimeSpent = completedScores.reduce((sum, score) => sum + score.timeSpent, 0);
  const averageScore = completedScores.length > 0 
    ? completedScores.reduce((sum, score) => sum + score.score, 0) / completedScores.length
    : 0;
  
  const vocabularyLearned = totalVisits * 4; // Approximately 4 new words per visit
  
  return {
    totalVisits,
    totalPossibleVisits,
    progressPercentage: progress.overallProgress,
    totalMistakes,
    totalTimeSpent: Math.round(totalTimeSpent / 1000), // Convert to seconds
    averageScore: Math.round(averageScore * 100),
    vocabularyLearned,
    placesUnlocked: progress.unlockedPlaces.length
  };
};