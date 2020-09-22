import nn from "./fw/construct";
import exWords from "../game/exWords.json";

interface wordsJson {
  words: Array<String>;
}

const { words } = exWords as wordsJson;

console.time("start");
const x = new nn({
  el: "#app",
  data: {
    currWord: 0,
    currTyped: "",
    hasStarted: false,
    secondsSinceStart: 0,
    correctCharsTotal: 0,
    wordData: words
      .filter((_, idx) => idx < 20)
      .map((word) => {
        return {
          word,
          typed: "",
        };
      }),
  },
  watch: {
    currTyped: function() {
      this.state.hasStarted = true;
      const display = this.state.currTyped + "_";
      this.setState(
        ["wordData", this.state.currWord, "typed"],
        this.state.canAdvance ? this.state.currTyped : display
      );
      if (this.state.canAdvance) {
        this.state.correctCharsTotal += this.state.currTyped.length;
        this.state.currWord++;
        this.state.currTyped = "";
      }
    },
  },
  computed: {
    currTimeDisplay: {
      fn() {
        const minutes = Math.floor(this.state.secondsSinceStart / 60);
        const seconds = this.state.secondsSinceStart % 60;
        const minString = minutes >= 10 ? `${minutes}` : `0${minutes}`;
        const secString = seconds >= 10 ? `${seconds}` : `0${seconds}`;
        return `${minString}:${secString}`;
      },
      dependencies: ["secondsSinceStart"],
    },
    startTxt: {
      fn() {
        return this.state.hasStarted ? "" : "Start typing to begin.";
      },
      dependencies: ["hasStarted"],
    },
    canAdvance: {
      fn() {
        return (
          this.state.wordData[this.state.currWord].word ===
          this.state.currTyped.trim()
        );
      },
      dependencies: ["currWord", "currTyped", "wordData"],
    },
    wpm: {
      fn() {
        const wpm =
          this.state.correctCharsTotal /
          5 /
          (this.state.secondsSinceStart / 60);
        return isNaN(wpm) ? 0 : wpm.toFixed();
      },
      dependencies: ["correctCharsTotal", "secondsSinceStart"],
    },
  },
});
console.timeEnd("start");
setInterval(() => {
  if (x.state.hasStarted) x.state.secondsSinceStart++;
}, 1000);

//@ts-ignore
window.x = x;
