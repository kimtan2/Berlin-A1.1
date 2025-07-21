
import { ShoppingCart, Coffee, Trees, Landmark, Building2, Lock, CheckCircle } from 'lucide-react';
import { PlaceId } from '../types';
import { useProgress, usePlaceProgress } from '../context/ProgressContext';

interface BerlinMapProps {
  onLocationSelect: (placeId: PlaceId) => void;
}

// Location Marker Component with Progress
interface LocationMarkerProps {
  location: any;
  isUnlocked: boolean;
  progress: any;
  onClick: () => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ 
  location, 
  isUnlocked, 
  progress, 
  onClick 
}) => {
  const IconComponent = location.icon;
  
  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 group" style={location.position}>
      {/* Progress Ring */}
      {isUnlocked && (
        <div className="absolute -inset-2 z-0">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
            {/* Background Circle */}
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
            />
            {/* Progress Circle */}
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray={`${(progress.progressPercentage / 100) * 157} 157`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
        </div>
      )}
      
      {/* Pulsing Background Effect */}
      {isUnlocked && (
        <>
          <div className={`absolute inset-0 ${location.color} rounded-full animate-ping opacity-20`} />
          <div className={`absolute inset-0 ${location.color} rounded-full animate-pulse opacity-30 scale-150`} />
        </>
      )}
      
      {/* Main Button */}
      <button
        onClick={onClick}
        disabled={!isUnlocked}
        className={`relative ${
          isUnlocked 
            ? `${location.color} hover:bg-gradient-to-r hover:${location.hoverColor} hover:scale-125 hover:shadow-2xl transform hover:-translate-y-2` 
            : 'bg-gray-400 cursor-not-allowed'
        } text-white p-4 rounded-full shadow-xl ${location.shadowColor} shadow-lg transition-all duration-500 z-10`}
      >
        {isUnlocked ? (
          <IconComponent className="w-7 h-7" />
        ) : (
          <Lock className="w-7 h-7" />
        )}
        
        {/* Progress Badge */}
        {isUnlocked && progress.completedVisits.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {progress.completedVisits.length}
          </div>
        )}
        
        {/* Completion Badge */}
        {progress.progressPercentage === 100 && (
          <div className="absolute -top-1 -right-1 text-yellow-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
        
        {/* Ripple Effect on Hover */}
        {isUnlocked && (
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-300" />
        )}
      </button>
      
      {/* Enhanced Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
        <div className="bg-gray-900/95 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl shadow-2xl whitespace-nowrap border border-gray-700 min-w-64">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-lg">{location.name}</div>
            <span className="text-2xl">{location.emoji}</span>
          </div>
          <div className="text-gray-300 text-xs mb-2">{location.description}</div>
          
          {isUnlocked ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Progress:</span>
                <span className="text-xs font-medium">{progress.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-green-400 h-1 rounded-full transition-all duration-300" 
                  style={{ width: `${progress.progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{progress.completedVisits.length}/{progress.totalVisits} visits</span>
                {progress.nextVisit && (
                  <span>Next: Visit {progress.nextVisit}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Complete Bäckerei visits to unlock</span>
            </div>
          )}
          
          <div className={`inline-block text-xs mt-2 px-2 py-1 rounded-full ${
            isUnlocked 
              ? `bg-gradient-to-r ${location.color.replace('bg-gradient-to-r ', '').replace('to-', 'to-opacity-80 to-')} text-white` 
              : 'bg-gray-600 text-gray-300'
          } font-medium`}>
            {location.category}
          </div>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
};

// Wrapper component that provides progress data to LocationMarker
interface LocationMarkerWithProgressProps {
  location: any;
  onLocationSelect: (placeId: PlaceId) => void;
}

const LocationMarkerWithProgress: React.FC<LocationMarkerWithProgressProps> = ({ 
  location, 
  onLocationSelect 
}) => {
  const { isPlaceUnlocked } = useProgress();
  const placeProgress = usePlaceProgress(location.id);
  
  return (
    <LocationMarker
      location={location}
      isUnlocked={isPlaceUnlocked(location.id)}
      progress={placeProgress}
      onClick={() => onLocationSelect(location.id)}
    />
  );
};

// Location Card Component
interface LocationCardProps {
  location: any;
  onLocationSelect: (placeId: PlaceId) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onLocationSelect }) => {
  const { isPlaceUnlocked } = useProgress();
  const placeProgress = usePlaceProgress(location.id);
  const IconComponent = location.icon;
  const isUnlocked = isPlaceUnlocked(location.id);
  
  return (
    <div
      className={`group bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 overflow-hidden ${
        isUnlocked 
          ? 'hover:shadow-2xl hover:border-gray-200 cursor-pointer transform hover:-translate-y-2' 
          : 'opacity-60 cursor-not-allowed'
      }`}
      onClick={() => isUnlocked && onLocationSelect(location.id)}
    >
      {/* Card Header with Gradient */}
      <div className={`h-2 ${isUnlocked ? location.color : 'bg-gray-300'}`} />
      
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`relative ${
            isUnlocked ? location.color : 'bg-gray-400'
          } text-white p-3 rounded-xl shadow-lg ${
            isUnlocked ? 'group-hover:scale-110' : ''
          } transition-transform duration-300`}>
            {isUnlocked ? (
              <IconComponent className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
            
            {/* Progress Badge on Card */}
            {isUnlocked && placeProgress.completedVisits.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {placeProgress.completedVisits.length}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className={`font-bold text-xl transition-colors ${
                isUnlocked ? 'text-gray-900 group-hover:text-gray-700' : 'text-gray-500'
              }`}>
                {location.name}
              </h4>
              <span className="text-2xl">{location.emoji}</span>
            </div>
            
            <p className={`mt-1 text-sm leading-relaxed ${
              isUnlocked ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {location.description}
            </p>
            
            {/* Progress Bar */}
            {isUnlocked && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-700">{placeProgress.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${placeProgress.progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{placeProgress.completedVisits.length}/{placeProgress.totalVisits} visits completed</span>
                  {placeProgress.nextVisit && (
                    <span>Next: Visit {placeProgress.nextVisit}</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between">
              <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium border ${
                isUnlocked 
                  ? `bg-gradient-to-r ${location.color.replace('bg-gradient-to-r ', '').replace('to-', 'to-opacity-10 to-')} text-gray-700` 
                  : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}>
                {location.category}
              </span>
              
              {isUnlocked ? (
                <div className="text-blue-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Learning →
                </div>
              ) : (
                <div className="text-gray-400 text-xs font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Locked
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overall Progress Indicator Component
const OverallProgressIndicator: React.FC = () => {
  const { progress } = useProgress();
  const unlockedCount = progress.unlockedPlaces.length;
  const totalCompleted = Object.values(progress.completedVisits).flat().length;
  
  return (
    <div className="inline-flex items-center space-x-4 bg-blue-50 px-6 py-3 rounded-full border border-blue-100">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <span className="text-sm text-blue-700 font-medium">
          {unlockedCount}/3 places unlocked
        </span>
      </div>
      
      <div className="w-px h-4 bg-blue-200" />
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-blue-700 font-medium">
          {totalCompleted}/17 visits completed
        </span>
      </div>
      
      <div className="w-px h-4 bg-blue-200" />
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-blue-700 font-medium">
          {progress.overallProgress}% overall progress
        </span>
      </div>
    </div>
  );
};

export const BerlinMap = ({ onLocationSelect }: BerlinMapProps) => {
  const { isPlaceUnlocked } = useProgress();
  
  const locations = [
    {
      id: 'baeckerei' as PlaceId,
      name: 'Bäckerei',
      description: 'Learn to order bread and pastries like a local',
      icon: Coffee,
      position: { top: '38%', left: '68%' },
      color: 'bg-gradient-to-r from-amber-500 to-orange-500',
      hoverColor: 'from-amber-600 to-orange-600',
      category: 'Bakery',
      shadowColor: 'shadow-amber-200',
      emoji: '🥖'
    },
    {
      id: 'rewe' as PlaceId,
      name: 'Rewe Supermarket',
      description: 'Apply your bakery skills while grocery shopping',
      icon: ShoppingCart,
      position: { top: '52%', left: '28%' },
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700',
      category: 'Shopping',
      shadowColor: 'shadow-red-200',
      emoji: '🛒'
    },
    {
      id: 'park' as PlaceId,
      name: 'Tiergarten Park',
      description: 'Meet people and practice social conversations',
      icon: Trees,
      position: { top: '65%', left: '55%' },
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      hoverColor: 'from-green-600 to-emerald-600',
      category: 'Conversation',
      shadowColor: 'shadow-green-200',
      emoji: '🌳'
    }
  ];

  const landmarks = [
    { name: 'Brandenburger Tor', position: { top: '42%', left: '48%' }, icon: Landmark },
    { name: 'Alexanderplatz', position: { top: '35%', left: '58%' }, icon: Building2 },
    { name: 'Potsdamer Platz', position: { top: '55%', left: '45%' }, icon: Building2 }
  ];

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Map Background */}
      <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
        
        {/* Atmospheric Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-indigo-100/50" />
        
        {/* Grid Pattern - More Subtle */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Berlin City Background Elements */}
        <div className="absolute inset-0">
          {/* River Spree - More Realistic */}
          <div className="absolute top-[30%] left-0 w-full h-12 bg-gradient-to-r from-blue-300/40 via-blue-400/30 to-blue-300/40 transform -rotate-6 rounded-full blur-sm" />
          <div className="absolute top-[32%] left-0 w-full h-6 bg-gradient-to-r from-blue-400/50 via-blue-500/40 to-blue-400/50 transform -rotate-6 rounded-full" />
          
          {/* City Districts - Subtle Background Areas */}
          <div className="absolute top-[25%] left-[20%] w-32 h-24 bg-gray-100/30 rounded-lg blur-sm" />
          <div className="absolute top-[45%] left-[35%] w-28 h-32 bg-green-100/40 rounded-lg blur-sm" />
          <div className="absolute top-[35%] right-[15%] w-36 h-28 bg-purple-100/30 rounded-lg blur-sm" />
          
          {/* Parks and Green Areas */}
          <div className="absolute top-[60%] left-[45%] w-40 h-32 bg-green-200/40 rounded-2xl blur-md" />
          <div className="absolute top-[70%] right-[25%] w-24 h-20 bg-green-200/30 rounded-xl blur-sm" />
        </div>

        {/* Title Section - More Prominent */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Virtual Berlin
          </h3>
          <p className="text-sm text-gray-600 font-medium">Interaktive Sprachlernreise</p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">3 Stationen verfügbar</span>
          </div>
        </div>

        {/* Landmark Icons - Subtle Background Elements */}
        {landmarks.map((landmark) => {
          const IconComponent = landmark.icon;
          return (
            <div
              key={landmark.name}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-gray-300 opacity-40"
              style={landmark.position}
            >
              <IconComponent className="w-4 h-4" />
            </div>
          );
        })}

        {/* Interactive Location Markers */}
        {locations.map((location) => {
          return (
            <LocationMarkerWithProgress
              key={location.id}
              location={location}
              onLocationSelect={onLocationSelect}
            />
          );
        })}

        {/* Floating Info Badges */}
        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/50">
          <div className="text-xs text-gray-600 font-medium">Click on a location</div>
          <div className="text-xs text-gray-500">to start learning!</div>
        </div>
      </div>

      {/* Enhanced Location Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {locations.map((location) => {
          return <LocationCard key={`card-${location.id}`} location={location} onLocationSelect={onLocationSelect} />;
        })}
      </div>

      {/* Overall Progress Indicator */}
      <div className="mt-8 text-center">
        <OverallProgressIndicator />
      </div>
    </div>
  );
};
