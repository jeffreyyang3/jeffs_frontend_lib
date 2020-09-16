import nn from "./fw/construct";

const y = new nn({
  el: "#app",
  data: {
    asdf: "this gonna change in 2 secs",
    inputVal: "initial: changing in 3 seconds",
  },
});

console.log(y);
setTimeout(() => {
  y.state.asdf = "asdfasdfads";
}, 2000);

setTimeout(() => {
  y.state.inputVal = "newInputVal";
}, 3000);
