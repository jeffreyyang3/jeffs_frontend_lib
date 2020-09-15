import { nn } from "./construct";
export default class domHelper {
  private nnState;
  private el;
  constructor({ nnState, el }: { nnState: nn; el: string }) {
    this.nnState = nnState;
    this.el = el;
  }
  initModelNodes() {}
  attach() {
    const nnState = this.nnState;
    nnState.$el = document.querySelector(this.el);
    if (!nnState.$el) {
      throw "cannot attach to nonexistent element";
    }
    nnState.$el.__nn__ = nnState;
  }
  getDomUpdateCallback(key: string) {
    return () => {
      const nnState = this.nnState;
      if (key in nnState.dependentNodes) {
        nnState.dependentNodes[key].forEach(
          (node) => (node.innerHTML = nnState.state[key])
        );
      }

      if (key in nnState.modelBindings) {
        nnState.modelBindings[key].forEach(
          (node) => (node.value = nnState.state[key])
        );
      }
    };
  }
  initReactiveNodes() {
    const nnState = this.nnState;
    const reactiveNodes = nnState.$el.querySelectorAll("*[nn-txt]");
    reactiveNodes.forEach((node) => {
      const reactingTo = node.getAttribute("nn-txt");
      if (!nnState.dependentNodes[reactingTo])
        nnState.dependentNodes[reactingTo] = [node];
      else nnState.dependentNodes[reactingTo].push(node);
    });
  }
}
