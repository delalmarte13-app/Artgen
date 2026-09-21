
import React, { useRef, useState } from 'react';
import { Plus, Upload, X, Paintbrush, Info, GraduationCap, Check, Sparkles, SlidersHorizontal, Trash2 } from 'lucide-react';

interface MultiSelectProps {
  id?: string;
  label: string;
  category: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onInfoClick: (term: string, category: string) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ 
  id,
  label, 
  category,
  options, 
  selected, 
  onChange, 
  onInfoClick 
}) => {
  const [customInput, setCustomInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomInput("");
    setIsAdding(false);
  };

  return (
    <div id={id} className="mb-6 p-4 rounded-3xl bg-stone-50/50 border border-stone-100/80 transition-all hover:border-stone-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">{label}</label>
          {selected.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-stone-900 text-[9px] font-bold text-white leading-none">
              {selected.length}
            </span>
          )}
        </div>
        {selected.length > 0 && (
          <button 
            onClick={() => onChange([])}
            className="text-[10px] font-semibold text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors"
          >
            <Trash2 size={11} /> Limpiar
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <div key={option} className="relative inline-flex items-center group">
              <button
                type="button"
                onClick={() => toggleOption(option)}
                className={`pl-3.5 pr-8 py-2 rounded-2xl text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {isSelected && <Check size={12} className="stroke-[2.5]" />}
                <span>{option}</span>
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick(option, category);
                }} 
                title={`Consultar definición con IA de ${option}`}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
                  isSelected 
                    ? 'text-stone-400 hover:text-white hover:bg-stone-800' 
                    : 'text-stone-400 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Info size={12} />
              </button>
            </div>
          );
        })}

        {/* Render any custom added options not in base list */}
        {selected.filter(item => !options.includes(item)).map((customOpt) => (
          <div key={customOpt} className="relative inline-flex items-center">
            <button
              type="button"
              onClick={() => toggleOption(customOpt)}
              className="pl-3 pr-7 py-2 rounded-2xl text-[11px] font-semibold bg-stone-900 text-white border border-stone-900 shadow-sm flex items-center gap-1.5"
            >
              <Check size={12} className="stroke-[2.5]" />
              <span>{customOpt}</span>
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(selected.filter(item => item !== customOpt));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {!isAdding ? (
          <button 
            type="button"
            onClick={() => setIsAdding(true)} 
            className="px-3.5 py-2 rounded-2xl text-[11px] font-bold border border-dashed border-stone-300 text-stone-500 hover:text-stone-900 hover:border-stone-500 bg-white/60 transition-all flex items-center gap-1"
          >
            <Plus size={12} /> Añadir personalizado
          </button>
        ) : (
          <div className="inline-flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-900 shadow-sm">
            <input 
              autoFocus 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') handleAddCustom();
                if (e.key === 'Escape') setIsAdding(false);
              }}
              onBlur={() => {
                if (customInput.trim()) handleAddCustom();
                else setIsAdding(false);
              }}
              className="px-2.5 py-1 text-[11px] outline-none w-36 font-semibold text-stone-900"
              placeholder="Escribe y pulsa Enter..."
            />
            <button 
              type="button"
              onClick={handleAddCustom} 
              className="p-1 rounded-xl bg-stone-900 text-white hover:bg-black"
            >
              <Check size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const InfoModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  term: string; 
  definition: string; 
  loading: boolean 
}> = ({ isOpen, onClose, term, definition, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-sm">
            <GraduationCap size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Glosario con IA</span>
            <h3 className="text-xl font-serif font-bold text-stone-900">{term}</h3>
          </div>
        </div>
        <div className="min-h-[70px] flex items-center">
          {loading ? (
            <div className="flex items-center gap-3 text-stone-400 text-xs font-medium animate-pulse">
              <Sparkles size={16} className="text-amber-500 animate-spin" />
              <span>Consultando a la IA experta en diseño...</span>
            </div>
          ) : (
            <p className="text-stone-600 text-sm leading-relaxed">{definition}</p>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="mt-6 w-full py-3 bg-stone-900 text-white rounded-2xl text-xs font-bold tracking-wider hover:bg-black transition-colors"
        >
          ENTENDIDO
        </button>
      </div>
    </div>
  );
};

export const DimensionInput: React.FC<{ 
  width: string; 
  height: string; 
  onWidthChange: (v: string) => void; 
  onHeightChange: (v: string) => void 
}> = ({ width, height, onWidthChange, onHeightChange }) => {
  const presets = [
    { label: '1:1 Cuadrado', w: '800', h: '800' },
    { label: '16:9 Panorámico', w: '1280', h: '720' },
    { label: '3:4 Retrato', w: '768', h: '1024' },
    { label: '9:16 Vertical', w: '720', h: '1280' },
  ];

  return (
    <div className="mb-6 p-4 rounded-3xl bg-stone-50/50 border border-stone-100">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">Dimensiones & Proporción</label>
        <span className="text-[10px] font-semibold text-stone-400">Píxeles (px)</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {presets.map(p => {
          const isActive = width === p.w && height === p.h;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => { onWidthChange(p.w); onHeightChange(p.h); }}
              className={`py-2 px-1 rounded-xl text-[10px] font-semibold text-center border transition-all truncate ${
                isActive 
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <input 
            type="number" 
            value={width} 
            onChange={(e) => onWidthChange(e.target.value)} 
            className="w-full p-3.5 bg-white border border-stone-200 rounded-2xl text-xs font-bold outline-none focus:border-stone-900" 
            placeholder="800"
          />
          <span className="absolute right-3.5 top-3.5 text-[9px] text-stone-400 font-bold uppercase">Ancho</span>
        </div>
        <div className="relative">
          <input 
            type="number" 
            value={height} 
            onChange={(e) => onHeightChange(e.target.value)} 
            className="w-full p-3.5 bg-white border border-stone-200 rounded-2xl text-xs font-bold outline-none focus:border-stone-900" 
            placeholder="800"
          />
          <span className="absolute right-3.5 top-3.5 text-[9px] text-stone-400 font-bold uppercase">Alto</span>
        </div>
      </div>
    </div>
  );
};

export const ImageUpload: React.FC<{ 
  image: string | null; 
  onImageChange: (i: string | null) => void; 
  usageMode: 'inspiration' | 'overlay'; 
  onUsageModeChange: (m: 'inspiration' | 'overlay') => void 
}> = ({ image, onImageChange, usageMode, onUsageModeChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-6 p-4 rounded-3xl bg-stone-50/50 border border-stone-100">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">Imagen de Referencia</label>
        {image && (
          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
            <Check size={12} /> Cargada
          </span>
        )}
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white transition-all group"
        >
          <div className="p-3 bg-stone-50 group-hover:bg-stone-100 rounded-2xl text-stone-400 group-hover:text-stone-700 transition-colors mb-2">
            <Upload size={22} />
          </div>
          <p className="text-[11px] text-stone-700 font-semibold">Subir boceto o foto de referencia</p>
          <p className="text-[9px] text-stone-400 mt-0.5">PNG, JPG, WebP para inspiración o edición</p>
          <input type="file" ref={fileInputRef} onChange={handleFile} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm aspect-video max-h-48 bg-stone-900">
            <img src={image} className="w-full h-full object-contain" alt="Imagen de referencia" />
            <button 
              onClick={() => onImageChange(null)} 
              title="Eliminar imagen"
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md text-stone-600 hover:text-rose-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => onUsageModeChange('inspiration')} 
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${
                usageMode === 'inspiration' 
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              MODO INSPIRACIÓN
            </button>
            <button 
              type="button"
              onClick={() => onUsageModeChange('overlay')} 
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${
                usageMode === 'overlay' 
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              TRANSFORMACIÓN / EDICIÓN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const VectorToggle: React.FC<{ 
  isVector: boolean; 
  onChange: (v: boolean) => void 
}> = ({ isVector, onChange }) => (
  <button 
    type="button"
    onClick={() => onChange(!isVector)} 
    className={`w-full p-4 rounded-3xl border mb-6 flex items-center justify-between transition-all ${
      isVector 
        ? 'bg-stone-900 border-stone-900 text-white shadow-md' 
        : 'bg-white border-stone-200/80 hover:border-stone-300 text-stone-800'
    }`}
  >
    <div className="flex items-center gap-3.5">
      <div className={`p-2.5 rounded-2xl ${isVector ? 'bg-white/15 text-white' : 'bg-stone-100 text-stone-700'}`}>
        <Paintbrush size={18} />
      </div>
      <div className="text-left">
        <span className="block text-xs font-bold uppercase tracking-wider">Modo Vectorial SVG</span>
        <span className={`block text-[10px] font-medium ${isVector ? 'text-stone-300' : 'text-stone-400'}`}>
          Genera trazado gráfico puro escalable
        </span>
      </div>
    </div>
    <div className={`w-11 h-6 rounded-full relative transition-colors ${isVector ? 'bg-amber-400' : 'bg-stone-200'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${isVector ? 'right-1' : 'left-1'}`} />
    </div>
  </button>
);

