// ============================================================================
// VISIT SCREEN - Handles individual visit dialogue interactions
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Users, Target, BookOpen } from 'lucide-react';
import { PlaceId, Visit, VisitScore, DialogueStep } from '../types';
import { useProgress } from '../context/ProgressContext';
import { DialogueInterface } from './DialogueInterface';

interface VisitScreenProps {
  placeId: PlaceId;
  visitNumber: number;
  visit: Visit;
  onComplete: (score: VisitScore) => void;
  onBack: () => void;
}

export const VisitScreen: React.FC<VisitScreenProps> = ({
  placeId,
  visitNumber,
  visit,
  onComplete,
  onBack
}) => {
  const [showDialogue, setShowDialogue] = useState(false);
  const [startTime] = useState(Date.now());
  
  // Start dialogue after showing intro
  useEffect(() => {
    const timer = setTimeout(() => setShowDialogue(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleDialogueComplete = (mistakes: number, timeSpent: number) => {
    const score: VisitScore = {
      completed: true,
      score: Math.max(0, (1 - (mistakes * 0.1))), // Reduce score by 10% per mistake
      timeSpent: timeSpent,
      mistakes: mistakes,
      completedAt: new Date()
    };
    
    onComplete(score);
  };
  
  if (showDialogue) {
    return (
      <DialogueInterface
        dialogue={visit.dialogue}
        onComplete={handleDialogueComplete}
        onBack={onBack}
      />
    );
  }
  
  // Visit Introduction Screen
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
              <span>Back</span>
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Visit {visitNumber}: {visit.title}
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Visit Introduction Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {visit.title}
              </h2>
              <p className="text-gray-600 text-lg">
                Get ready for your German conversation practice!
              </p>
            </div>
            
            {/* Learning Objectives */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Learning Objectives</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visit.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-700">{objective}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* New Vocabulary */}
            {visit.newVocabulary.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">New Vocabulary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visit.newVocabulary.map((word, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-900">{word.german}</div>
                      <div className="text-sm text-gray-600">{word.english}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available Items */}
            {visit.availableItems && Array.isArray(visit.availableItems) && visit.availableItems.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Items</h3>
                <div className="flex flex-wrap gap-2">
                  {visit.availableItems.map((item, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• Listen carefully to the native speaker</li>
                <li>• Choose the most appropriate response</li>
                <li>• Don't worry about mistakes - they help you learn!</li>
                <li>• Take your time to think before answering</li>
              </ul>
            </div>
            
            {/* Audio Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span className="text-amber-800 font-medium">Audio Experience</span>
              </div>
              <p className="text-amber-700 text-sm mt-1">
                This visit includes audio pronunciation examples. Make sure your volume is up!
              </p>
            </div>
            
            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={() => setShowDialogue(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Conversation →
              </button>
            </div>
          </div>
          
          {/* Loading indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-2">Preparing conversation...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};