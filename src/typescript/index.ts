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
    wordData: words
      .filter((_, idx) => idx < 20)
      .map((word) => {
        return {
          word,
          typed: "t",
        };
      }),
  },
  // computed: {
  //   compute: {
  //     fn: function() {
  //       const copy = [...this.state.wordData];
  //       copy.push({ word: "newWord" });
  //       return copy;
  //     },
  //     dependencies: ["wordData"],
  //   },
  // },
});
x.setState(["wordData", 0, "word"], "changed");

console.timeEnd("start");
//@ts-ignore
window.x = x;
