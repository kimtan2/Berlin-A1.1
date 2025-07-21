// ============================================================================
// DIALOGUE INTERFACE - Handles interactive conversation flow
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, User, MessageCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { DialogueStep } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface DialogueInterfaceProps {
  dialogue: DialogueStep[];
  onComplete: (mistakes: number, timeSpent: number) => void;
  onBack: () => void;
}

interface ConversationMessage {
  id: number;
  speaker: 'npc' | 'user';
  text: string;
  isCorrect?: boolean;
  feedback?: string;
}

export const DialogueInterface: React.FC<DialogueInterfaceProps> = ({
  dialogue,
  onComplete,
  onBack
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const conversationRef = useRef<HTMLDivElement>(null);
  const currentStep = dialogue[currentStepIndex];
  
  // Auto-scroll conversation to bottom
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);
  
  // Initialize with first NPC message if it exists
  useEffect(() => {
    if (currentStep && currentStep.speaker === 'npc' && currentStep.text) {
      setConversation([{
        id: currentStep.id,
        speaker: 'npc',
        text: currentStep.text
      }]);
    }
  }, []);
  
  const handleOptionSelect = (optionText: string, isCorrect: boolean, feedback: string) => {
    setSelectedOption(optionText);
    setShowFeedback(true);
    
    // Add user response to conversation
    const userMessage: ConversationMessage = {
      id: currentStep.id,
      speaker: 'user',
      text: optionText,
      isCorrect,
      feedback
    };
    
    setConversation(prev => [...prev, userMessage]);
    
    // Track mistakes
    if (!isCorrect) {
      setMistakes(prev => prev + 1);
    }
    
    // Move to next step after delay
    setTimeout(() => {
      proceedToNextStep();
    }, 2000);
  };
  
  const proceedToNextStep = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    
    const nextIndex = currentStepIndex + 1;
    
    if (nextIndex >= dialogue.length) {
      // Conversation complete
      handleConversationComplete();
      return;
    }
    
    setCurrentStepIndex(nextIndex);
    const nextStep = dialogue[nextIndex];
    
    // Add NPC message if it exists
    if (nextStep.speaker === 'npc' && nextStep.text) {
      const npcMessage: ConversationMessage = {
        id: nextStep.id,
        speaker: 'npc',
        text: nextStep.text
      };
      
      setConversation(prev => [...prev, npcMessage]);
    }
  };
  
  const handleConversationComplete = () => {
    setIsCompleted(true);
    const timeSpent = Date.now() - startTime;
    
    // Add completion delay for better UX
    setTimeout(() => {
      onComplete(mistakes, timeSpent);
    }, 3000);
  };
  
  const resetConversation = () => {
    setCurrentStepIndex(0);
    setConversation([]);
    setMistakes(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCompleted(false);
    
    // Reinitialize with first message
    if (dialogue[0] && dialogue[0].speaker === 'npc' && dialogue[0].text) {
      setConversation([{
        id: dialogue[0].id,
        speaker: 'npc',
        text: dialogue[0].text
      }]);
    }
  };
  
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Excellent Work!</h2>
          <p className="text-gray-600 mb-6">You've successfully completed the conversation.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.max(0, dialogue.filter(d => d.speaker === 'user').length - mistakes)}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{mistakes}</div>
              <div className="text-xs text-gray-500">Mistakes</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetConversation}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => onComplete(mistakes, Date.now() - startTime)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Step {currentStepIndex + 1} of {dialogue.length}
                </span>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Mistakes:</span>
                  <span className={`text-sm font-medium ${mistakes > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {mistakes}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  audioEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <button
                onClick={resetConversation}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStepIndex + 1) / dialogue.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Conversation Area */}
      <div className="flex-1 flex flex-col">
        <div 
          ref={conversationRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {conversation.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.speaker === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Speaker Avatar */}
                <div className={`flex items-center space-x-2 mb-2 ${message.speaker === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.speaker === 'user' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {message.speaker === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {message.speaker === 'user' ? 'You' : 'Native Speaker'}
                  </span>
                </div>
                
                {/* Message Bubble */}
                <div className={`p-3 rounded-lg ${
                  message.speaker === 'user' 
                    ? message.isCorrect === false 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p>{message.text}</p>
                  
                  {/* Feedback */}
                  {message.feedback && showFeedback && (
                    <div className={`mt-2 text-xs ${
                      message.isCorrect === false ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {message.isCorrect === false ? '❌' : '✅'} {message.feedback}
                    </div>
                  )}
                </div>
                
                {/* Audio Player for NPC messages */}
                {message.speaker === 'npc' && currentStep?.audio && audioEnabled && (
                  <div className="mt-2">
                    <AudioPlayer src={currentStep.audio} autoPlay />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Response Options */}
        {currentStep && currentStep.speaker === 'user' && currentStep.options && !selectedOption && (
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentStep.prompt}
              </h3>
              
              <div className="space-y-3">
                {currentStep.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option.text, option.correct, option.feedback)}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-lg transition-colors"
                  >
                    <span className="font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Feedback Display */}
        {showFeedback && selectedOption && (
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse">
                <span className="text-gray-600">Processing response...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Next Step Prompt */}
        {currentStep && currentStep.speaker === 'npc' && !currentStep.options && currentStepIndex < dialogue.length - 1 && (
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-6">
            <div className="max-w-4xl mx-auto text-center">
              <button
                onClick={proceedToNextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};