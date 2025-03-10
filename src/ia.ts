import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGemini(
  nQuestion: number,
  question: string,
  possibleAnswers: string
): Promise<string> {
  if (!process.env.GEMINI_KEY) throw new Error("gemini key not found");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Responda apenas com o id da resposta


    O id é feito no seguinte formato

    As alternativa começam em 1 

    radio-option-quiz-questao-{numeroQuestao}-{numeroAlternativa}

    Questão: ${nQuestion}:
    ${question}

    Alternativas:
    ${possibleAnswers}
  `;

  const result = await model.generateContent(prompt);

  console.log(result.response.text());

  return result.response.text();
}
