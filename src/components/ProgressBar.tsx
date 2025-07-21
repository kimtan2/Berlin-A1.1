
import { Award, Target, TrendingUp, Calendar } from 'lucide-react';
import { VocabularyItem } from '../pages/Index';

interface ProgressBarProps {
  vocabulary: VocabularyItem[];
  learnedCount: number;
  totalCount: number;
}

export const ProgressBar = ({ vocabulary, learnedCount, totalCount }: ProgressBarProps) => {
  const progressPercentage = totalCount > 0 ? (learnedCount / totalCount) * 100 : 0;
  
  const categoryStats = vocabulary.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, learned: 0 };
    }
    acc[item.category].total++;
    if (item.learned) {
      acc[item.category].learned++;
    }
    return acc;
  }, {} as Record<string, { total: number; learned: number }>);

  const getLevelInfo = (count: number) => {
    if (count >= 50) return { level: 'Experte', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (count >= 25) return { level: 'Fortgeschritten', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (count >= 10) return { level: 'Mittelstufe', color: 'text-green-600', bg: 'bg-green-100' };
    if (count >= 5) return { level: 'Anfänger+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Anfänger', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const levelInfo = getLevelInfo(learnedCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dein Fortschritt</h2>
        <p className="text-lg text-gray-600">Verfolge deine Deutsch-Lernreise</p>
      </div>

      {/* Main Progress Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Gesamt Fortschritt</h3>
            <p className="text-blue-100">Vokabeln gelernt</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${levelInfo.bg} ${levelInfo.color} text-sm font-medium`}>
            {levelInfo.level}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{learnedCount} von {totalCount} Vokabeln</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tägliches Ziel</p>
              <p className="text-lg font-bold text-gray-900">3 Vokabeln</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Diese Woche</p>
              <p className="text-lg font-bold text-gray-900">{learnedCount} gelernt</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lernstreak</p>
              <p className="text-lg font-bold text-gray-900">7 Tage</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Abzeichen</p>
              <p className="text-lg font-bold text-gray-900">3 verdient</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Fortschritt nach Kategorie</h3>
        <div className="space-y-4">
          {Object.entries(categoryStats).map(([category, stats]) => {
            const categoryProgress = (stats.learned / stats.total) * 100;
            const categoryName = 
              category === 'supermarket' ? 'Supermarkt' :
              category === 'bakery' ? 'Bäckerei' :
              category === 'conversation' ? 'Konversation' : category;
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{categoryName}</span>
                  <span className="text-sm text-gray-600">
                    {stats.learned}/{stats.total} ({Math.round(categoryProgress)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      category === 'supermarket' ? 'bg-red-500' :
                      category === 'bakery' ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${categoryProgress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Errungenschaften</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Erste Schritte', description: '5 Vokabeln gelernt', earned: learnedCount >= 5, icon: '🎯' },
            { name: 'Einkaufsexperte', description: 'Supermarkt gemeistert', earned: categoryStats.supermarket?.learned >= 3, icon: '🛒' },
            { name: 'Bäckerei-Profi', description: 'Alle Backwaren-Vokabeln', earned: categoryStats.bakery?.learned >= 3, icon: '🥖' },
            { name: 'Gesprächspartner', description: 'Konversation gemeistert', earned: categoryStats.conversation?.learned >= 3, icon: '💬' },
          ].map((achievement, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <h4 className="font-medium text-gray-900 text-sm">{achievement.name}</h4>
              <p className="text-xs text-gray-600">{achievement.description}</p>
              {achievement.earned && (
                <div className="mt-2">
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                    Verdient!
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
