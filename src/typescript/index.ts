import nn from "./fw/construct";

const y = new nn({
  el: "#app",
  data: {
    asdf: "this gonna change in 2 secs",
    inputVal: "changing in 3 seconds",
    arr: [1, 2, 3, 4],
  },
});

setTimeout(() => {
  y.state.asdf = "changed";
}, 2000);

setTimeout(() => {
  y.state.inputVal = "newInputVal";
}, 3000);
