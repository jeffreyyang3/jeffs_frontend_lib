import nn from "./fw/construct";
import { getNNForsOneLvl } from "./fw/dom/template_for";

// const y = new nn({
//   el: "#app",
//   data: {
//     asdf: "this gonna change in 2 secs",
//     inputVal: "changing in 3 seconds",
//     arr: [1, 2, 3, 4],
//     arrObjs: [1, 2, 3, 4].map((num) => {
//       return {
//         a: num,
//       };
//     }),
//   },
// });

// setTimeout(() => {
//   y.state.asdf = "changed";
// }, 2000);

// setTimeout(() => {
//   y.state.inputVal = "newInputVal";
// }, 3000);
const x = new nn({
  el: "#app4",
  data: {
    arrArr: [[1, 2, 3]],
  },
});
