import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json({ limit: '50mb' }));

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await googleAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: context
         ? `Context: ${JSON.stringify(context)}\n\nUser Question: ${prompt}`
        : prompt,
    });
    res.json({ result: response.text || "I couldn't generate a response." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/gemini/quiz", async (req, res) => {
  try {
    const { moduleName, level } = req.body;
    const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await googleAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Buatkan kuis medis 5 pertanyaan tentang ${moduleName} dengan tingkat kesulitan ${level} dalam Bahasa Indonesia yang formal.
      Kembalikan HANYA array objek JSON dengan struktur berikut:
      [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "answer": 0, // index opsi yang benar
          "explanation": "string"
        }
      ]`,
    });
    
    const text = response.text || "";
    const jsonStr = text.match(/\[.*\]/s)?.[0] || text;
    res.json({ result: JSON.parse(jsonStr) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/gemini/memory", async (req, res) => {
  try {
    const { topic } = req.body;
    const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await googleAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate 4 educational memory cards about ${topic}. 
      Return ONLY a JSON array of objects:
      [
        {
          "front": "Question or term",
          "back": "Answer or definition"
        }
      ]`,
    });
    
    const text = response.text || "";
    const jsonStr = text.match(/\[.*\]/s)?.[0] || text;
    res.json({ result: JSON.parse(jsonStr) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { imageData, mimeType } = req.body;
    const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `Anda adalah "NeuroTag Anatomy Expert", asisten AI spesifik untuk pendidikan kedokteran dan anatomi. Analisis citra medis (Rontgen, CT, MRI) ATAU gambar/diagram anatomi umum dari tubuh manusia ini.PENTING: Terlepas apakah ini gambar scan medis (X-Ray dsb) atau murni ilustrasi/diagram anatomi biasa, Anda WAJIB menganalisis dan melabelkan bagian anatominya secara detail.Untuk setiap struktur yang Anda identifikasi, Anda WAJIB memberikan koordinat lokasi dalam format normalisasi [ymin, xmin, ymax, xmax] di mana nilainya adalah 0-1000.Contoh: "Clavicle": [200, 150, 250, 450]Berikan respons dengan struktur berikut dalam format Markdown yang rapi:### 1. IDENTIFIKASI REGIOTentukan bagian tubuh mana yang ada dalam gambar dan apa modalitas citranya.### 2. ANATOMICAL LABELING (Visual Map)Sertakan blok kode JSON yang berisi daftar struktur dengan koordinatnya. Gunakan format ini:\`\`\`json[  {     "name": "Nama Latin/Medis",     "location": "Deskripsi lokasi",    "coords": [ymin, xmin, ymax, xmax]  }]\`\`\`### 3. ANALISIS POSISI & KUALITAS### 4. LITERASI KLINIS & EDUKASI### 5. TIPS PEMBELAJARAN`;
    const response = await googleAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: imageData, mimeType } }
        ]
      }
    });
    res.json({ result: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
