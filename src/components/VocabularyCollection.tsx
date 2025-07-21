
import { useState } from 'react';
import { BookOpen, Check, Volume2, Filter } from 'lucide-react';
import { VocabularyItem } from '../pages/Index';

interface VocabularyCollectionProps {
  vocabulary: VocabularyItem[];
  onVocabularyLearned: (item: VocabularyItem) => void;
}

export const VocabularyCollection = ({ vocabulary, onVocabularyLearned }: VocabularyCollectionProps) => {
  const [filter, setFilter] = useState<'all' | 'learned' | 'unlearned'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(vocabulary.map(v => v.category)));
  
  const filteredVocabulary = vocabulary.filter(item => {
    const matchesFilter = filter === 'all' || 
      (filter === 'learned' && item.learned) || 
      (filter === 'unlearned' && !item.learned);
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesFilter && matchesCategory;
  });

  const playAudio = (word: string) => {
    console.log('Playing audio for:', word);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Meine Vokabeln</h2>
        <p className="text-lg text-gray-600">Sammle und wiederhole deine gelernten Wörter</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'learned', 'unlearned'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === status 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Alle' : status === 'learned' ? 'Gelernt' : 'Ungelernt'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Alle Kategorien</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'supermarket' ? 'Supermarkt' : 
                 category === 'bakery' ? 'Bäckerei' : 
                 category === 'conversation' ? 'Konversation' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Gesamt</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{vocabulary.length}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Gelernt</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {vocabulary.filter(v => v.learned).length}
          </p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-orange-600"></div>
            <span className="text-sm font-medium text-orange-800">Zu lernen</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">
            {vocabulary.filter(v => !v.learned).length}
          </p>
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocabulary.map((item, index) => (
          <div
            key={index}
            className={`bg-white p-4 rounded-lg shadow-md border transition-all hover:shadow-lg ${
              item.learned ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.german}</h3>
                  <button
                    onClick={() => playAudio(item.german)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <p className="text-gray-600">{item.english}</p>
              </div>
              
              {item.learned && (
                <div className="bg-green-100 p-1 rounded-full">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.category === 'supermarket' ? 'bg-red-100 text-red-800' :
                item.category === 'bakery' ? 'bg-amber-100 text-amber-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.category === 'supermarket' ? 'Supermarkt' : 
                 item.category === 'bakery' ? 'Bäckerei' : 
                 'Konversation'}
              </span>
              
              {!item.learned && (
                <button
                  onClick={() => onVocabularyLearned(item)}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                >
                  Als gelernt markieren
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVocabulary.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Vokabeln gefunden</h3>
          <p className="text-gray-600">Ändere deine Filter oder besuche mehr Orte in Berlin!</p>
        </div>
      )}
    </div>
  );
};
