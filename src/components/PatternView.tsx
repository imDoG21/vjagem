import { Pattern } from '../types';

interface PatternViewProps {
  pattern: Pattern;
  onEdit: () => void;
  onDelete: () => void;
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

export default function PatternView({ pattern, onEdit, onDelete }: PatternViewProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden mb-6">
        {/* Photo Banner */}
        <div className="relative h-56 md:h-72 bg-gradient-to-br from-[#f0c4b4]/40 to-[#e8a87c]/30">
          {pattern.photo ? (
            <img
              src={pattern.photo}
              alt={pattern.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl opacity-40">🧸</span>
            </div>
          )}
          {/* Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white font-handwritten">
                  {pattern.name || 'Без названия'}
                </h1>
                {pattern.author && (
                  <p className="text-white/80 text-sm mt-1">Автор: {pattern.author}</p>
                )}
              </div>
              {pattern.cardNumber && (
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                  #{pattern.cardNumber}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[#fdf8f5] rounded-xl">
              <div className="text-[#d4856b] text-lg mb-1">{getDifficultyStars(pattern.difficulty)}</div>
              <div className="text-xs text-[#8b7260]">{getDifficultyLabel(pattern.difficulty)}</div>
            </div>
            {pattern.finishedSize && (
              <div className="text-center p-3 bg-[#fdf8f5] rounded-xl">
                <div className="text-lg mb-1">📏</div>
                <div className="text-xs text-[#4a3728] font-medium">{pattern.finishedSize}</div>
                <div className="text-xs text-[#8b7260]">Размер</div>
              </div>
            )}
            {pattern.knittingTime && (
              <div className="text-center p-3 bg-[#fdf8f5] rounded-xl">
                <div className="text-lg mb-1">⏱</div>
                <div className="text-xs text-[#4a3728] font-medium">{pattern.knittingTime}</div>
                <div className="text-xs text-[#8b7260]">Время</div>
              </div>
            )}
            {pattern.dateCreated && (
              <div className="text-center p-3 bg-[#fdf8f5] rounded-xl">
                <div className="text-lg mb-1">📅</div>
                <div className="text-xs text-[#4a3728] font-medium">{pattern.dateCreated}</div>
                <div className="text-xs text-[#8b7260]">Дата</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {/* Materials */}
        {pattern.materials && (
          <div className="bg-white rounded-2xl card-shadow p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-[#f0c4b4]/30 rounded-lg flex items-center justify-center text-sm">🧵</span>
              Материалы и инструменты
            </h2>
            <div className="text-sm text-[#4a3728] leading-relaxed whitespace-pre-wrap bg-[#fdf8f5] rounded-xl p-4">
              {renderTextWithLineBreaks(pattern.materials)}
            </div>
          </div>
        )}

        {/* Abbreviations */}
        {pattern.abbreviations && (
          <div className="bg-white rounded-2xl card-shadow p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-[#f0c4b4]/30 rounded-lg flex items-center justify-center text-sm">📝</span>
              Условные обозначения
            </h2>
            <div className="text-sm text-[#4a3728] leading-relaxed whitespace-pre-wrap bg-[#fdf8f5] rounded-xl p-4">
              {renderTextWithLineBreaks(pattern.abbreviations)}
            </div>
          </div>
        )}

        {/* Scheme */}
        {pattern.scheme && (
          <div className="bg-white rounded-2xl card-shadow p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-[#f0c4b4]/30 rounded-lg flex items-center justify-center text-sm">🪡</span>
              Схема вязания
            </h2>
            <div className="text-sm text-[#4a3728] leading-relaxed whitespace-pre-wrap bg-[#fdf8f5] rounded-xl p-4 font-mono text-xs">
              {renderTextWithLineBreaks(pattern.scheme)}
            </div>
          </div>
        )}

        {/* Assembly */}
        {pattern.assembly && (
          <div className="bg-white rounded-2xl card-shadow p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-[#f0c4b4]/30 rounded-lg flex items-center justify-center text-sm">🧩</span>
              Сборка
            </h2>
            <div className="text-sm text-[#4a3728] leading-relaxed whitespace-pre-wrap bg-[#fdf8f5] rounded-xl p-4">
              {renderTextWithLineBreaks(pattern.assembly)}
            </div>
          </div>
        )}

        {/* Notes */}
        {pattern.notes && (
          <div className="bg-white rounded-2xl card-shadow p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-[#f0c4b4]/30 rounded-lg flex items-center justify-center text-sm">💡</span>
              Заметки и советы
            </h2>
            <div className="text-sm text-[#4a3728] leading-relaxed whitespace-pre-wrap bg-[#fdf8f5] rounded-xl p-4">
              {renderTextWithLineBreaks(pattern.notes)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!pattern.materials && !pattern.abbreviations && !pattern.scheme && !pattern.assembly && !pattern.notes && (
          <div className="bg-white rounded-2xl card-shadow p-8 text-center">
            <span className="text-4xl block mb-3">📝</span>
            <p className="text-[#8b7260] text-sm">Разделы схемы пока не заполнены</p>
            <button
              onClick={onEdit}
              className="mt-4 bg-[#d4856b] hover:bg-[#a85d45] text-white px-5 py-2 rounded-full text-sm font-medium transition-all"
            >
              ✏️ Заполнить схему
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={onEdit}
          className="bg-[#d4856b] hover:bg-[#a85d45] text-white px-6 py-3 rounded-xl font-medium transition-all text-sm shadow-md flex items-center gap-2"
        >
          <span>✏️</span> Редактировать
        </button>
        <button
          onClick={onDelete}
          className="bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 px-6 py-3 rounded-xl font-medium transition-all text-sm flex items-center gap-2"
        >
          <span>🗑</span> Удалить
        </button>
      </div>

      {/* Timestamps */}
      <div className="mt-6 text-center text-xs text-[#8b7260] space-y-1">
        <p>Создано: {formatDate(pattern.createdAt)}</p>
        {pattern.updatedAt !== pattern.createdAt && (
          <p>Обновлено: {formatDate(pattern.updatedAt)}</p>
        )}
      </div>
    </div>
  );
}
