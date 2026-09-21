
import { GoogleGenAI } from "@google/genai";
import { ArtFormData, getAspectRatio, CREATIVE_MODES, MOODS, PALETTES } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

export const generateArtImage = async (formData: ArtFormData): Promise<string> => {
  const ai = getAiClient();
  const { 
    description, width, height, referenceImage, mode, imageUsageMode, mood, palette, selectedAttributes 
  } = formData;

  const selectedMode = CREATIVE_MODES.find(m => m.id === mode) || CREATIVE_MODES[0];
  const moodObj = MOODS.find(m => m.id === mood) || MOODS[0];
  const paletteObj = PALETTES.find(p => p.id === palette) || PALETTES[0];

  let promptText = `DEPARTAMENTO: ${selectedMode.label.toUpperCase()} (${selectedMode.shortLabel}).\n`;
  promptText += `DIRECTRIZ DE DISEÑO: ${selectedMode.promptPrefix}\n\n`;
  
  if (referenceImage && imageUsageMode === 'overlay') {
    promptText += `MODO DE EDICIÓN Y TRANSFORMACIÓN:\n`;
    promptText += `- Transforma e integra la imagen de referencia aportada.\n`;
    promptText += `- Conserva la estructura y silueta base, pero reelabora texturas, iluminación y estilo artístico según los parámetros siguientes.\n\n`;
  } else if (referenceImage && imageUsageMode === 'inspiration') {
    promptText += `MODO INSPIRACIÓN:\n`;
    promptText += `- Usa la composición cromática, atmósfera y volúmenes de la imagen de referencia como inspiración para una nueva creación original.\n\n`;
  }

  promptText += `CONCEPTO Y DESCRIPCIÓN PRINCIPAL:\n${description || "Diseño conceptual exclusivo de alta gama."}\n\n`;

  // Process all department-specific attribute groups
  promptText += `ESPECIFICACIONES DEL DEPARTAMENTO:\n`;
  selectedMode.attributeGroups.forEach(group => {
    const selectedVals = selectedAttributes?.[group.id] || [];
    if (selectedVals.length > 0) {
      promptText += `- ${group.label.toUpperCase()}: ${selectedVals.join(", ")}\n`;
    }
  });

  promptText += `\nATMÓSFERA Y LUZ: ${moodObj.label} - ${moodObj.value}\n`;
  promptText += `PALETA CROMÁTICA: ${paletteObj.label} - ${paletteObj.value}\n`;
  promptText += `DIMENSIONES / PROPORCIÓN: Aspect ratio ${getAspectRatio(width, height)}.\n`;
  promptText += `CALIDAD: Obra maestra profesional con acabados nítidos, texturas de material auténticas y composición visual equilibrada.`;

  const inlineDataPart = referenceImage ? {
    inlineData: {
      mimeType: referenceImage.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png',
      data: referenceImage.split(',')[1]
    }
  } : null;

  const contentsPayload = {
    parts: inlineDataPart ? [
      { text: promptText },
      inlineDataPart
    ] : [{ text: promptText }]
  };

  const imageAspect = getAspectRatio(width, height);

  // Attempt generation with image model
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: contentsPayload,
      config: { 
        imageConfig: { aspectRatio: imageAspect } 
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          return `data:${mime};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No se devolvió ninguna imagen en la respuesta.");
  } catch (error: any) {
    // If first model fails, try gemini-3.1-flash-lite-image
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: contentsPayload,
        config: { 
          imageConfig: { aspectRatio: imageAspect } 
        },
      });

      if (fallbackResponse.candidates?.[0]?.content?.parts) {
        for (const part of fallbackResponse.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            return `data:${mime};base64,${part.inlineData.data}`;
          }
        }
      }
    } catch (fallbackError: any) {
      console.error("Gemini image generation error:", error, fallbackError);
      throw new Error(error?.message || "Error al generar la imagen con IA.");
    }
    throw new Error("Error al generar la imagen con IA.");
  }
};

export const generateVectorSvg = async (formData: ArtFormData): Promise<string> => {
  const ai = getAiClient();
  const { description, width, height, palette, mode, selectedAttributes } = formData;
  const selectedMode = CREATIVE_MODES.find(m => m.id === mode) || CREATIVE_MODES[0];
  const paletteObj = PALETTES.find(p => p.id === palette) || PALETTES[0];

  let attributesText = "";
  selectedMode.attributeGroups.forEach(group => {
    const selectedVals = selectedAttributes?.[group.id] || [];
    if (selectedVals.length > 0) {
      attributesText += `${group.label}: ${selectedVals.join(", ")}. `;
    }
  });

  const prompt = `Genera un código XML <svg> completo, profesional y visualmente impactante.
DEPARTAMENTO: ${selectedMode.label}.
TEMA: ${description || "Composición artística de diseño"}.
ESPECIFICACIONES: ${attributesText}
PALETA CROMÁTICA: ${paletteObj.label} (${paletteObj.value}).
DIMENSIONES viewBox: 0 0 ${width || "800"} ${height || "800"}.

REGLAS OBLIGATORIAS:
- Código SVG puro con etiquetas <svg ...> ... </svg>.
- Incluye formas geométricas bien definidas, trazados <path>, gradientes <defs><linearGradient> y sombras o texturas vectoriales.
- El arte debe ser elaborado, estético y fiel al departamento de ${selectedMode.label}.
- No añadas explicaciones ni bloques markdown, únicamente el código <svg> puro.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    let svgCode = response.text || "";
    svgCode = svgCode.replace(/```xml/g, "").replace(/```svg/g, "").replace(/```/g, "").trim();
    const startIndex = svgCode.indexOf("<svg");
    const endIndex = svgCode.lastIndexOf("</svg>") + 6;
    if (startIndex !== -1 && endIndex > startIndex) {
      return svgCode.substring(startIndex, endIndex);
    }
    return svgCode;
  } catch (error: any) {
    console.error("Gemini SVG generation error:", error);
    throw new Error("Error al generar el trazado vectorial SVG con IA.");
  }
};

export const getTermDefinition = async (term: string, category: string): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Actúa como un profesor y maestro especialista en diseño y arte. Explica el concepto técnico "${term}" dentro de la categoría "${category}".
Proporciona una definición concisa, profesional y formativa en español (máximo 45 palabras), destacando su aplicación estética o constructiva.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    return response.text?.trim() || `Término técnico de referencia en ${category}.`;
  } catch (error) {
    return `Concepto destacado de referencia en ${category}: ${term}.`;
  }
};

