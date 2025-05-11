import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export const askOpenAI = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error("Error al interactuar con OpenAI:", error);
    throw new Error("Error al interactuar con OpenAI.");
  }
};