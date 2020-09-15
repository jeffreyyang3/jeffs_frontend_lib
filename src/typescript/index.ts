import { nn } from "./fw/construct";

const y = new nn({
  el: "#app",
  data: {
    asdf: 'asdf'
  }
});

console.log(y);
setTimeout(() => {
  y.state.asdf = 'asdfasdfads';
}, 2000);
