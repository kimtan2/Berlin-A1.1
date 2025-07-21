import { useState } from 'react';
import { Check, RotateCcw, Volume2 } from 'lucide-react';
import { VocabularyItem } from '../pages/Index';

interface BakeryItem {
  german: string;
  english: string;
  article: string;
}

interface BakeryDialogProps {
  items: BakeryItem[];
  onVocabularyLearned: (item: VocabularyItem) => void;
  onRestart: () => void;
}

const dialogSteps = [
  { speaker: 'seller', text: 'Guten Morgen!', english: 'Good morning!' },
  { speaker: 'user', text: 'Guten Morgen! Ich möchte {item}, bitte.', english: 'Good morning! I would like {item}, please.' },
  { speaker: 'seller', text: 'Hier ist Ihr {item}.', english: 'Here is your {item}.' },
  { speaker: 'user', text: 'Danke schön!', english: 'Thank you!' },
  { speaker: 'seller', text: 'Bitte schön. Auf Wiedersehen!', english: 'You\'re welcome. Goodbye!' },
  { speaker: 'user', text: 'Auf Wiedersehen!', english: 'Goodbye!' }
];

export const BakeryDialog = ({ items, onVocabularyLearned, onRestart }: BakeryDialogProps) => {
  const [selectedItem, setSelectedItem] = useState<BakeryItem | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleItemSelect = (item: BakeryItem) => {
    setSelectedItem(item);
    setCurrentStep(0);
    setIsCompleted(false);
    setShowTranslation(false);
  };

  const handleNext = () => {
    if (currentStep < dialogSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      if (selectedItem) {
        onVocabularyLearned({
          german: selectedItem.german,
          english: selectedItem.english,
          category: 'bakery',
          learned: false
        });
      }
    }
  };

  const handleRestart = () => {
    setSelectedItem(null);
    setCurrentStep(0);
    setIsCompleted(false);
    setShowTranslation(false);
    onRestart();
  };

  const formatText = (text: string, item: BakeryItem | null) => {
    if (!item) return text;
    return text.replace('{item}', `${item.article} ${item.german}`);
  };

  const currentDialog = dialogSteps[currentStep];
  const formattedText = selectedItem ? formatText(currentDialog.text, selectedItem) : currentDialog.text;
  const formattedEnglish = selectedItem ? formatText(currentDialog.english, selectedItem) : currentDialog.english;

  if (!selectedItem) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Was möchten Sie bestellen?</h3>
          <p className="text-sm text-gray-600">Wählen Sie ein Produkt aus:</p>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemSelect(item)}
              className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors text-left"
            >
              <div className="font-medium text-gray-900">{item.article} {item.german}</div>
              <div className="text-sm text-gray-600">{item.english}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Schritt {currentStep + 1} von {dialogSteps.length}</span>
        <span>Bestellt: {selectedItem.article} {selectedItem.german}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / dialogSteps.length) * 100}%` }}
        />
      </div>

      {/* Dialog */}
      <div className={`p-4 rounded-lg border-l-4 ${
        currentDialog.speaker === 'seller' 
          ? 'bg-blue-50 border-blue-500' 
          : 'bg-green-50 border-green-500'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium mb-1 text-gray-600">
              {currentDialog.speaker === 'seller' ? 'Verkäufer:' : 'Du:'}
            </div>
            <p className="text-lg font-medium text-gray-900 leading-relaxed">
              {formattedText}
            </p>
          </div>
          <button
            onClick={() => console.log('Playing audio for:', formattedText)}
            className={`ml-3 p-2 rounded-full transition-colors ${
              currentDialog.speaker === 'seller'
                ? 'hover:bg-blue-100'
                : 'hover:bg-green-100'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${
              currentDialog.speaker === 'seller' ? 'text-blue-600' : 'text-green-600'
            }`} />
          </button>
        </div>
      </div>

      {/* Translation Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showTranslation ? 'Übersetzung verbergen' : 'Übersetzung anzeigen'}
        </button>
      </div>

      {/* English Translation */}
      {showTranslation && (
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300">
          <p className="text-gray-700 italic">{formattedEnglish}</p>
        </div>
      )}

      {/* Vocabulary */}
      {selectedItem && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-800 mb-2">Vokabel:</h4>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-orange-900">{selectedItem.german}</span>
              <span className="text-orange-700 ml-2">→ {selectedItem.english}</span>
            </div>
            {isCompleted && <Check className="w-5 h-5 text-orange-600" />}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isCompleted ? (
          <button
            onClick={handleNext}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {currentStep < dialogSteps.length - 1 ? 'Weiter' : 'Abschließen'}
          </button>
        ) : (
          <>
            <button
              onClick={() => setSelectedItem(null)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Neues Produkt
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Wiederholen
            </button>
          </>
        )}
      </div>
    </div>
  );
};