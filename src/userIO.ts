import type { Answers } from "./@types/types";

export function getUserInput() {
  const RA = prompt("Digite o RA e pressione Enter: ");
  const localizador = prompt("Digite o Localizador e pressione Enter: ");

  return {
    RA,
    localizador,
  };
}

export function printUnagreedAnswer(
  question: string,
  options: string,
  answers: Answers
) {
  console.log(`Questão: ${question}`);
  console.log("Alternativas:");

  console.log(options);
  // const firstLetter = "a";
  // options.forEach((option, index) => {
  //   const currentLetterAsAsciiNumber = firstLetter.charCodeAt(0) + index;
  //   console.log(
  //     `${String.fromCharCode(currentLetterAsAsciiNumber)}: ${option}`
  //   );
  // });

  Object.entries(answers).forEach(([key, value]) => {
    console.log(`Resposta ${key}: ${value}`);
  });
}
