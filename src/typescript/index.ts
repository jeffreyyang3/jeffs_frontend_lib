import { nn } from "./fw/construct";

const y = new nn({
  el: "#app",
  data: {
    x: "y",
    z: "a"
  }
});

console.log(y);
