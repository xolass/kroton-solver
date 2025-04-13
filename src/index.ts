import { sleep } from "bun";
import puppeteer from "puppeteer";
import { askAIs } from "./aiProvider/ai";
import { areAnswersSame } from "./checkAnswer";
import { getUserInput, printUnagreedAnswer } from "./userIO";

const { RA, localizador } = getUserInput();

if (!RA || !localizador) throw new Error("falta RA ou Localizador");

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

// Set screen size.
await page.setViewport({ width: 1080, height: 1024 });
// Navigate the page to a URL.
await page.goto("https://provadigital.kroton.com.br/");

await page.waitForNetworkIdle();

await page
  .locator(
    "#root > div.pd-login-page > div > div.pd-login-page__container-left > div:nth-child(6) > div > div > div > input"
  )
  .fill(RA);

await page
  .locator(
    "#root > div.pd-login-page > div > div.pd-login-page__container-left > div:nth-child(8) > div > div > div > input"
  )
  .fill(localizador);

// Wait and click on first result.
await page.locator("#button-pd-login").click();

await page.waitForNetworkIdle();

await page.locator("#msg-orientacoes").click();
await page.waitForSelector("#button-check-agreement");

await page.locator("#button-check-agreement").click();
await sleep(1000);
await page.locator("#button-start-test").click();

await page.waitForSelector(".ava-quiz-html");

const questionList = await page.$$eval(".ava-quiz-html", (el) =>
  el.map((x) => x.textContent)
);
const answersList = await page.$$eval(".k-option-group", (el) =>
  el.map((x) => x.textContent)
);

const alreadyAnsweredList: number[] = await page.$$eval(
  ".k-option-group",
  (el) => {
    const evalAlreadyAnsweredList: number[] = [];

    el.forEach((x, index) => {
      Array.from(x.children).forEach((node) => {
        if (node.classList.contains("is-bold")) {
          evalAlreadyAnsweredList.push(index + 1);
        }
      });
    });
    return evalAlreadyAnsweredList;
  }
);

console.log({ alreadyAnsweredList });

let nQuestion = 1;
for (let questionNode of questionList) {
  if (alreadyAnsweredList.includes(nQuestion)) continue;

  const answerForThisQuestion = answersList[nQuestion - 1];
  if (!questionNode)
    throw new Error(`No question Node for question ${nQuestion}`);
  if (!answerForThisQuestion)
    throw new Error(`No answer Node for question ${nQuestion}`);

  const { gptAnswer, geminiAnswer } = await askAIs(
    nQuestion,
    questionNode,
    answerForThisQuestion
  );

  nQuestion++;

  const answersMatch = areAnswersSame([gptAnswer, geminiAnswer]);

  if (!answersMatch) {
    printUnagreedAnswer(questionNode, answerForThisQuestion, {
      gptAnswer,
      geminiAnswer,
    });
    continue;
  }

  const answerId = gptAnswer;

  await page.locator(`#${answerId}`).click();

  if (nQuestion !== questionList.length) {
    await page.locator("#button-next-question").click();
  }
}

console.log("Deu certo");

await sleep(10000);

await browser.close();
