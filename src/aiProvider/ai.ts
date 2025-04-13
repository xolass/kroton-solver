import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { Answers } from "../@types/types";

export async function askAIs(
  nQuestion: number,
  question: string,
  possibleAnswers: string
): Promise<Answers> {
  if (!process.env.GEMINI_KEY) throw new Error("gemini key not found");

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_KEY,
  });

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const gpt = openai("gpt-4o-mini");

  const gemini = google("gemini-2.0-flash-001");

  const prompt = `
    Responda apenas com o id da resposta

    
    O id é feito no seguinte formato
    
    radio-option-quiz-questao-{numeroQuestao}-{numeroAlternativa}

    As alternativa são indexadas em 1 

    Questão ${nQuestion}:
    ${question}

    Alternativas:
    ${possibleAnswers}
  `;

  const [resultGemini, resultGpt] = await Promise.all([
    generateText({
      model: gemini,
      prompt,
    }),
    generateText({
      model: gpt,
      prompt,
    }),
  ]);

  console.log(resultGemini.response.messages[0].content);
  console.log(resultGpt.response.messages[0].content);

  if (
    typeof resultGemini.response.messages[0].content !== "string" ||
    typeof resultGpt.response.messages[0].content !== "string"
  ) {
    throw new Error("Invalid response from AI");
  }

  return {
    geminiAnswer: resultGemini.response.messages[0].content,
    gptAnswer: resultGpt.response.messages[0].content,
  };
}
