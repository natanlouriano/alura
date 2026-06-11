import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("ERRO: Configure a GEMINI_API_KEY no arquivo .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelName = "gemini-2.5-flash";

async function interagirTexto(promptUsuario) {
  try {
    console.log(`\n--- [Enviando Prompt] --- \n${promptUsuario}`);
    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptUsuario,
    });
    console.log("\n--- [Resposta do Gemini] --- \n", response.text);
  } catch (error) {
    console.error("Erro no texto:", error);
  }
}

async function executarComGuardrails(inputUsuario) {
  try {
    console.log("\n--- [Executando com Guardrails] ---");
    const response = await ai.models.generateContent({
      model: modelName,
      contents: inputUsuario,
      config: {
        systemInstruction: "Você é um assistente estrito de suporte técnico. Responda APENAS em JSON estruturado como {'status': 'sucesso', 'mensagem': 'texto'}. Nunca use saudações.",
        responseMimeType: "application/json"
      }
    });
    console.log("\n--- [JSON Validado pelos Guardrails] --- \n", response.text);
  } catch (error) {
    console.error("Erro nos Guardrails:", error);
  }
}

async function main() {
  console.log("Iniciando aplicação do Capítulo 5 da Alura...");
  await interagirTexto("Explique o que é Engenharia de Prompt em uma linha.");
  await executarComGuardrails("Como reinicio meu roteador?");
}

main();
