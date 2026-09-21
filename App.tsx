import React, { useState, useEffect, useMemo } from 'react';
import { 
  Palette, Download, Share2, RefreshCw, Wand2, Info, Save, Shirt, Eye, EyeOff, 
  History, Sparkles, Layers, Armchair, Building2, LayoutGrid, CheckCircle2, 
  Camera, Brush, Trash2, ZoomIn, Copy, Check, SlidersHorizontal, ChevronRight,
  Maximize2, X, Lightbulb, Compass, FileCode
} from 'lucide-react';
import { 
  ArtFormData, CREATIVE_MODES, GalleryItem, MOODS, PALETTES, CreativeMode 
} from './types';
import { 
  MultiSelect, DimensionInput, ImageUpload, VectorToggle, InfoModal 
} from './components/FormComponents';
import { 
  generateArtImage, generateVectorSvg, getTermDefinition 
} from './services/geminiService';

const getDepartmentIcon = (id: string) => {
  switch (id) {
    case 'architecture': return <Building2 size={18} />;
    case 'graffiti': return <Brush size={18} />;
    case 'photo': return <Camera size={18} />;
    case 'fashion': return <Shirt size={18} />;
    case 'interior': return <Armchair size={18} />;
    default: return <Palette size={18} />;
  }
};

const DEPARTMENT_PRESETS: Record<string, string[]> = {
  architecture: [
    "Museo de arte contemporáneo de hormigón visto y celosías geométricas frente al mar.",
    "Pabellón bioclimático flotante en madera contralaminada y cubierta vegetal.",
    "Vivienda unifamiliar brutalista con patios interiores y muros de contención en piedra basáltica."
  ],
  graffiti: [
    "Mural monumental Wildstyle con degradados flúor, letras entrelazadas y personaje cósmico en muro de ladrillo.",
    "Pieza de street art stencil con mensaje poético y salpicaduras dripping sobre persiana comercial.",
    "Composición tipográfica 3D hiperrealista con sombras de spray y brillo cromado."
  ],
  photo: [
    "Retrato de alta costura con iluminación claroscuro dramática y mirada penetrante en estudio monocromo.",
    "Composición de bodegón editorial con texturas orgánicas, luz natural tamizada y sombras tenues.",
    "Retrato cinematográfico 35mm con grano fino y tonalidades cálidas estilo editorial Vogue."
  ],
  fashion: [
    "Colección cápsula de sastrería desestructurada con lino crudo y cortes asimétricos vanguardistas.",
    "Vestido de gala arquitectónico en organza de seda con pliegues esculturales tridimensionales.",
    "Streetwear conceptual unisex con tejidos técnicos reflectantes y silueta oversized."
  ],
  interior: [
    "Salón Japandi con mobiliario bajo en madera de roble, paredes de microcemento y lámpara escultórica de papel washi.",
    "Loft industrial de techos altos con vigas de acero recuperadas, ventanales de hierro y sofá Chester de cuero envejecido.",
    "Suite principal minimalista cálida con cabecero alistonado, iluminación indirecta cálida y textiles de lino."
  ],
  general: [
    "Composición abstracta matérica con veladuras de tinta china, pan de oro y texturas de gesso.",
    "Ilustración botánica contemporánea con trazos de gouache fluido y líneas de grafito nítidas.",
    "Paisaje onírico figurativo con empastes de óleo texturado y contrastes cromáticos vibrantes."
  ]
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery'>('studio');
  const [selectedModeId, setSelectedModeId] = useState<string>('architecture');
  
  // Independent attributes storage per department so user selections aren't wiped when switching
  const [departmentAttributes, setDepartmentAttributes] = useState<Record<string, Record<string, string[]>>>({
    architecture: {
      styles: ["Brutalismo contemporáneo"],
      architects: ["Tadao Ando"],
      drawingTypes: ["Render fotorrealista con iluminación natural"],
      materials: ["Hormigón visto pulido", "Vidrio laminado"],
      typology: ["Museo o Centro Cultural"]
    },
    graffiti: {
      styles: ["Wildstyle complejo"],
      artists: ["Banksy"],
      surfaces: ["Muro de ladrillo visto industrial"],
      techniques: ["Fat cap para rellenos amplios", "Drips y gotas controladas"]
    },
    photo: {
      styles: ["Retrato de estudio editorial de moda"],
      photographers: ["Peter Lindbergh"],
      optics: ["85mm f/1.4 (Retrato nítido con bokeh)"],
      lighting: ["Iluminación Rembrandt con luz principal y relleno sutil"]
    },
    fashion: {
      styles: ["Alta Costura (Haute Couture)"],
      designers: ["Alexander McQueen"],
      garmentTypes: ["Vestido de noche escultural"],
      materials: ["Seda natural / Crepé"]
    },
    interior: {
      styles: ["Japandi (Zen + Escandinavo)"],
      elements: ["Sofá modular curvo contemporáneo"],
      materials: ["Roble natural aceitado", "Microcemento pulido"]
    },
    general: {
      styles: ["Minimalismo abstracto"],
      artists: ["Henri Matisse"],
      techniques: ["Acuarela con degradados translúcidos y reservas"]
    }
  });

  const [description, setDescription] = useState("");
  const [mood, setMood] = useState('natural');
  const [palette, setPalette] = useState('earth');
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("800");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [imageUsageMode, setImageUsageMode] = useState<'inspiration' | 'overlay'>('inspiration');
  const [isVector, setIsVector] = useState(false);

  // Gallery & history state
  const [savedGallery, setSavedGallery] = useState<GalleryItem[]>([]);
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [sessionHistory, setSessionHistory] = useState<{img?: string; svg?: string; title: string; mode: string}[]>([]);
  
  // UI and modal states
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSpecs, setCopiedSpecs] = useState(false);

  // Glossary AI modal
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoTerm, setInfoTerm] = useState("");
  const [infoDefinition, setInfoDefinition] = useState("");
  const [infoLoading, setInfoLoading] = useState(false);

  // Active department object
  const currentMode: CreativeMode = useMemo(() => {
    return CREATIVE_MODES.find(m => m.id === selectedModeId) || CREATIVE_MODES[0];
  }, [selectedModeId]);

  // Active attributes for the current department
  const currentAttributes: Record<string, string[]> = useMemo(() => {
    return departmentAttributes[selectedModeId] || {};
  }, [departmentAttributes, selectedModeId]);

  // Load gallery from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('artgen_studio_gallery_v2');
      if (saved) {
        setSavedGallery(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading gallery from storage", e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAttributeChange = (groupId: string, newSelected: string[]) => {
    setDepartmentAttributes(prev => ({
      ...prev,
      [selectedModeId]: {
        ...(prev[selectedModeId] || {}),
        [groupId]: newSelected
      }
    }));
  };

  const totalSelectedCountForMode = (modeId: string) => {
    const attrs = departmentAttributes[modeId] || {};
    return Object.values(attrs).reduce((sum, list) => sum + list.length, 0);
  };

  const handleGenerate = async () => {
    if (!description.trim() && !referenceImage) {
      showToast("Escribe una descripción o sube una imagen de referencia.");
      return;
    }

    setLoading(true);
    setError(null);

    const formDataPayload: ArtFormData = {
      mode: selectedModeId,
      description,
      styles: currentAttributes.styles || [],
      artists: currentAttributes.artists || currentAttributes.architects || currentAttributes.photographers || currentAttributes.designers || [],
      techniques: currentAttributes.techniques || currentAttributes.drawingTypes || currentAttributes.optics || [],
      materials: currentAttributes.materials || currentAttributes.surfaces || currentAttributes.garmentTypes || currentAttributes.elements || [],
      haircuts: currentAttributes.haircuts || [],
      selectedAttributes: currentAttributes,
      mood,
      palette,
      width,
      height,
      referenceImage,
      imageUsageMode,
      isVector
    };

    try {
      if (isVector && (!referenceImage || imageUsageMode === 'inspiration')) {
        const svg = await generateVectorSvg(formDataPayload);
        setGeneratedSvg(svg);
        setGeneratedImage(null);
        setSessionHistory(prev => [{
          svg,
          title: description.slice(0, 30) || `${currentMode.shortLabel} Vector`,
          mode: selectedModeId
        }, ...prev].slice(0, 8));
        showToast("¡Trazado SVG generado con éxito!");
      } else {
        const img = await generateArtImage(formDataPayload);
        setGeneratedImage(img);
        setGeneratedSvg(null);
        setSessionHistory(prev => [{
          img,
          title: description.slice(0, 30) || `${currentMode.shortLabel} Arte`,
          mode: selectedModeId
        }, ...prev].slice(0, 8));
        showToast("¡Diseño generado con éxito!");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "No se pudo completar la generación. Verifica la conexión con Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToGallery = () => {
    if (!generatedImage && !generatedSvg) return;

    const newItem: GalleryItem = {
      id: Date.now().toString(),
      imageUrl: generatedImage,
      svgContent: generatedSvg || undefined,
      createdAt: Date.now(),
      title: description.trim().slice(0, 35) || `Obra ${currentMode.shortLabel}`,
      price: Math.floor(Math.random() * 400 + 150),
      formData: {
        mode: selectedModeId,
        description,
        styles: currentAttributes.styles || [],
        artists: currentAttributes.artists || currentAttributes.architects || [],
        techniques: currentAttributes.techniques || [],
        materials: currentAttributes.materials || [],
        haircuts: currentAttributes.haircuts || [],
        selectedAttributes: currentAttributes,
        mood,
        palette,
        width,
        height,
        referenceImage: null,
        isVector
      } as any
    };

    const updated = [newItem, ...savedGallery];
    setSavedGallery(updated);
    try {
      localStorage.setItem('artgen_studio_gallery_v2', JSON.stringify(updated));
    } catch (e) {
      console.error("Storage limit reached", e);
    }
    showToast("Guardado en tu Galería de Obras");
  };

  const handleDeleteGalleryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedGallery.filter(item => item.id !== id);
    setSavedGallery(updated);
    localStorage.setItem('artgen_studio_gallery_v2', JSON.stringify(updated));
    showToast("Obra eliminada de la galería");
  };

  const handleDownload = () => {
    if (generatedSvg) {
      const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `artgen-${selectedModeId}-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
      showToast("Descargando SVG vectorial");
    } else if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `artgen-${selectedModeId}-${Date.now()}.png`;
      link.click();
      showToast("Descargando imagen PNG");
    }
  };

  const handleCopySpecs = () => {
    const specsList: string[] = [];
    specsList.push(`Departamento: ${currentMode.label}`);
    if (description) specsList.push(`Concepto: ${description}`);
    currentMode.attributeGroups.forEach(g => {
      const vals = currentAttributes[g.id] || [];
      if (vals.length > 0) specsList.push(`${g.label}: ${vals.join(', ')}`);
    });
    specsList.push(`Ambiente/Luz: ${mood}`);
    specsList.push(`Paleta: ${palette}`);
    specsList.push(`Dimensiones: ${width}x${height}px`);

    navigator.clipboard.writeText(specsList.join('\n'));
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 2000);
    showToast("Ficha técnica copiada al portapapeles");
  };

  const handleInfo = async (term: string, category: string) => {
    setInfoTerm(term);
    setInfoModalOpen(true);
    setInfoLoading(true);
    try {
      const def = await getTermDefinition(term, category);
      setInfoDefinition(def);
    } catch {
      setInfoDefinition("Término de alta relevancia estética en la disciplina.");
    } finally {
      setInfoLoading(false);
    }
  };

  const filteredGallery = useMemo(() => {
    if (galleryFilter === 'all') return savedGallery;
    return savedGallery.filter(item => item.formData?.mode === galleryFilter);
  }, [savedGallery, galleryFilter]);

  return (
    <div id="artgen-studio-root" className="min-h-screen bg-[#fdfbf7] text-stone-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[120] bg-stone-950 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-800 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/70 h-20 flex items-center px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <div className="bg-stone-900 text-white p-2.5 rounded-2xl shadow-md">
              <Sparkles size={20} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight uppercase flex items-center gap-1.5">
                ArtGen <span className="text-stone-400 font-light">Studio</span>
              </h1>
              <p className="text-[9px] font-bold text-stone-400 tracking-[0.25em] uppercase">
                Atelier Multidisciplinar con IA
              </p>
            </div>
          </div>

          <nav id="navigation-tabs" className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200/50">
            <button
              id="tab-studio"
              onClick={() => setActiveTab('studio')}
              className={`px-7 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'studio'
                  ? 'bg-white shadow-sm text-stone-900'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ESTUDIO
            </button>
            <button
              id="tab-gallery"
              onClick={() => setActiveTab('gallery')}
              className={`px-7 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-white shadow-sm text-stone-900'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>GALERÍA</span>
              {savedGallery.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-stone-900 text-[9px] font-bold text-white">
                  {savedGallery.length}
                </span>
              )}
            </button>
          </nav>

          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-stone-500">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini 2.5 Flash & 3.8
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8 flex-1">
        {activeTab === 'studio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Department Selection & Parameter Controls */}
            <section id="studio-controls-column" className="lg:col-span-6 space-y-6">
              
              {/* Department Bar */}
              <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">
                    Departamentos de Diseño
                  </span>
                  <span className="text-[10px] font-semibold text-stone-500">
                    6 disciplinas especializadas
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CREATIVE_MODES.map((m) => {
                    const isSelected = selectedModeId === m.id;
                    const count = totalSelectedCountForMode(m.id);
                    return (
                      <button
                        key={m.id}
                        id={`dept-button-${m.id}`}
                        onClick={() => setSelectedModeId(m.id)}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[76px] ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/10'
                            : 'bg-stone-50 hover:bg-stone-100/80 text-stone-700 border-stone-200/60'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-stone-700 shadow-sm'}`}>
                            {getDepartmentIcon(m.id)}
                          </div>
                          {count > 0 && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-white text-stone-900' : 'bg-stone-200 text-stone-700'
                            }`}>
                              {count}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold mt-2 truncate">{m.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Department Overview Banner */}
              <div className="bg-stone-900 text-white p-5 rounded-3xl shadow-sm flex items-start gap-4">
                <div className="p-2.5 bg-white/10 rounded-2xl text-amber-400 mt-0.5">
                  {getDepartmentIcon(currentMode.id)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-serif font-bold text-white tracking-wide">
                      {currentMode.label}
                    </h2>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    {currentMode.description}
                  </p>
                </div>
              </div>

              {/* Control Accordion Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
                
                {/* Description & Prompt Idea */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      Concepto o Breve Creativo
                    </label>
                    <span className="text-[10px] text-stone-400 font-medium">Requerido</span>
                  </div>

                  <textarea
                    id="input-prompt-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={currentMode.placeholderText}
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl h-28 text-xs font-medium leading-relaxed outline-none focus:border-stone-900 focus:bg-white transition-all resize-none text-stone-800"
                  />

                  {/* Preset Quick Inspiration Pills */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                      Inspiración Rápida para {currentMode.shortLabel}:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {(DEPARTMENT_PRESETS[selectedModeId] || []).map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setDescription(preset)}
                          className="text-left text-[11px] text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 p-2.5 rounded-xl border border-stone-200/60 transition-colors flex items-center gap-2 group"
                        >
                          <ChevronRight size={13} className="text-stone-400 group-hover:text-stone-900 transition-colors shrink-0" />
                          <span className="truncate">{preset}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dynamic Department Attributes */}
                <div className="pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={15} className="text-stone-700" />
                      <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        Parámetros Específicos de {currentMode.shortLabel}
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-400">
                      Haz clic en (i) para glosario IA
                    </span>
                  </div>

                  {currentMode.attributeGroups.map((group) => (
                    <MultiSelect
                      key={`${selectedModeId}-${group.id}`}
                      id={`group-select-${group.id}`}
                      label={group.label}
                      category={`${currentMode.label} - ${group.label}`}
                      options={group.options}
                      selected={currentAttributes[group.id] || []}
                      onChange={(newSelected) => handleAttributeChange(group.id, newSelected)}
                      onInfoClick={handleInfo}
                    />
                  ))}
                </div>

                {/* Lighting and Atmosphere */}
                <div className="pt-4 border-t border-stone-100">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                    Luz & Atmósfera
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMood(m.id)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all text-center ${
                          mood === m.id
                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="pt-4 border-t border-stone-100">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                    Paleta Cromática ({PALETTES.find(p => p.id === palette)?.label})
                  </label>
                  <div className="flex gap-2.5">
                    {PALETTES.map((p) => {
                      const isActive = palette === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPalette(p.id)}
                          title={`${p.label}: ${p.value}`}
                          className={`h-9 flex-1 rounded-xl border-2 transition-all relative ${
                            isActive
                              ? 'border-stone-900 scale-105 shadow-md ring-2 ring-stone-900/10'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: p.color }}
                        >
                          {isActive && (
                            <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                              <Check size={14} className="stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dimensions */}
                <DimensionInput
                  width={width}
                  height={height}
                  onWidthChange={setWidth}
                  onHeightChange={setHeight}
                />

                {/* Reference Image Upload */}
                <ImageUpload
                  image={referenceImage}
                  onImageChange={setReferenceImage}
                  usageMode={imageUsageMode}
                  onUsageModeChange={setImageUsageMode}
                />

                {/* Vector Mode Toggle */}
                <VectorToggle isVector={isVector} onChange={setIsVector} />

                {/* Error Banner if any */}
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-start gap-2.5">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>{error}</p>
                      <button
                        onClick={handleGenerate}
                        className="mt-2 text-[11px] underline font-bold hover:text-rose-900"
                      >
                        Reintentar ahora
                      </button>
                    </div>
                  </div>
                )}

                {/* Generate Action Button */}
                <button
                  id="generate-art-button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl ${
                    loading
                      ? 'bg-stone-700 text-white cursor-wait'
                      : 'bg-stone-900 text-white hover:bg-black active:scale-[0.99]'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin text-amber-400" />
                      <span>CREANDO CON IA ({currentMode.shortLabel.toUpperCase()})...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} className="text-amber-400" />
                      <span>GENERAR DISEÑO CON IA</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Right Column: Interactive Preview Canvas & Gallery History */}
            <section id="studio-preview-column" className="lg:col-span-6 lg:sticky lg:top-28 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col min-h-[580px]">
                
                {/* Canvas Header Controls */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">
                      Canvas Interactivo
                    </span>
                    <h3 className="text-sm font-bold text-stone-800">
                      {currentMode.label}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {referenceImage && (generatedImage || generatedSvg) && (
                      <button
                        onMouseDown={() => setShowOriginal(true)}
                        onMouseUp={() => setShowOriginal(false)}
                        onTouchStart={() => setShowOriginal(true)}
                        onTouchEnd={() => setShowOriginal(false)}
                        title="Mantener presionado para ver imagen original"
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                          showOriginal 
                            ? 'bg-stone-900 text-white border-stone-900' 
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {showOriginal ? <EyeOff size={15} /> : <Eye size={15} />}
                        <span className="text-[10px] hidden sm:inline">ORIGINAL</span>
                      </button>
                    )}

                    {(generatedImage || generatedSvg) && (
                      <>
                        <button
                          onClick={handleCopySpecs}
                          title="Copiar Ficha Técnica del Diseño"
                          className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors"
                        >
                          {copiedSpecs ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                        </button>

                        <button
                          onClick={handleSaveToGallery}
                          title="Guardar en Galería"
                          className="p-2.5 rounded-xl bg-stone-900 hover:bg-black text-white shadow-sm transition-colors"
                        >
                          <Save size={16} />
                        </button>

                        <button
                          onClick={handleDownload}
                          title="Descargar archivo"
                          className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors"
                        >
                          <Download size={16} />
                        </button>

                        {generatedImage && (
                          <button
                            onClick={() => setFullscreenImage(generatedImage)}
                            title="Ver en pantalla completa"
                            className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors"
                          >
                            <Maximize2 size={16} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Main Viewport */}
                <div className="flex-1 rounded-2xl bg-stone-50 border border-stone-100 overflow-hidden flex items-center justify-center relative min-h-[420px] group">
                  {showOriginal && referenceImage ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                      <img
                        src={referenceImage}
                        alt="Original de referencia"
                        className="max-w-full max-h-[500px] object-contain rounded-xl shadow-lg"
                      />
                      <span className="absolute bottom-4 bg-stone-900/80 text-white text-[10px] px-3 py-1 rounded-full font-bold">
                        VISTA ORIGINAL
                      </span>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={generatedImage}
                        alt="Resultado de IA"
                        className="max-w-full max-h-[500px] object-contain rounded-xl shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                    </div>
                  ) : generatedSvg ? (
                    <div 
                      className="w-full h-full p-8 flex items-center justify-center svg-render-container"
                      dangerouslySetInnerHTML={{ __html: generatedSvg }}
                    />
                  ) : (
                    <div className="text-center p-8 flex flex-col items-center justify-center text-stone-400">
                      <div className="p-4 rounded-3xl bg-white border border-stone-200/60 shadow-sm mb-4">
                        <Compass size={40} className="text-stone-300 stroke-[1.5]" />
                      </div>
                      <h4 className="text-sm font-serif font-bold text-stone-700 mb-1">
                        Lienzo Preparado
                      </h4>
                      <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                        Selecciona los estilos, materiales y referencias de {currentMode.shortLabel}, escribe tu concepto y pulsa &quot;Generar Diseño con IA&quot;.
                      </p>
                    </div>
                  )}

                  {/* Loading Overlay */}
                  {loading && (
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-md flex flex-col items-center justify-center z-30 animate-in fade-in">
                      <div className="relative mb-4">
                        <div className="w-14 h-14 rounded-full border-4 border-stone-200 border-t-stone-900 animate-spin" />
                        <Sparkles size={18} className="absolute inset-0 m-auto text-amber-500 animate-pulse" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-1">
                        Sintetizando obra con Gemini...
                      </p>
                      <p className="text-[11px] text-stone-500 font-medium">
                        Departamento de {currentMode.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Active Parameters Recap Chips */}
                {(generatedImage || generatedSvg) && (
                  <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mr-1">
                      Ficha:
                    </span>
                    <span className="px-2.5 py-1 bg-stone-900 text-white rounded-lg text-[10px] font-bold">
                      {currentMode.shortLabel}
                    </span>
                    {Object.entries(currentAttributes).flatMap(([_, vals]) => vals).slice(0, 4).map((val, i) => (
                      <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-lg text-[10px] font-semibold border border-stone-200">
                        {val}
                      </span>
                    ))}
                    {Object.entries(currentAttributes).flatMap(([_, vals]) => vals).length > 4 && (
                      <span className="text-[10px] text-stone-400 font-medium">
                        +{Object.entries(currentAttributes).flatMap(([_, vals]) => vals).length - 4} más
                      </span>
                    )}
                  </div>
                )}

                {/* Session Recents Carousel */}
                {sessionHistory.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                        <History size={13} />
                        Historial de la Sesión ({sessionHistory.length})
                      </span>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                      {sessionHistory.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (item.img) {
                              setGeneratedImage(item.img);
                              setGeneratedSvg(null);
                            } else if (item.svg) {
                              setGeneratedSvg(item.svg);
                              setGeneratedImage(null);
                            }
                          }}
                          className="w-16 h-16 rounded-xl border-2 border-stone-200 hover:border-stone-900 overflow-hidden flex-shrink-0 transition-all bg-stone-50 group relative"
                        >
                          {item.img ? (
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-1 text-[9px] font-bold text-stone-600">
                              <FileCode size={14} className="text-stone-400" />
                              <span>SVG</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* Gallery Tab View */
          <section id="gallery-view" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Galería de Obras & Archivo de Diseño
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Proyectos creados y preservados durante tus sesiones creativas.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/50">
                <button
                  onClick={() => setGalleryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    galleryFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Todas ({savedGallery.length})
                </button>
                {CREATIVE_MODES.map(m => {
                  const count = savedGallery.filter(item => item.formData?.mode === m.id).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setGalleryFilter(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        galleryFilter === m.id
                          ? 'bg-white text-stone-900 shadow-sm'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {m.shortLabel} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredGallery.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/80 p-16 text-center shadow-sm">
                <LayoutGrid size={48} className="mx-auto text-stone-300 mb-3 stroke-[1.5]" />
                <h3 className="text-lg font-serif font-bold text-stone-700 mb-1">
                  Aún no hay obras en la galería
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto mb-6">
                  Genera una nueva pieza en el Estudio y pulsa el botón &quot;Guardar en Galería&quot; para archivarlo permanentemente.
                </p>
                <button
                  onClick={() => setActiveTab('studio')}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                >
                  Ir al Estudio Creativo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => {
                  const modeObj = CREATIVE_MODES.find(m => m.id === item.formData?.mode) || CREATIVE_MODES[0];
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden flex items-center justify-center">
                        {item.svgContent ? (
                          <div 
                            className="p-6 w-full h-full flex items-center justify-center"
                            dangerouslySetInnerHTML={{ __html: item.svgContent }}
                          />
                        ) : (
                          <img
                            src={item.imageUrl!}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <span className="absolute top-3 left-3 px-3 py-1 bg-stone-950/80 backdrop-blur-sm text-white rounded-full text-[10px] font-bold tracking-wider uppercase">
                          {modeObj.shortLabel}
                        </span>

                        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleDeleteGalleryItem(item.id, e)}
                            title="Eliminar de galería"
                            className="p-2 bg-white/90 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-stone-600 shadow-sm transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <h3 className="font-serif font-bold text-base text-stone-900 truncate">
                              {item.title}
                            </h3>
                            <span className="text-xs font-mono font-semibold text-stone-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {item.formData?.description || "Diseño exclusivo"}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            {item.formData?.isVector ? "Vector SVG" : "Render IA"}
                          </span>
                          <button
                            onClick={() => {
                              if (item.imageUrl) setGeneratedImage(item.imageUrl);
                              if (item.svgContent) setGeneratedSvg(item.svgContent);
                              if (item.formData?.mode) setSelectedModeId(item.formData.mode);
                              if (item.formData?.description) setDescription(item.formData.description);
                              setActiveTab('studio');
                              showToast("Obra cargada en el Estudio");
                            }}
                            className="text-xs font-bold text-stone-900 hover:text-black flex items-center gap-1"
                          >
                            <span>Abrir en Estudio</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Fullscreen Zoom Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-[110] bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={fullscreenImage}
            alt="Vista completa"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* AI Glossary Definition Modal */}
      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        term={infoTerm}
        definition={infoDefinition}
        loading={infoLoading}
      />
    </div>
  );
};

export default App;
