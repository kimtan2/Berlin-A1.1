// ============================================================================
// MAIN APP COMPONENT - Handles routing between map, place, and visit screens
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Map, Award, Settings, Home } from 'lucide-react';
import { PlaceId, PlacesData } from '../types';
import { useProgress, useLearningStats } from '../context/ProgressContext';
import { BerlinMap } from '../components/BerlinMap';
import { PlaceScreen } from '../components/PlaceScreen';
import { VisitScreen } from '../components/VisitScreen';
import placesData from '../data/content.json';

type AppView = 'map' | 'place' | 'visit' | 'progress' | 'vocabulary';

const MainApp: React.FC = () => {
  const { placeId, visitNumber } = useParams<{ placeId?: PlaceId; visitNumber?: string }>();
  const navigate = useNavigate();
  const { completeVisit } = useProgress();
  const stats = useLearningStats();
  
  const [currentView, setCurrentView] = useState<AppView>('map');
  
  // Determine current view based on URL params
  useEffect(() => {
    if (placeId && visitNumber) {
      setCurrentView('visit');
    } else if (placeId) {
      setCurrentView('place');
    } else {
      setCurrentView('map');
    }
  }, [placeId, visitNumber]);
  
  // Get places data
  const places = (placesData as PlacesData).places;
  const currentPlace = placeId ? places[placeId] : null;
  const currentVisit = currentPlace && visitNumber ? 
    currentPlace.visits.find(v => v.visitNumber === parseInt(visitNumber)) : null;
  
  // Navigation handlers
  const handleLocationSelect = (selectedPlaceId: PlaceId) => {
    navigate(`/place/${selectedPlaceId}`);
  };
  
  const handleVisitSelect = (selectedVisitNumber: number) => {
    if (placeId) {
      navigate(`/place/${placeId}/visit/${selectedVisitNumber}`);
    }
  };
  
  const handleBackToMap = () => {
    navigate('/');
  };
  
  const handleBackToPlace = () => {
    if (placeId) {
      navigate(`/place/${placeId}`);
    }
  };
  
  const handleVisitComplete = (score: any) => {
    if (placeId && visitNumber) {
      completeVisit(placeId, parseInt(visitNumber), score);
      
      // Navigate back to place after brief delay
      setTimeout(() => {
        navigate(`/place/${placeId}`);
      }, 1000);
    }
  };
  
  const handleTabChange = (view: AppView) => {
    setCurrentView(view);
    if (view === 'map') {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deutsch in Berlin</h1>
                <p className="text-sm text-gray-600">Interactive German Learning Experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                {stats.vocabularyLearned} words learned
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {stats.progressPercentage}% complete
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {currentView !== 'visit' && (
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => handleTabChange('map')}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  currentView === 'map' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Berlin Map</span>
              </button>
              <button
                onClick={() => handleTabChange('vocabulary')}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  currentView === 'vocabulary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Vocabulary</span>
              </button>
              <button
                onClick={() => handleTabChange('progress')}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  currentView === 'progress' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Progress</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'map' && (
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Berlin!</h2>
                <p className="text-lg text-gray-600">Click on a location to start your German learning journey</p>
              </div>
              <BerlinMap onLocationSelect={handleLocationSelect} />
            </div>
          </div>
        )}
        
        {currentView === 'place' && placeId && currentPlace && (
          <PlaceScreen
            placeId={placeId}
            place={currentPlace}
            onBack={handleBackToMap}
            onVisitSelect={handleVisitSelect}
          />
        )}
        
        {currentView === 'visit' && placeId && currentPlace && currentVisit && visitNumber && (
          <VisitScreen
            placeId={placeId}
            visitNumber={parseInt(visitNumber)}
            visit={currentVisit}
            onComplete={handleVisitComplete}
            onBack={handleBackToPlace}
          />
        )}
        
        {currentView === 'vocabulary' && (
          <VocabularyView />
        )}
        
        {currentView === 'progress' && (
          <ProgressView />
        )}
      </main>
    </div>
  );
};

// Vocabulary View Component
const VocabularyView: React.FC = () => {
  const stats = useLearningStats();
  const places = (placesData as PlacesData).places;
  
  // Collect all vocabulary from visited places
  const allVocabulary = Object.entries(places).flatMap(([placeId, place]) =>
    place.visits.flatMap(visit => 
      visit.newVocabulary.map(word => ({
        ...word,
        place: place.name,
        visitNumber: visit.visitNumber
      }))
    )
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Vocabulary</h2>
          <p className="text-gray-600">Words you've learned on your German journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allVocabulary.map((word, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="font-bold text-lg text-gray-900">{word.german}</div>
              <div className="text-gray-600 mb-2">{word.english}</div>
              <div className="text-xs text-gray-500">
                From {word.place} - Visit {word.visitNumber}
              </div>
            </div>
          ))}
        </div>
        
        {allVocabulary.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No vocabulary yet</h3>
            <p className="text-gray-400">Complete visits to start building your German vocabulary!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Progress View Component
const ProgressView: React.FC = () => {
  const stats = useLearningStats();
  const { progress } = useProgress();
  const places = (placesData as PlacesData).places;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Learning Progress</h2>
          <p className="text-gray-600">Track your German learning achievements</p>
        </div>
        
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.progressPercentage}%</div>
            <div className="text-gray-600">Overall Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalVisits}</div>
            <div className="text-gray-600">Visits Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.vocabularyLearned}</div>
            <div className="text-gray-600">Words Learned</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.placesUnlocked}</div>
            <div className="text-gray-600">Places Unlocked</div>
          </div>
        </div>
        
        {/* Place Progress */}
        <div className="space-y-6">
          {Object.entries(places).map(([placeId, place]) => {
            const placeProgress = progress.completedVisits[placeId as PlaceId] || [];
            const progressPercentage = Math.round((placeProgress.length / place.totalVisits) * 100);
            const isUnlocked = progress.unlockedPlaces.includes(placeId as PlaceId);
            
            return (
              <div key={placeId} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{place.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
                      <p className="text-gray-600 text-sm">{place.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{progressPercentage}%</div>
                    <div className="text-xs text-gray-500">{placeProgress.length}/{place.totalVisits} visits</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                {!isUnlocked && (
                  <div className="mt-2 text-xs text-gray-500">
                    🔒 Complete more visits in other places to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainApp;