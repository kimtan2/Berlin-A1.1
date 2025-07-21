
import { useState } from 'react';
import { BerlinMap } from '../components/BerlinMap';
import { LocationModal } from '../components/LocationModal';
import { ProgressBar } from '../components/ProgressBar';
import { VocabularyCollection } from '../components/VocabularyCollection';
import { BookOpen, Map, Award } from 'lucide-react';

export type Location = 'rewe' | 'lukas' | 'park';

export interface VocabularyItem {
  german: string;
  english: string;
  category: string;
  learned: boolean;
}

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([
    { german: 'das Brot', english: 'bread', category: 'bakery', learned: false },
    { german: 'die Milch', english: 'milk', category: 'supermarket', learned: false },
    { german: 'Guten Tag', english: 'Good day', category: 'conversation', learned: false },
  ]);
  const [currentView, setCurrentView] = useState<'map' | 'vocabulary' | 'progress'>('map');

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
  };

  const handleVocabularyLearned = (item: VocabularyItem) => {
    setVocabulary(prev => 
      prev.map(v => v.german === item.german ? { ...v, learned: true } : v)
    );
  };

  const learnedCount = vocabulary.filter(v => v.learned).length;
  const totalCount = vocabulary.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Berlin Deutsch</h1>
                <p className="text-sm text-gray-600">Lerne Deutsch in virtuellen Berlin</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                {learnedCount}/{totalCount} Wörter
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('map')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                currentView === 'map' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Karte</span>
            </button>
            <button
              onClick={() => setCurrentView('vocabulary')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                currentView === 'vocabulary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Vokabeln</span>
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                currentView === 'progress' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Fortschritt</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'map' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Willkommen in Berlin!</h2>
              <p className="text-lg text-gray-600">Klicke auf einen Ort, um Deutsch zu lernen</p>
            </div>
            <BerlinMap onLocationSelect={handleLocationSelect} />
          </div>
        )}

        {currentView === 'vocabulary' && (
          <VocabularyCollection 
            vocabulary={vocabulary} 
            onVocabularyLearned={handleVocabularyLearned}
          />
        )}

        {currentView === 'progress' && (
          <ProgressBar 
            vocabulary={vocabulary}
            learnedCount={learnedCount}
            totalCount={totalCount}
          />
        )}
      </main>

      {/* Location Modal */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={handleCloseModal}
          onVocabularyLearned={handleVocabularyLearned}
          vocabulary={vocabulary}
        />
      )}
    </div>
  );
};

export default Index;
