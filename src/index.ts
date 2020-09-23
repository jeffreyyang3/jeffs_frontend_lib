import nn from "./construct";
import { getDiff, getBaseState } from './game/helpers';

console.time("start");
const x = new nn({
  el: "#app",
  data: getBaseState(),
  watch: {
    currTyped: function() {
      this.state.hasStarted = true;
      const currWordObj = this.state.wordData[this.state.currWord];
      const { word } = currWordObj;
      if(!this.state.canAdvance && this.state.currTyped.length > word.length){
        this.state.currTyped = this.state.currTyped.slice(0, -1);
      }
      const { wrong, typed } = getDiff(word, this.state.currTyped);
      currWordObj.wrong = wrong;
      this.setState(
        ["wordData", this.state.currWord, "typed"],
        typed
      );
      if (this.state.canAdvance) {
        this.state.correctCharsTotal += this.state.currTyped.length;

        if (this.state.currWord === this.state.wordData.length - 1) {
          this.state.hasStarted = false;
        } else {
          this.state.currWord++;
          this.state.currTyped = "";
        }
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
  if (x.state.hasStarted) x.state.secondsSinceStart += 0.5;
}, 500);
document.getElementById('reset').addEventListener(('click'), () => {
  const base = getBaseState();
  Object.keys(base).forEach(key => x.state[key] = base[key])
});

//@ts-ignore
window.x = x;
