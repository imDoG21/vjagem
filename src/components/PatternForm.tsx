import { useState, useRef } from 'react';
import { Pattern, emptyPattern } from '../types';

interface PatternFormProps {
  initialData?: Pattern;
  onSave: (data: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function PatternForm({ initialData, onSave, onCancel }: PatternFormProps) {
  const [data, setData] = useState<Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>>(
    initialData ? {
      cardNumber: initialData.cardNumber,
      author: initialData.author,
      difficulty: initialData.difficulty,
      finishedSize: initialData.finishedSize,
      knittingTime: initialData.knittingTime,
      dateCreated: initialData.dateCreated,
      name: initialData.name,
      photo: initialData.photo,
      materials: initialData.materials,
      abbreviations: initialData.abbreviations,
      scheme: initialData.scheme,
      assembly: initialData.assembly,
      notes: initialData.notes,
    } : { ...emptyPattern, dateCreated: new Date().toLocaleDateString('ru-RU') }
  );
  const [activeSection, setActiveSection] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setData(prev => ({ ...prev, photo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(data);
  };

  const sections = [
    { id: 'info', label: 'Информация', icon: '📋' },
    { id: 'materials', label: 'Материалы', icon: '🧵' },
    { id: 'abbreviations', label: 'Обозначения', icon: '📝' },
    { id: 'scheme', label: 'Схема', icon: '🪡' },
    { id: 'assembly', label: 'Сборка', icon: '🧩' },
    { id: 'notes', label: 'Заметки', icon: '💡' },
  ];

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Section Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-thin">
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeSection === index
                  ? 'bg-[#d4856b] text-white shadow-md'
                  : 'bg-white/80 text-[#8b7260] hover:bg-[#f0c4b4]/30'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="bg-white rounded-2xl card-shadow p-6 mb-6 animate-fade-in">
          {/* Info Section */}
          {activeSection === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2">
                <span>📋</span> Основная информация
              </h2>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-[#4a3728] mb-2">Фото игрушки</label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#f0c4b4] flex items-center justify-center cursor-pointer hover:border-[#d4856b] hover:bg-[#f0c4b4]/10 transition-all overflow-hidden"
                  >
                    {data.photo ? (
                      <img src={data.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <span className="text-3xl block mb-1">📷</span>
                        <span className="text-xs text-[#8b7260]">Загрузить</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {data.photo && (
                    <button
                      type="button"
                      onClick={() => setData(prev => ({ ...prev, photo: '' }))}
                      className="text-red-400 hover:text-red-500 text-sm"
                    >
                      Удалить фото
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#4a3728] mb-1">Название игрушки *</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Например: Мишка Тедди"
                  className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm"
                  required
                />
              </div>

              {/* Card Number & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3728] mb-1">Номер карточки</label>
                  <input
                    type="text"
                    value={data.cardNumber}
                    onChange={(e) => handleChange('cardNumber', e.target.value)}
                    placeholder="001"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a3728] mb-1">Автор / Бренд</label>
                  <input
                    type="text"
                    value={data.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="Имя или название бренда"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-[#4a3728] mb-2">Сложность</label>
                <div className="flex gap-3">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleChange('difficulty', level)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        data.difficulty === level
                          ? 'border-[#d4856b] bg-[#d4856b]/10 text-[#a85d45]'
                          : 'border-[#f0c4b4]/50 bg-white hover:border-[#d4856b]/50'
                      }`}
                    >
                      <span className="text-[#d4856b]">
                        {'★'.repeat(level)}{'☆'.repeat(3 - level)}
                      </span>
                      <span className="text-xs">
                        {level === 1 ? 'Лёгкая' : level === 2 ? 'Средняя' : 'Сложная'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size, Time, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3728] mb-1">Готовый размер</label>
                  <input
                    type="text"
                    value={data.finishedSize}
                    onChange={(e) => handleChange('finishedSize', e.target.value)}
                    placeholder="~25 см сидя"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a3728] mb-1">Время вязания</label>
                  <input
                    type="text"
                    value={data.knittingTime}
                    onChange={(e) => handleChange('knittingTime', e.target.value)}
                    placeholder="~8 часов"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a3728] mb-1">Дата составления</label>
                  <input
                    type="text"
                    value={data.dateCreated}
                    onChange={(e) => handleChange('dateCreated', e.target.value)}
                    placeholder="13.09.2026"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Materials Section */}
          {activeSection === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2">
                <span>🧵</span> Материалы и инструменты
              </h2>
              <p className="text-xs text-[#8b7260]">Укажите пряжу, наполнитель, инструменты и другие материалы</p>
              <textarea
                value={data.materials}
                onChange={(e) => handleChange('materials', e.target.value)}
                placeholder={`Пример:\n• Пряжа YarnArt Jeans (хлопок 55%, ПА 45%), 160м/50г\n  - Цвет 32 (бежевый) — 2 мотка\n  - Цвет 27 (коричневый) — 1 моток\n• Крючок 2.5 мм\n• Наполнитель холлофайбер\n• Глаза safety eyes 12 мм\n• Ножницы, игла для сшивания`}
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm resize-y"
              />
            </div>
          )}

          {/* Abbreviations Section */}
          {activeSection === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2">
                <span>📝</span> Условные обозначения
              </h2>
              <p className="text-xs text-[#8b7260]">Опишите сокращения, используемые в схеме</p>
              <textarea
                value={data.abbreviations}
                onChange={(e) => handleChange('abbreviations', e.target.value)}
                placeholder={`Пример:\n• вп — воздушная петля\n• сбн — столбик без накида\n• пр — прибавка (2 сбн в одну петлю)\n• уб — убавка (2 сбн провязать вместе)\n• (...) x N — повторять N раз\n• [...] — общее количество петель в ряду`}
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm resize-y"
              />
            </div>
          )}

          {/* Scheme Section */}
          {activeSection === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2">
                <span>🪡</span> Схема вязания
              </h2>
              <p className="text-xs text-[#8b7260]">Запишите пошаговую схему вязания по частям</p>
              <textarea
                value={data.scheme}
                onChange={(e) => handleChange('scheme', e.target.value)}
                placeholder={`Пример:\n\n🧸 ГОЛОВА (вяжем по кругу, бежевый)\n1: 6 сбн в кольцо амигуруми [6]\n2: пр x 6 [12]\n3: (сбн, пр) x 6 [18]\n4: (2 сбн, пр) x 6 [24]\n5: (3 сбн, пр) x 6 [30]\n6-10: 5 рядов сбн [30]\n11: (3 сбн, уб) x 6 [24]\n12: (2 сбн, уб) x 6 [18]\n   — Вставить глаза между 8 и 9 рядами\n   — Набить наполнителем\n13: (сбн, уб) x 6 [12]\n14: уб x 6, стянуть [0]\n\n🧸 ТЕЛО (бежевый)\n...`}
                rows={18}
                className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm resize-y font-mono text-xs leading-relaxed"
              />
            </div>
          )}

          {/* Assembly Section */}
          {activeSection === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2">
                <span>🧩</span> Сборка
              </h2>
              <p className="text-xs text-[#8b7260]">Опишите порядок сборки деталей и оформление</p>
              <textarea
                value={data.assembly}
                onChange={(e) => handleChange('assembly', e.target.value)}
                placeholder={`Пример:\n1. Пришить голову к телу в районе 1 ряда тела\n2. Пришить ручки по бокам тела (между 3 и 4 рядами)\n3. Пришить ножки снизу тела\n4. Пришить ушки к голове (между 2 и 4 рядами)\n5. Вышить носик и ротик коричневым мулине\n6. При желании — приклеить бантик или другой декор`}
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm resize-y"
              />
            </div>
          )}

          {/* Notes Section */}
          {activeSection === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#a85d45] flex items-center gap-2">
                <span>💡</span> Заметки и советы
              </h2>
              <p className="text-xs text-[#8b7260]">Любые полезные заметки, лайфхаки, альтернативы</p>
              <textarea
                value={data.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder={`Пример:\n• Плотность вязания должна быть очень плотной, чтобы наполнитель не просвечивал\n• Вместо safety eyes можно вышить глаза французскими узелками\n• Для ушек лучше использовать проволочный каркас, чтобы они держали форму\n• Если пряжа пушистая — после стирки расчесать мягкой щёткой`}
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-[#f0c4b4]/50 bg-[#fdf8f5]/50 focus:outline-none focus:ring-2 focus:ring-[#d4856b]/30 focus:border-[#d4856b] transition-all text-sm resize-y"
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-[#f0c4b4]/50 text-[#8b7260] hover:bg-[#f0c4b4]/20 transition-all text-sm font-medium"
          >
            Отмена
          </button>
          <div className="flex gap-3">
            {activeSection > 0 && (
              <button
                type="button"
                onClick={() => setActiveSection(prev => prev - 1)}
                className="px-5 py-3 rounded-xl bg-[#f0c4b4]/30 hover:bg-[#f0c4b4]/50 text-[#a85d45] transition-all text-sm font-medium"
              >
                ← Назад
              </button>
            )}
            {activeSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveSection(prev => prev + 1)}
                className="px-5 py-3 rounded-xl bg-[#d4856b] hover:bg-[#a85d45] text-white transition-all text-sm font-medium shadow-md"
              >
                Далее →
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#7fb685] hover:bg-[#5a8a62] text-white transition-all text-sm font-medium shadow-md"
              >
                💾 Сохранить схему
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
