import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// TOOLS SYSTEM - Reusable modular components
// ============================================================================

// Color mapping for Tailwind CSS classes
const COLOR_CLASSES = {
  amber: {
    bg50: 'bg-amber-50',
    bg100: 'bg-amber-100',
    border200: 'border-amber-200',
    border300: 'border-amber-300',
    border400: 'border-amber-400',
    text600: 'text-amber-600',
    text800: 'text-amber-800',
    bg600: 'bg-amber-600',
    bg700: 'bg-amber-700'
  },
  red: {
    bg50: 'bg-red-50',
    bg100: 'bg-red-100',
    border200: 'border-red-200',
    border300: 'border-red-300',
    border400: 'border-red-400',
    text600: 'text-red-600',
    text800: 'text-red-800',
    bg600: 'bg-red-600',
    bg700: 'bg-red-700'
  },
  green: {
    bg50: 'bg-green-50',
    bg100: 'bg-green-100',
    border200: 'border-green-200',
    border300: 'border-green-300',
    border400: 'border-green-400',
    text600: 'text-green-600',
    text800: 'text-green-800',
    bg600: 'bg-green-600',
    bg700: 'bg-green-700'
  }
};

const TOOL_REGISTRY = {
  item_selector: ({ config, onResult, context }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    
    const handleSelect = (item) => {
      setSelectedItem(item);
      onResult({ selectedItem: item, action: 'item_selected' });
    };

    const colors = COLOR_CLASSES[context.theme.primaryColor] || COLOR_CLASSES.amber;

    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-center">{config.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {config.items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelect(item)}
              className={`${colors.bg50} hover:${colors.bg100} border-2 ${colors.border200} hover:${colors.border400} rounded-lg p-4 text-center transition-all transform hover:scale-105`}
            >
              <div className="text-3xl mb-2">{item.display.split(' ')[0]}</div>
              <div className={`font-semibold ${colors.text800}`}>{item.display.split(' ')[1]}</div>
              {item.price && <div className="text-sm text-gray-600 mt-1">{item.price}</div>}
            </button>
          ))}
        </div>
      </div>
    );
  },

  conversation_display: ({ config, context }) => {
    const conversationRef = useRef(null);

    useEffect(() => {
      if (conversationRef.current && config.autoScroll !== false) {
        conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
      }
    }, [context.conversationHistory]);

    if (!config.visible) return null;

    return (
      <div 
        ref={conversationRef} 
        className="overflow-y-auto p-6 space-y-4"
        style={{ height: config.height || '280px' }}
      >
        {context.conversationHistory.map((message) => (
          <div key={message.id} className={`flex items-start ${message.speaker === 'Du' ? 'justify-end' : ''}`}>
            {message.speaker !== 'Du' && (
              <div className={`${context.theme.characterBg} rounded-full p-3 mr-4 flex-shrink-0`}>
                <div className="text-2xl">{context.character.emoji}</div>
              </div>
            )}
            
            <div className={`max-w-md ${message.speaker === 'Du' ? 'order-2' : ''}`}>
              <div className={`${message.speaker === 'Du' ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg p-4 inline-block`}>
                <div className={`font-semibold ${message.speaker === 'Du' ? 'text-blue-800' : (COLOR_CLASSES[context.theme.primaryColor] || COLOR_CLASSES.amber).text800} mb-1`}>
                  {message.speaker === 'Du' ? 'Du' : `${context.character.name} (${context.character.role})`}:
                </div>
                <div className="text-lg">{message.message}</div>
              </div>
            </div>

            {message.speaker === 'Du' && (
              <div className="bg-blue-100 rounded-full p-3 ml-4 flex-shrink-0">
                <div className="text-2xl">🙋‍♂️</div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  },

  character_message: ({ config, context, onResult }) => {
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
      if (!hasShown) {
        const message = typeof config.message === 'function' 
          ? config.message(context.selectedItem, context) 
          : config.message;
        
        context.addToConversation(context.character.role, message);
        setHasShown(true);
        
        // Only call onResult if autoAdvance is explicitly true
        if (config.autoAdvance === true) {
          setTimeout(() => onResult({ action: 'message_shown' }), config.delay || 500);
        }
      }
    }, [hasShown, config, context, onResult]);

    return null; // This tool doesn't render UI, it just adds to conversation
  },

  options_selector: ({ config, onResult, context }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelect = (option) => {
      setSelectedOption(option);
      context.addToConversation('Du', option.text);
      
      setTimeout(() => {
        onResult({ selectedOption: option, action: 'option_selected' });
      }, config.responseDelay || 1000);
    };

    return (
      <div className="border-t bg-gray-50 p-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="text-lg font-semibold text-blue-800">
            {config.instruction}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {config.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={selectedOption}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              {option.emoji && <span>{option.emoji}</span>}
              <span>"{option.text}"</span>
            </button>
          ))}
        </div>
      </div>
    );
  },

  sentence_builder: ({ config, onResult, context }) => {
    const [builderState, setBuilderState] = useState({});
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      // Initialize with context data
      if (context.selectedItem && config.components.some(c => c.source)) {
        setBuilderState(prev => ({
          ...prev,
          item: context.selectedItem.name
        }));
      }
    }, [context.selectedItem, config.components]);

    const handleComponentSelect = (componentId, option) => {
      setBuilderState(prev => ({
        ...prev,
        [componentId]: option.text
      }));
    };

    const buildSentence = useCallback(() => {
      if (config.buildLogic) {
        return config.buildLogic(builderState, context.selectedItem, context);
      }
      return '';
    }, [builderState, config.buildLogic, context]);

    const submitSentence = () => {
      const sentence = buildSentence();
      if (sentence) {
        context.addToConversation('Du', sentence);
        setIsComplete(true);
        
        setTimeout(() => {
          onResult({ 
            sentence, 
            builderState, 
            action: 'sentence_built' 
          });
        }, config.responseDelay || 1000);
      }
    };

    const sentence = buildSentence();
    const canSubmit = sentence && !isComplete;
    const colors = COLOR_CLASSES[context.theme.primaryColor] || COLOR_CLASSES.amber;

    return (
      <div className="border-t bg-gray-50 p-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="text-lg font-semibold text-blue-800">
            {config.instruction}
          </div>
        </div>

        <div className="space-y-6">
          {config.components.map((component, index) => (
            <div key={component.id}>
              <h4 className="font-semibold text-gray-700 mb-3">{component.label}</h4>
              
              {component.type === 'auto_filled' ? (
                <div className={`${colors.bg100} border-2 ${colors.border300} rounded-lg px-4 py-2 inline-block`}>
                  <span className={`font-semibold ${colors.text800}`}>
                    {component.source === 'selectedItem.name' ? context.selectedItem?.name : component.value}
                  </span>
                  <span className="text-xs text-gray-600 ml-2">
                    ({context.selectedItem?.display})
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {component.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => handleComponentSelect(component.id, option)}
                      disabled={isComplete}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        builderState[component.id] === option.text
                          ? 'bg-green-100 border-green-400 text-green-800'
                          : 'bg-gray-50 border-gray-300 hover:border-green-400'
                      } disabled:opacity-50`}
                    >
                      <div className="font-semibold">{option.text}</div>
                      <div className="text-xs text-gray-500">{option.explanation}</div>
                      {option.pattern && <div className="text-xs text-blue-500 mt-1">{option.pattern}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Sentence Preview */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Dein Satz:</h4>
            <div className="text-lg font-mono bg-white p-3 rounded border mb-3">
              {sentence || "Wähle alle Teile aus..."}
            </div>
            {canSubmit && (
              <button
                onClick={submitSentence}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Satz sagen! 🗣️
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },

  completion_message: ({ config, context }) => {
    const completion = typeof config.content === 'function' 
      ? config.content(context.selectedItem, context)
      : config.content;

    return (
      <div className="text-center p-6">
        <div className="bg-green-100 border border-green-300 rounded-lg p-6 mb-6">
          <div className="text-4xl mb-3">{completion.emoji}</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">{completion.title}</h3>
          <p className="text-green-700">{completion.message}</p>
        </div>
        
        <div className="space-x-4">
          {config.actions?.map((action, index) => (
            <button
              key={index}
              onClick={() => action.handler(context)}
              className={`${action.className} font-bold py-3 px-6 rounded-lg transition-colors`}
            >
              {action.text}
            </button>
          ))}
        </div>
      </div>
    );
  },

  progress_indicator: ({ config, context }) => {
    if (!config.visible) return null;

    const progress = (context.currentStepIndex + 1) / context.totalSteps * 100;
    const colors = COLOR_CLASSES[context.theme.primaryColor] || COLOR_CLASSES.amber;

    return (
      <div className="bg-white border-t p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{config.label || 'Fortschritt'}</span>
          <span>{context.currentStepIndex + 1} / {context.totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${colors.bg600} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }
};

// ============================================================================
// MAIN LANGUAGE LEARNING PLATFORM
// ============================================================================

const LanguageLearningPlatform = ({ taskConfig }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [globalContext, setGlobalContext] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Create context object that tools can access
  const context = {
    ...globalContext,
    conversationHistory,
    currentStepIndex,
    totalSteps: taskConfig.workflow.length,
    theme: taskConfig.theme,
    character: taskConfig.character,
    selectedItem: globalContext.selectedItem,
    addToConversation: (speaker, message) => {
      setConversationHistory(prev => [...prev, {
        id: Date.now() + Math.random(),
        speaker,
        message,
        timestamp: new Date()
      }]);
    }
  };

  const currentStep = taskConfig.workflow[currentStepIndex];

  // Handle tool results and step progression
  const handleToolResult = useCallback((result) => {
    // Update global context with result data
    setGlobalContext(prev => ({ ...prev, ...result }));

    // Check if we should advance to next step
    if (result.action && currentStep.advanceOn?.includes(result.action)) {
      if (currentStepIndex < taskConfig.workflow.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  }, [currentStep, currentStepIndex, taskConfig.workflow.length]);

  // Initialize task
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      if (taskConfig.initialization) {
        setGlobalContext(taskConfig.initialization);
      }
    }
  }, [isInitialized, taskConfig.initialization]);

  // Reset function
  const resetTask = () => {
    setCurrentStepIndex(0);
    setConversationHistory([]);
    setGlobalContext(taskConfig.initialization || {});
    setIsInitialized(false);
  };

  // Add reset to context
  const contextWithReset = { ...context, resetTask };
  const colors = COLOR_CLASSES[taskConfig.theme.primaryColor] || COLOR_CLASSES.amber;

  if (!isInitialized) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${taskConfig.theme.backgroundGradient} flex items-center justify-center p-4`}>
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{taskConfig.emoji}</div>
          <h1 className={`text-3xl font-bold ${colors.text800} mb-2`}>{taskConfig.title}</h1>
          <p className="text-gray-600 mb-6">{taskConfig.description}</p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
            <h3 className="font-semibold text-blue-800 mb-2">Lernziel:</h3>
            <p className="text-blue-700">{taskConfig.learningObjective}</p>
          </div>
          <button 
            onClick={() => setIsInitialized(true)}
            className={`${colors.bg600} hover:${colors.bg700} text-white font-bold py-3 px-6 rounded-lg transition-colors`}
          >
            Beginnen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${taskConfig.theme.backgroundGradient} p-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`${colors.bg600} text-white p-4 flex justify-between items-center`}>
            <h1 className="text-2xl font-bold">{taskConfig.emoji} {taskConfig.title}</h1>
            {globalContext.selectedItem && (
              <div className="text-sm">
                Auswahl: {globalContext.selectedItem.display}
              </div>
            )}
          </div>

          {/* Render Current Step Tools */}
          <div className="flex flex-col">
            {currentStep.tools.map((toolConfig, index) => {
              const ToolComponent = TOOL_REGISTRY[toolConfig.type];
              if (!ToolComponent) {
                console.warn(`Tool type "${toolConfig.type}" not found in registry`);
                return null;
              }

              return (
                <ToolComponent
                  key={`${currentStep.id}-${toolConfig.type}-${index}`}
                  config={toolConfig.config}
                  context={contextWithReset}
                  onResult={handleToolResult}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageLearningPlatform;