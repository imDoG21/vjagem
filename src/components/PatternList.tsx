import { Pattern } from '../types';

interface PatternListProps {
  patterns: Pattern[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreate: () => void;
  onEdit: (pattern: Pattern) => void;
  onView: (pattern: Pattern) => void;
  onDelete: (id: string) => void;
}

function getDifficultyStars(difficulty: number): string {
  return '★'.repeat(difficulty) + '☆'.repeat(3 - difficulty);
}

function getDifficultyLabel(difficulty: number): string {
  switch (difficulty) {
    case 1: return 'Лёгкая';
    case 2: return 'Средняя';
    case 3: return 'Сложная';
    default: return '';
  }
}

export default function PatternList({ patterns, searchQuery, onSearchChange, onCreate, onEdit, onView, onDelete }: PatternListProps) {
  return (
    <div className="animate-fade-in">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b7260]">🔍</span>
          <input
            type="text"
            placeholder="Поиск по названию, автору или номеру..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#f0c4b4]/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm"
          />
        </div>
      </div>

      {/* Empty State */}
      {patterns.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-6xl mb-4">🧸</div>
          <h2 className="text-xl font-semibold text-[#a85d45] mb-2">
            {searchQuery ? 'Ничего не найдено' : 'Пока нет схем'}
          </h2>
          <p className="text-[#8b7260] mb-6 text-sm">
            {searchQuery
              ? 'Попробуйте изменить поисковый запрос'
              : 'Создайте свою первую схему вязания!'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={onCreate}
              className="bg-[#d4856b] hover:bg-[#a85d45] text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-md"
            >
              + Создать первую схему
            </button>
          )}
        </div>
      )}

      {/* Pattern Cards Grid */}
      {patterns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patterns.map((pattern, index) => (
            <div
              key={pattern.id}
              className="bg-white rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onView(pattern)}
            >
              {/* Photo */}
              <div className="relative h-48 bg-gradient-to-br from-[#f0c4b4]/30 to-[#e8a87c]/20 overflow-hidden">
                {pattern.photo ? (
                  <img
                    src={pattern.photo}
                    alt={pattern.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-50">🧸</span>
                  </div>
                )}
                {/* Card Number Badge */}
                {pattern.cardNumber && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-[#a85d45]">
                    #{pattern.cardNumber}
                  </div>
                )}
                {/* Difficulty Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs">
                  <span className="text-[#d4856b]">{getDifficultyStars(pattern.difficulty)}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-[#4a3728] mb-1 truncate text-lg">{pattern.name || 'Без названия'}</h3>
                {pattern.author && (
                  <p className="text-xs text-[#8b7260] mb-2">Автор: {pattern.author}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-[#8b7260]">
                  {pattern.finishedSize && (
                    <span className="bg-[#f0c4b4]/30 px-2 py-1 rounded-full">📏 {pattern.finishedSize}</span>
                  )}
                  {pattern.knittingTime && (
                    <span className="bg-[#f0c4b4]/30 px-2 py-1 rounded-full">⏱ {pattern.knittingTime}</span>
                  )}
                </div>
                {pattern.dateCreated && (
                  <p className="text-xs text-[#8b7260] mt-2">📅 {pattern.dateCreated}</p>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => { e.stopPropagation(); onView(pattern); }}
                  className="flex-1 bg-[#f0c4b4]/30 hover:bg-[#f0c4b4]/60 text-[#a85d45] py-2 rounded-xl text-xs font-medium transition-colors"
                >
                  👁 Открыть
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(pattern); }}
                  className="flex-1 bg-[#7fb685]/20 hover:bg-[#7fb685]/40 text-[#5a8a62] py-2 rounded-xl text-xs font-medium transition-colors"
                >
                  ✏️ Изменить
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(pattern.id); }}
                  className="bg-red-50 hover:bg-red-100 text-red-400 py-2 px-3 rounded-xl text-xs font-medium transition-colors"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {patterns.length > 0 && (
        <div className="mt-8 text-center text-sm text-[#8b7260]">
          Всего схем: {patterns.length}
        </div>
      )}
    </div>
  );
}
