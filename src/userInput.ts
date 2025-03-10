export function getUserInput() {
  const RA = prompt("Digite o RA e pressione Enter: ");
  const localizador = prompt("Digite o Localizador e pressione Enter: ");

  return {
    RA,
    localizador,
  };
}
