
export interface AttributeGroup {
  id: string;
  label: string;
  category: string;
  options: string[];
}

export interface CreativeMode {
  id: string;
  label: string;
  shortLabel: string;
  iconName: string;
  promptPrefix: string;
  placeholderText: string;
  description: string;
  attributeGroups: AttributeGroup[];
}

export interface ArtFormData {
  description: string;
  styles: string[];
  artists: string[];
  techniques: string[];
  materials: string[];
  haircuts: string[];
  mood: string;
  palette: string;
  width: string;
  height: string;
  referenceImage?: string | null;
  imageUsageMode?: 'inspiration' | 'overlay';
  isVector: boolean;
  mode: string;
  selectedAttributes?: Record<string, string[]>;
}

export interface GalleryItem {
  id: string;
  imageUrl: string | null;
  svgContent?: string;
  createdAt: number;
  formData: ArtFormData;
  title: string;
  price: number;
}

export const MOODS = [
  { id: 'studio', label: 'Estudio', value: 'Iluminación de estudio profesional, suave, controlada y difusa.' },
  { id: 'golden', label: 'Golden Hour', value: 'Luz de atardecer cálida, tonos dorados resplandecientes y sombras suaves.' },
  { id: 'natural', label: 'Luz Natural', value: 'Luz diurna clara y orgánica, equilibrada y realista.' },
  { id: 'cinematic', label: 'Cine Noir', value: 'Contraste dramático claroscuro, sombras marcadas y atmósfera de película.' },
  { id: 'neon', label: 'Neón Urbano', value: 'Luces de neón intensas, destellos de cian y magenta, vibración nocturna.' },
  { id: 'dramatic', label: 'Dramático', value: 'Luz focalizada, contrastes profundos e intensidad emocional.' }
];

export const PALETTES = [
  { id: 'earth', label: 'Tierra & Ocre', color: '#b45309', value: 'Ocres, terracota, marrones cálidos, verde oliva y beige tostado.' },
  { id: 'vibrant', label: 'Vibrante Pop', color: '#ef4444', value: 'Colores saturados, carmesí vivo, azul eléctrico y amarillo enérgico.' },
  { id: 'pastel', label: 'Pastel Atelier', color: '#fbcfe8', value: 'Tonos etéreos, lavanda suave, menta desaturado y rosa empolvado.' },
  { id: 'luxury', label: 'Lujo & Oro', color: '#d97706', value: 'Negro azabache, oro cepillado, mármol blanco y bronce bruñido.' },
  { id: 'minimal', label: 'Monocromo', color: '#64748b', value: 'Escala de grises refinada, blanco puro, grafito y acentos carbón.' },
  { id: 'cyber', label: 'Cyberpunk', color: '#06b6d4', value: 'Cian brillante, fucsia neón, púrpura ultravioleta y negro asfalto.' }
];

export const CREATIVE_MODES: CreativeMode[] = [
  {
    id: 'architecture',
    label: 'Arquitectura',
    shortLabel: 'Arquitectura',
    iconName: 'Building2',
    description: 'Proyectos, renders artísticos, volumetrías y croquis constructivos.',
    promptPrefix: 'Render y proyecto arquitectónico profesional de alta calidad. Representación técnica, compositiva y artística con volumetrías precisas, texturas constructivas reales y luz ambiental calculada.',
    placeholderText: 'Ej: Museo de arte contemporáneo bioclimático en la costa, voladizos pronunciados de hormigón visto y celosías de madera...',
    attributeGroups: [
      {
        id: 'styles',
        label: 'Estilos Arquitectónicos',
        category: 'Estilo Arquitectónico',
        options: ['Brutalismo', 'Minimalismo', 'Deconstructivismo', 'Arquitectura Orgánica', 'Bauhaus / Racionalismo', 'Paramétrico & Futurista', 'Bioclimático & Sostenible', 'High-Tech Industrial', 'Clásico Contemporáneo', 'Vernáculo Moderno']
      },
      {
        id: 'architects',
        label: 'Arquitectos de Referencia',
        category: 'Arquitecto Célebre',
        options: ['Zaha Hadid', 'Frank Lloyd Wright', 'Le Corbusier', 'Mies van der Rohe', 'Tadao Ando', 'Renzo Piano', 'Norman Foster', 'Santiago Calatrava', 'Luis Barragán', 'Bjarke Ingels (BIG)', 'Álvaro Siza', 'Kengo Kuma']
      },
      {
        id: 'drawingTypes',
        label: 'Tipo de Dibujo & Representación',
        category: 'Tipo de Dibujo',
        options: ['Render fotorrealista hiperdetallado', 'Croquis conceptual a mano alzada', 'Axonometría isométrica explosionada', 'Plano técnico con delineado a tinta', 'Sección perspectivada fugada', 'Lavado a la acuarela arquitectónica', 'Blueprint técnico cianotipo', 'Collage conceptual de concurso']
      },
      {
        id: 'materials',
        label: 'Materiales Constructivos',
        category: 'Material de Construcción',
        options: ['Hormigón visto (encofrado de tablilla)', 'Acero corten oxidado', 'Vidrio laminado estructural', 'Madera maciza contralaminada (CLT)', 'Piedra caliza natural', 'Ladrillo caravista artesanal', 'Mármol travertino romano', 'Paneles de titanio y zinc', 'Bambú estructural']
      },
      {
        id: 'typology',
        label: 'Tipología de Edificio',
        category: 'Tipología Edificatoria',
        options: ['Museo / Centro cultural', 'Vivienda unifamiliar vanguardista', 'Rascacielos escultórico', 'Pabellón efímero sobre agua', 'Biblioteca pública bioclimática', 'Refugio alpino minimalista', 'Complejo residencial modular', 'Bodega en viñedo contemporánea']
      }
    ]
  },
  {
    id: 'graffiti',
    label: 'Graffiti & Arte Urbano',
    shortLabel: 'Graffiti',
    iconName: 'SprayCan',
    description: 'Muralismo contemporáneo, wildstyle, bombing callejero y técnicas de aerosol.',
    promptPrefix: 'Obra maestra de arte urbano y graffiti callejero auténtico. Dominio virtuoso del aerosol, trazos limpios y seguros, efectos de difuminado (flares), degradados vibrantes, sombras duras y textura realista sobre soporte urbano.',
    placeholderText: 'Ej: Mural wildstyle dinámico con letras entrelazadas en tonos turquesa y naranja sobre muro de ladrillo, character estilo cómic...',
    attributeGroups: [
      {
        id: 'styles',
        label: 'Estilos de Graffiti',
        category: 'Estilo de Graffiti',
        options: ['Wildstyle complejo', 'Bubble / Throw-up', 'Bombing callejero rápido', 'Tagging caligráfico fluido', '3D Realism Graffiti', 'Stencil / Plantilla urbana', 'Muralismo figurativo', 'Old School 80s NYC', 'Blockbuster monumental', 'Anti-Style / Ignorant Art']
      },
      {
        id: 'artists',
        label: 'Writers & Artistas de Referencia',
        category: 'Artista de Arte Urbano',
        options: ['Banksy', 'Keith Haring', 'Os Gemeos', 'Shepard Fairey (OBEY)', 'Seen', 'Lady Pink', 'Futura 2000', 'D*Face', 'Blek le Rat', 'Aryz', 'Crash', 'Invader', 'Boa Mistura']
      },
      {
        id: 'surfaces',
        label: 'Superficie & Soporte Urbano',
        category: 'Soporte Urbano',
        options: ['Muro de ladrillo visto desgastado', 'Persiana metálica comercial ondulada', 'Vagón de metro de acero cepillado', 'Hormigón urbano con grietas y texturas', 'Tabla de skate de arce canadiense', 'Chapa industrial oxidada', 'Valla publicitaria con carteles arrancados', 'Lienzo de galería estilo street-art']
      },
      {
        id: 'techniques',
        label: 'Técnicas & Boquillas',
        category: 'Técnica de Graffiti',
        options: ['Spray con Fat Cap (trazos anchos)', 'Skinny Cap (delineado fino y preciso)', 'Goteras intencionales (Drips fluidos)', 'Efecto resplandor y niebla (Flares)', 'Plantilla multicapa (Multi-layer Stencil)', 'Acrílico con rodillo y pértiga mural', 'Marcador Chisel y Dabber caligráfico', 'Sombras biseladas con corte limpio']
      },
      {
        id: 'elements',
        label: 'Elementos & Complementos',
        category: 'Elemento de Composición Urbana',
        options: ['Letras cromadas con brillos especulares', 'Character / B-Boy caricaturizado', 'Efecto humo y estelas dinámicas', 'Flechas y conexiones cinéticas', 'Firmas (Tags) integradas en el fondo', 'Halos y destellos de neón (Stars)', 'Gotas y salpicaduras de pintura', 'Pegatinas y paste-ups desgastados']
      }
    ]
  },
  {
    id: 'photo',
    label: 'Estudio Fotográfico',
    shortLabel: 'Fotografía',
    iconName: 'Camera',
    description: 'Retrato de alta gama, iluminación de estudio, óptica profesional y revelado analógico.',
    promptPrefix: 'Fotografía profesional de estudio capturada con cámara de formato completo y óptica fija de alta gama. Profundidad de campo natural con bokeh suave, iluminación de estudio precisa, textura de piel y tejidos ultradefinidos.',
    placeholderText: 'Ej: Retrato editorial en plano medio con luz Rembrandt, sombras suaves sobre fondo neutro de ciclorama, expresión serena...',
    attributeGroups: [
      {
        id: 'styles',
        label: 'Estilos Fotográficos',
        category: 'Estilo Fotográfico',
        options: ['Retrato editorial de moda', 'Fine Art Portrait intimista', 'Fotografía de producto / Still Life', 'Cinematográfico Noir', 'Fotografía analógica vintage 35mm', 'Minimalista High-End', 'Street Photography atmosférica', 'Macro y texturas hiperdetalladas', 'Fotoperiodismo documental']
      },
      {
        id: 'photographers',
        label: 'Fotógrafos Maestros de Referencia',
        category: 'Fotógrafo Célebre',
        options: ['Peter Lindbergh', 'Annie Leibovitz', 'Helmut Newton', 'Richard Avedon', 'Sebastião Salgado', 'Ansel Adams', 'Cindy Sherman', 'Henri Cartier-Bresson', 'Paolo Roversi', 'Steve McCurry', 'Mario Testino', 'Irving Penn']
      },
      {
        id: 'optics',
        label: 'Óptica & Tipo de Lente',
        category: 'Lente y Óptica',
        options: ['85mm f/1.4 (Retrato con bokeh cremoso)', '50mm f/1.2 (Perspectiva natural nítida)', '35mm f/1.4 (Angular editorial y ambiente)', '105mm f/2.8 Macro (Detalle micro y texturas)', 'Hasselblad Formato Medio (Resolución extrema)', '24mm Gran Angular (Perspectiva dramática)', '135mm f/2.0 (Compresión de planos y separación)']
      },
      {
        id: 'lighting',
        label: 'Esquema de Iluminación',
        category: 'Esquema de Iluminación',
        options: ['Luz Rembrandt (Triángulo luminoso en mejilla)', 'Octabox suave frontal de belleza (Beauty Dish)', 'Luz cenital dramática (Butterfly / Paramount)', 'Luz lateral dura con sombras recortadas (Split)', 'Luz natural suave de claraboya difusa', 'Contraluz con halo de recorte (Rim Light)', 'Doble flash gelificado bicolor (Cálido y Cian)', 'Iluminación en clave baja (Low Key envolvente)']
      },
      {
        id: 'finishes',
        label: 'Acabado, Película & Revelado',
        category: 'Acabado Fotográfico',
        options: ['Blanco y negro Kodak Tri-X con grano de plata', 'Tonos cálidos de película Kodachrome 64', 'Acabado mate aterciopelado editorial', 'High Key (Luminoso, fondo blanco impoluto)', 'Low Key (Tenebrista, fondo oscuro profundo)', 'Color Grading cinematográfico Teal & Orange', 'Tono sepia y virado al platino']
      }
    ]
  },
  {
    id: 'fashion',
    label: 'Moda & Look',
    shortLabel: 'Moda',
    iconName: 'Shirt',
    description: 'Estilismo personal, cortes de pelo, alta costura y bocetos de pasarela.',
    promptPrefix: 'Diseño de moda y estilismo personal de alta gama. Ilustración estilizada con rotuladores de diseño (markers), acuarela fluida y líneas de corte precisas.',
    placeholderText: 'Ej: Vestido de noche asimétrico con corsé drapeado en seda carmín, peinado estilo bob pulido con raya al lado...',
    attributeGroups: [
      {
        id: 'styles',
        label: 'Estilos de Moda',
        category: 'Estilo de Moda',
        options: ['Alta Costura (Haute Couture)', 'Streetwear de lujo contemporáneo', 'Casual Chic & Sastrería relajada', 'Vanguardista & Conceptual', 'Vintage 70s Glam', 'Minimalismo 90s pulcro', 'Cyberpunk & Techwear funcional', 'Bohemio & Étnico sofisticado', 'Gótico Romántico']
      },
      {
        id: 'designers',
        label: 'Diseñadores de Referencia',
        category: 'Diseñador de Moda',
        options: ['Alexander McQueen', 'Coco Chanel', 'Virgil Abloh', 'Iris van Herpen', 'Yves Saint Laurent', 'Rei Kawakubo', 'Christian Dior', 'Cristóbal Balenciaga', 'Jean Paul Gaultier', 'Martin Margiela', 'Elsa Schiaparelli']
      },
      {
        id: 'haircuts',
        label: 'Cortes de Pelo & Peinados',
        category: 'Corte de Pelo',
        options: ['Mujer: Bob clásico pulido', 'Mujer: Pixie cut texturizado', 'Mujer: Melena larga con ondas al agua', 'Mujer: Recogido escultórico de pasarela', 'Mujer: Flequillo recto gráfico', 'Mujer: Trenzas boxeadoras', 'Hombre: Fade (degradado limpio)', 'Hombre: Pompadour clásico', 'Hombre: Undercut texturizado', 'Hombre: Buzz cut moderno', 'Hombre: Mullet vanguardista']
      },
      {
        id: 'materials',
        label: 'Tejidos & Materiales',
        category: 'Tejido Textil',
        options: ['Seda natural brillante', 'Cuero negro repujado', 'Terciopelo denso de algodón', 'Denim japonés selvedge', 'Lino crudo transpirable', 'Tejido técnico impermeable', 'Tul y organza traslúcida', 'Lana fría de espiga', 'Satén drapeado fluido', 'Látex brillante']
      },
      {
        id: 'techniques',
        label: 'Técnicas de Boceto de Moda',
        category: 'Técnica de Boceto',
        options: ['Rotuladores Copic sobre papel marker', 'Acuarela líquida con contorno a tinta fina', 'Figurín de moda estilizado de 9 cabezas', 'Collage de texturas y muestras textiles', 'Boceto a grafito y aguada monocroma', 'Ilustración digital con aerógrafo suave']
      }
    ]
  },
  {
    id: 'interior',
    label: 'Interiorismo',
    shortLabel: 'Interiorismo',
    iconName: 'Armchair',
    description: 'Decoración de espacios, mobiliario de diseño y perspectivas arquitectónicas interiores.',
    promptPrefix: 'Diseño de interiores profesional y decoración de espacios. Ilustración arquitectónica de interiores con rotuladores, acuarelas y representación precisa de mobiliario, texturas e iluminación ambiental.',
    placeholderText: 'Ej: Salón de concepto abierto con gran chimenea suspendida, ventanales de suelo a techo y sofá curvo modular...',
    attributeGroups: [
      {
        id: 'styles',
        label: 'Estilos de Interiorismo',
        category: 'Estilo de Interiorismo',
        options: ['Japandi (Zen & Nórdico)', 'Industrial Loft con vigas vistas', 'Mid-Century Modern clásico', 'Wabi-Sabi orgánico y sereno', 'Art Déco sofisticado', 'Minimalismo cálido', 'Mediterráneo contemporáneo con cal', 'Biofílico con jardín vertical', 'Escandinavo luminoso y acogedor']
      },
      {
        id: 'designers',
        label: 'Interioristas de Referencia',
        category: 'Interiorista de Referencia',
        options: ['Kelly Hoppen', 'Philippe Starck', 'Axel Vervoordt', 'Patricia Urquiola', 'Jean-Michel Frank', 'India Mahdavi', 'Kelly Wearstler', 'Vincent Van Duysen', 'Ilse Crawford', 'Piero Lissoni']
      },
      {
        id: 'roomTypes',
        label: 'Tipo de Estancia',
        category: 'Tipo de Espacio',
        options: ['Salón principal con zona de estar', 'Dormitorio suite con vestidor abierto', 'Cocina con isla central monolítica', 'Baño spa con bañera exenta exótica', 'Estudio / Despacho de diseño creativo', 'Terraza lounge exterior cubierta', 'Lobby / Recepción boutique', 'Comedor formal contemporáneo']
      },
      {
        id: 'materials',
        label: 'Materiales & Acabados',
        category: 'Material de Interior',
        options: ['Madera de roble natural macizo', 'Mármol Calacatta con vetas doradas', 'Microcemento pulido continuo', 'Lino belga en cortinas y tapicería', 'Latón cepillado y bronce cálido', 'Paredes encaladas artesanalmente', 'Vidrio acanalado con perfil de hierro', 'Bouclé texturizado en asientos', 'Piedra de río y madera flotada']
      },
      {
        id: 'techniques',
        label: 'Técnica de Representación',
        category: 'Técnica de Dibujo Interior',
        options: ['Perspectiva cónica a dos puntos de fuga', 'Render fotorrealista con iluminación diurna', 'Boceto rápido con rotulador y aguada', 'Planta de distribución renderizada', 'Moodboard conceptual de materiales']
      }
    ]
  },
  {
    id: 'general',
    label: 'Bellas Artes',
    shortLabel: 'Bellas Artes',
    iconName: 'Palette',
    description: 'Pintura pictórica, grandes movimientos artísticos y técnicas de academia.',
    promptPrefix: 'Obra maestra pictórica y artística de bellas artes. Máxima expresividad, pinceladas ricas en materia, equilibrio cromático virtuoso y composición académica de museo.',
    placeholderText: 'Ej: Paisaje onírico al atardecer con figuras humanas entre veladuras de color, luz tenue lateral...',
    attributeGroups: [
      {
        id: 'styles',
        label: 'Movimientos & Estilos Pictóricos',
        category: 'Movimiento Artístico',
        options: ['Impresionismo de pincelada suelta', 'Expresionismo abstracto gestual', 'Surrealismo onírico y simbólico', 'Realismo figurativo contemporáneo', 'Barroco tenebrista (Claroscuro)', 'Cubismo analítico y geométrico', 'Fauvismo con colores puros', 'Simbolismo místico', 'Postimpresionismo vibrante']
      },
      {
        id: 'artists',
        label: 'Grandes Maestros de Referencia',
        category: 'Maestro Pintor',
        options: ['Vincent van Gogh', 'Salvador Dalí', 'Claude Monet', 'Caravaggio', 'Rembrandt van Rijn', 'Pablo Picasso', 'Francis Bacon', 'Gustav Klimt', 'Mark Rothko', 'Frida Kahlo', 'Edward Hopper', 'J.M.W. Turner', 'Joaquín Sorolla']
      },
      {
        id: 'techniques',
        label: 'Técnicas Pictóricas',
        category: 'Técnica Pictórica',
        options: ['Óleo con empaste grueso (Impasto)', 'Acuarela transparente y lavados líquidos', 'Acrílico sobre lienzo texturizado', 'Gouache mate de alta pigmentación', 'Carboncillo y sanguina difuminada', 'Tinta china y caligrafía sumi-e', 'Técnica mixta con pan de oro fino', 'Pastel al óleo y cretas secas']
      },
      {
        id: 'supports',
        label: 'Soportes & Medios',
        category: 'Soporte Pictórico',
        options: ['Lienzo de lino belga montado en bastidor', 'Papel de algodón de grano grueso 300g', 'Tabla de madera preparada con yeso cretáceo', 'Papel kraft artesanal verjurado', 'Papiro envejecido', 'Muro de estuco al fresco']
      },
      {
        id: 'genres',
        label: 'Géneros & Temáticas',
        category: 'Género Artístico',
        options: ['Retrato psicológico intimista', 'Paisaje natural evocador', 'Marina con oleaje dramático', 'Bodegón / Naturaleza muerta alegórica', 'Abstracción lírica pura', 'Composición mitológica / Onírica', 'Paisaje urbano crepuscular']
      }
    ]
  }
];

export const getAspectRatio = (width: string, height: string): string => {
  const w = parseFloat(width);
  const h = parseFloat(height);
  if (isNaN(w) || isNaN(h)) return "1:1";
  const ratio = w / h;
  if (ratio > 1.5) return "16:9";
  if (ratio > 1.1) return "4:3";
  if (ratio >= 0.9) return "1:1";
  if (ratio >= 0.6) return "3:4";
  return "9:16";
};

// Legacy compatibility helper for previous references
export const MODE_SPECIFIC_OPTIONS: Record<string, { styles: string[]; artists: string[]; techniques: string[]; materials: string[]; haircuts?: string[] }> = {
  architecture: {
    styles: CREATIVE_MODES[0].attributeGroups[0]?.options || [],
    artists: CREATIVE_MODES[0].attributeGroups[1]?.options || [],
    techniques: CREATIVE_MODES[0].attributeGroups[2]?.options || [],
    materials: CREATIVE_MODES[0].attributeGroups[3]?.options || []
  },
  graffiti: {
    styles: CREATIVE_MODES[1].attributeGroups[0]?.options || [],
    artists: CREATIVE_MODES[1].attributeGroups[1]?.options || [],
    techniques: CREATIVE_MODES[1].attributeGroups[3]?.options || [],
    materials: CREATIVE_MODES[1].attributeGroups[2]?.options || []
  },
  photo: {
    styles: CREATIVE_MODES[2].attributeGroups[0]?.options || [],
    artists: CREATIVE_MODES[2].attributeGroups[1]?.options || [],
    techniques: CREATIVE_MODES[2].attributeGroups[3]?.options || [],
    materials: CREATIVE_MODES[2].attributeGroups[2]?.options || []
  },
  fashion: {
    styles: CREATIVE_MODES[3].attributeGroups[0]?.options || [],
    artists: CREATIVE_MODES[3].attributeGroups[1]?.options || [],
    haircuts: CREATIVE_MODES[3].attributeGroups[2]?.options || [],
    materials: CREATIVE_MODES[3].attributeGroups[3]?.options || [],
    techniques: CREATIVE_MODES[3].attributeGroups[4]?.options || []
  },
  interior: {
    styles: CREATIVE_MODES[4].attributeGroups[0]?.options || [],
    artists: CREATIVE_MODES[4].attributeGroups[1]?.options || [],
    materials: CREATIVE_MODES[4].attributeGroups[3]?.options || [],
    techniques: CREATIVE_MODES[4].attributeGroups[4]?.options || []
  },
  general: {
    styles: CREATIVE_MODES[5].attributeGroups[0]?.options || [],
    artists: CREATIVE_MODES[5].attributeGroups[1]?.options || [],
    techniques: CREATIVE_MODES[5].attributeGroups[2]?.options || [],
    materials: CREATIVE_MODES[5].attributeGroups[3]?.options || []
  }
};

