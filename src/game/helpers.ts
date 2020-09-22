const exWords : wordsJson = require('./exWords.json');
interface wordsJson {
  words: Array<String>;
}
const { words } = exWords;
export function getDiff(correct: string, typed: string) {
  let lastValid = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== correct[i])
      return {
        wrong: typed.slice(lastValid),
        typed: typed.slice(0, lastValid),
      };
    lastValid++;
  }
  return {
    wrong: "",
    typed,
  };
}
export function shuffle(a: Array<any>) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export function getWords(numWords: number = 20) {
  return shuffle(words)
    .filter((_, idx) => idx < numWords)
    .map((word) => {
      return {
        word,
        wrong: "",
        typed: "",
      };
    });
}

export function getBaseState() : {[key:string]: any} {
  return {
    currWord: 0,
    currTyped: "",
    hasStarted: false,
    secondsSinceStart: 0,
    correctCharsTotal: 0,
    wordData: getWords(),
  };
}
