function isAnswerFormatted(answer: string): boolean {
  const regex = new RegExp(`radio-option-quiz-questao-\\d+-\\d+`, "g");
  return regex.test(answer);
}

export function areAnswersSame(answers: string[]): boolean {
  if (answers.length < 2) return false;

  const areSame = answers.reduce((acc, answer) => {
    if (!isAnswerFormatted(answer))
      throw new Error(`Answer ${answer} is not formatted correctly`);
    return acc && answer === answers[0];
  }, true);

  return areSame;
}
