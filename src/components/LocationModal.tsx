
import { X, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Location, VocabularyItem } from '../pages/Index';
import LanguageLearningPlatform from './LanguageLearningPlatform';
import { getTaskByLocation } from '../tasks';

interface LocationModalProps {
  location: Location;
  onClose: () => void;
  onVocabularyLearned: (item: VocabularyItem) => void;
  vocabulary: VocabularyItem[];
}

export const LocationModal = ({ location, onClose, onVocabularyLearned, vocabulary }: LocationModalProps) => {
  const [showCustomTaskEditor, setShowCustomTaskEditor] = useState(false);
  const [customTaskJSON, setCustomTaskJSON] = useState('');
  const [customTask, setCustomTask] = useState(null);
  const [jsonError, setJsonError] = useState('');

  // Get the task configuration for this location (default or custom)
  const defaultTaskConfig = getTaskByLocation(location);
  const taskConfig = customTask || defaultTaskConfig;

  // Handle custom task JSON submission
  const handleCustomTaskSubmit = () => {
    try {
      const parsedTask = JSON.parse(customTaskJSON);
      setCustomTask(parsedTask);
      setJsonError('');
      setShowCustomTaskEditor(false);
    } catch (error) {
      setJsonError('Invalid JSON format. Please check your syntax.');
    }
  };

  // Reset to default task
  const handleResetToDefault = () => {
    setCustomTask(null);
    setCustomTaskJSON('');
    setJsonError('');
    setShowCustomTaskEditor(false);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // If no task configuration is found, show an error
  if (!taskConfig) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aufgabe nicht verfügbar</h2>
          <p className="text-gray-600 mb-4">Für diesen Ort ist noch keine Aufgabe konfiguriert.</p>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    );
  }

  // Enhanced task config with context that includes vocabulary learning
  const enhancedTaskConfig = {
    ...taskConfig,
    // Add vocabulary learning integration to the context
    contextExtensions: {
      onVocabularyLearned,
      vocabulary,
      onClose
    }
  };

  return (
    <>
      {/* Main Task Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header with buttons */}
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            {/* Settings button */}
            <button
              onClick={() => setShowCustomTaskEditor(true)}
              className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-colors"
              title="Custom Task JSON"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Show custom task indicator */}
          {customTask && (
            <div className="absolute top-4 left-4 z-50 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Custom Task Active
            </div>
          )}
          
          {/* Language Learning Platform */}
          <div className="max-h-[90vh] overflow-y-auto">
            <LanguageLearningPlatform taskConfig={enhancedTaskConfig} />
          </div>
        </div>
      </div>

      {/* Custom Task JSON Editor Modal */}
      {showCustomTaskEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Custom Task JSON Editor</h3>
              <button
                onClick={() => setShowCustomTaskEditor(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Paste your custom task JSON configuration below. This will override the default task for this location.
                </p>
                
                {/* Error display */}
                {jsonError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-800 text-sm">{jsonError}</p>
                  </div>
                )}

                {/* JSON Editor */}
                <textarea
                  value={customTaskJSON}
                  onChange={(e) => setCustomTaskJSON(e.target.value)}
                  placeholder="Paste your task JSON here..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {/* Example hint */}
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Use the same structure as the existing tasks in src/tasks/ folder
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
              <div>
                {customTask && (
                  <button
                    onClick={handleResetToDefault}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCustomTaskEditor(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomTaskSubmit}
                  disabled={!customTaskJSON.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Apply Custom Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
