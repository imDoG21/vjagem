import { useState, useEffect, useRef } from 'react';
import { Pattern, emptyPattern } from './types';
import PatternList from './components/PatternList';
import PatternForm from './components/PatternForm';
import PatternView from './components/PatternView';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

function App() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('crochet-patterns');
    if (saved) {
      try {
        setPatterns(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved patterns', e);
      }
    }
  }, []);

  useEffect(() => {
    if (patterns.length > 0 || localStorage.getItem('crochet-patterns')) {
      localStorage.setItem('crochet-patterns', JSON.stringify(patterns));
    }
  }, [patterns]);

  const handleCreate = () => {
    setCurrentPattern(null);
    setViewMode('create');
  };

  const handleEdit = (pattern: Pattern) => {
    setCurrentPattern(pattern);
    setViewMode('edit');
  };

  const handleView = (pattern: Pattern) => {
    setCurrentPattern(pattern);
    setViewMode('view');
  };

  const handleSave = (patternData: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (viewMode === 'edit' && currentPattern) {
      const updated: Pattern = {
        ...patternData,
        id: currentPattern.id,
        createdAt: currentPattern.createdAt,
        updatedAt: Date.now(),
      };
      setPatterns(prev => prev.map(p => p.id === currentPattern.id ? updated : p));
    } else {
      const newPattern: Pattern = {
        ...patternData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setPatterns(prev => [newPattern, ...prev]);
    }
    setViewMode('list');
    setCurrentPattern(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту схему? Это действие нельзя отменить.')) {
      setPatterns(prev => prev.filter(p => p.id !== id));
      if (currentPattern?.id === id) {
        setViewMode('list');
        setCurrentPattern(null);
      }
    }
  };

  const handleBack = () => {
    setViewMode('list');
    setCurrentPattern(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(patterns, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crochet-patterns-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            const merged = [...imported, ...patterns.filter(p => !imported.find((i: Pattern) => i.id === p.id))];
            setPatterns(merged);
            alert(`Импортировано ${imported.length} схем!`);
          } else {
            alert('Неверный формат файла');
          }
        } catch (err) {
          alert('Ошибка при чтении файла');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    }
  };

  const filteredPatterns = patterns.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.cardNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pattern-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#f0c4b4]/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧶</span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#a85d45]">Мои схемы вязания</h1>
              <p className="text-xs text-[#8b7260] hidden sm:block">Коллекция схем мягких игрушек</p>
            </div>
          </div>
          {viewMode === 'list' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                disabled={patterns.length === 0}
                className="bg-[#7ba7c9]/20 hover:bg-[#7ba7c9]/40 text-[#5a8a9f] px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Экспортировать все схемы в файл"
              >
                <span>💾</span>
                <span className="hidden sm:inline">Сохранить</span>
              </button>
              <label
                className="bg-[#b893c9]/20 hover:bg-[#b893c9]/40 text-[#8a6b9f] px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer"
                title="Импортировать схемы из файла"
              >
                <span>📂</span>
                <span className="hidden sm:inline">Загрузить</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleCreate}
                className="bg-[#d4856b] hover:bg-[#a85d45] text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2 shadow-md"
              >
                <span className="text-lg">+</span>
                <span className="hidden sm:inline">Новая схема</span>
              </button>
            </div>
          )}
          {viewMode !== 'list' && (
            <button
              onClick={handleBack}
              className="bg-[#f0c4b4]/50 hover:bg-[#f0c4b4] text-[#a85d45] px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">Назад</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {viewMode === 'list' && (
          <PatternList
            patterns={filteredPatterns}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
        {(viewMode === 'create' || viewMode === 'edit') && (
          <PatternForm
            initialData={currentPattern ? currentPattern : undefined}
            onSave={handleSave}
            onCancel={handleBack}
          />
        )}
        {viewMode === 'view' && currentPattern && (
          <PatternView
            pattern={currentPattern}
            onEdit={() => handleEdit(currentPattern)}
            onDelete={() => handleDelete(currentPattern.id)}
            onExport={() => {
              const dataStr = JSON.stringify([currentPattern], null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${currentPattern.name || 'scheme'}-${currentPattern.cardNumber || 'pattern'}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[#8b7260] text-xs">
        <p>🧶 Храните свои схемы с любовью 🧶</p>
      </footer>
    </div>
  );
}

export default App;
