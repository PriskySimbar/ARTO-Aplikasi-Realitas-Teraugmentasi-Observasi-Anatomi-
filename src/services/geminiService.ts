export async function getGeminiResponse(prompt: string, context?: any) {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.result || "I couldn't generate a response.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('429') || error.message?.toLowerCase().includes('rate limit')) {
      return "Rate limit exceeded. Please wait a moment before sending another message. The AI is processing many requests at the moment.";
    }
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now.";
  }
}

export async function generateQuiz(moduleName: string, level: string) {
  try {
    const res = await fetch('/api/gemini/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleName, level }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.result;
  } catch (e: any) {
    console.error("Failed to parse AI quiz:", e);
    if (e.message?.includes('429')) {
      throw new Error("Rate limit exceeded. Please try again in a few seconds.");
    }
    return [];
  }
}

export async function generateMemoryCards(topic: string) {
  try {
    const res = await fetch('/api/gemini/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.result;
  } catch (e: any) {
    console.error("Failed to parse AI memory cards:", e);
    if (e.message?.includes('429')) {
       throw new Error("Rate limit exceeded. Please try again in a few seconds.");
    }
    return [];
  }
}

export async function analyzeMedicalImage(imageFile: File) {
  try {
    // Convert file to base64
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });

    const imageData = base64Data.split(',')[1];
    const mimeType = imageFile.type;

    const res = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData, mimeType }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.result;
  } catch (error: any) {
    console.error("Gemini Vision Error:", error);
    if (error.message?.includes('429')) {
      return "Rate limit exceeded (Batas frekuensi terlampaui). Silakan tunggu sebentar sebelum mencoba lagi.";
    }
    return "Maaf, terjadi kesalahan saat menganalisis citra medis tersebut. Pastikan file adalah gambar yang valid.";
  }
}
