// ============================================================================
// PLACE SELECTION SCREEN - Shows available visits for a specific place
// ============================================================================

import React from 'react';
import { ArrowLeft, Play, CheckCircle, Lock, Star } from 'lucide-react';
import { PlaceId, Place, Visit } from '../types';
import { usePlaceProgress, useVisitProgress } from '../context/ProgressContext';

interface PlaceScreenProps {
  placeId: PlaceId;
  place: Place;
  onBack: () => void;
  onVisitSelect: (visitNumber: number) => void;
}

interface VisitCardProps {
  visit: Visit;
  placeId: PlaceId;
  onSelect: () => void;
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, placeId, onSelect }) => {
  const { isCompleted, score } = useVisitProgress(placeId, visit.visitNumber);
  const { isUnlocked } = usePlaceProgress(placeId);
  
  // A visit is available if the place is unlocked and either:
  // 1. It's visit 1, or
  // 2. The previous visit is completed
  const isPreviousCompleted = visit.visitNumber === 1 || 
    useVisitProgress(placeId, visit.visitNumber - 1).isCompleted;
  
  const isAvailable = isUnlocked && isPreviousCompleted;
  
  return (
    <div
      className={`group bg-white rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
        isCompleted 
          ? 'border-green-200 bg-green-50/30' 
          : isAvailable 
            ? 'border-gray-200 hover:border-blue-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1' 
            : 'border-gray-100 opacity-60 cursor-not-allowed bg-gray-50'
      }`}
      onClick={() => isAvailable && onSelect()}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              isCompleted 
                ? 'bg-green-500 text-white' 
                : isAvailable 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-500'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-6 h-6" />
              ) : isAvailable ? (
                <Play className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Visit {visit.visitNumber}
              </h3>
              <p className="text-sm text-gray-600">
                {visit.title}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          {isCompleted && score && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(3)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${score.score > (i * 0.33) ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-500">
                {Math.round(score.score * 100)}%
              </span>
            </div>
          )}
        </div>
        
        {/* Learning Objectives */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</h4>
          <div className="flex flex-wrap gap-2">
            {visit.objectives.map((objective, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
              >
                {objective}
              </span>
            ))}
          </div>
        </div>
        
        {/* New Vocabulary Preview */}
        {visit.newVocabulary.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              New Vocabulary ({visit.newVocabulary.length} words):
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              {visit.newVocabulary.slice(0, 3).map((word, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-medium">{word.german}</span>
                  <span className="text-gray-500">{word.english}</span>
                </div>
              ))}
              {visit.newVocabulary.length > 3 && (
                <div className="text-gray-500">+{visit.newVocabulary.length - 3} more...</div>
              )}
            </div>
          </div>
        )}
        
        {/* Completion Info */}
        {isCompleted && score && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {Math.round((score.timeSpent / 1000) / 60)}m
                </div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {score.mistakes}
                </div>
                <div className="text-xs text-gray-500">Mistakes</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {score.completedAt ? new Date(score.completedAt).toLocaleDateString() : '-'}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => isAvailable && onSelect()}
            disabled={!isAvailable}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isCompleted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : isAvailable
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isCompleted ? 'Replay Visit' : isAvailable ? 'Start Visit' : 'Locked'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const PlaceScreen: React.FC<PlaceScreenProps> = ({ 
  placeId, 
  place, 
  onBack, 
  onVisitSelect 
}) => {
  const placeProgress = usePlaceProgress(placeId);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Map</span>
            </button>
            
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{place.emoji}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{place.name}</h1>
                  <p className="text-gray-600">{place.description}</p>
                </div>
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-2xl font-bold text-blue-600">
                {placeProgress.progressPercentage}%
              </div>
              <div className="text-xs text-gray-500">
                {placeProgress.completedVisits.length}/{placeProgress.totalVisits} visits
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${placeProgress.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Visits</h2>
          <p className="text-gray-600">
            Complete visits in order to progress through your German learning journey.
          </p>
        </div>
        
        {/* Visit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {place.visits.map((visit) => (
            <VisitCard
              key={visit.visitNumber}
              visit={visit}
              placeId={placeId}
              onSelect={() => onVisitSelect(visit.visitNumber)}
            />
          ))}
        </div>
        
        {/* Next Steps */}
        {placeProgress.nextVisit && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-6 py-3 rounded-full">
              <Play className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">
                Ready for Visit {placeProgress.nextVisit}
              </span>
            </div>
          </div>
        )}
        
        {/* Completion Celebration */}
        {placeProgress.progressPercentage === 100 && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center space-y-2 bg-green-100 px-8 py-6 rounded-2xl">
              <div className="text-4xl">🎉</div>
              <div className="text-green-700 font-bold text-lg">
                Congratulations!
              </div>
              <div className="text-green-600 text-sm">
                You've completed all visits for {place.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};