// ============================================================================
// AUDIO PLAYER COMPONENT - Handles German audio pronunciation
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  src?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  autoPlay = false,
  onPlay,
  onPause,
  onError,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (src && autoPlay && !hasPlayed) {
      handlePlay();
      setHasPlayed(true);
    }
  }, [src, autoPlay, hasPlayed]);
  
  const handlePlay = async () => {
    if (!src || !audioRef.current) {
      setError('Audio source not available');
      onError?.('Audio source not available');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Reset audio to beginning
      audioRef.current.currentTime = 0;
      
      await audioRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    } catch (err) {
      const errorMessage = 'Audio playback failed. Audio files may not be available in this demo.';
      setError(errorMessage);
      onError?.(errorMessage);
      console.warn('Audio playback error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
  };
  
  const handleError = () => {
    const errorMessage = 'Audio file could not be loaded';
    setError(errorMessage);
    setIsLoading(false);
    setIsPlaying(false);
    onError?.(errorMessage);
  };
  
  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
  };
  
  if (!src) {
    return null;
  }
  
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        onEnded={handleEnded}
        onError={handleError}
        onCanPlay={handleCanPlay}
        onLoadStart={() => setIsLoading(true)}
        preload="metadata"
      />
      
      {/* Play/Pause Button */}
      <button
        onClick={isPlaying ? handlePause : handlePlay}
        disabled={isLoading || !!error}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          error 
            ? 'bg-red-100 text-red-500 cursor-not-allowed' 
            : isLoading
              ? 'bg-gray-100 text-gray-400 cursor-wait'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}
        title={error ? error : isPlaying ? 'Pause' : 'Play pronunciation'}
      >
        {error ? (
          <AlertCircle className="w-4 h-4" />
        ) : isLoading ? (
          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>
      
      {/* Audio icon and label */}
      <div className="flex items-center space-x-1">
        <Volume2 className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-500">
          {error ? 'Audio unavailable' : 'German pronunciation'}
        </span>
      </div>
      
      {/* Error tooltip */}
      {error && (
        <div className="text-xs text-red-500 max-w-xs">
          Note: Audio files are not included in this demo
        </div>
      )}
    </div>
  );
};