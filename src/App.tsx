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
            <button
              onClick={handleCreate}
              className="bg-[#d4856b] hover:bg-[#a85d45] text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2 shadow-md"
            >
              <span className="text-lg">+</span>
              <span className="hidden sm:inline">Новая схема</span>
            </button>
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
