import { nn } from "./construct";
export default class domHelper {
  private nnInstance;
  private el;
  constructor({ nnInstance, el }: { nnInstance: nn; el: string }) {
    this.nnInstance = nnInstance;
    this.el = el;
  }
  initModelNodes() {}
  attach() {
    const nnInstance = this.nnInstance;
    nnInstance.$el = document.querySelector(this.el);
    if (!nnInstance.$el) {
      throw "cannot attach to nonexistent element";
    }
    nnInstance.$el.__nn__ = nnInstance;
  }
  getDomUpdateCallback(key: string) {
    return () => {
      const nnInstance = this.nnInstance;
      if (key in nnInstance.dependentNodes) {
        nnInstance.dependentNodes[key].forEach(
          (node) => (node.innerHTML = nnInstance.state[key])
        );
      }

      if (key in nnInstance.modelBindings) {
        nnInstance.modelBindings[key].forEach(
          (node) => (node.value = nnInstance.state[key])
        );
      }
    };
  }
  initReactiveNodes() {
    const nnInstance = this.nnInstance;
    const reactiveNodes = nnInstance.$el.querySelectorAll("*[nn-txt]");
    reactiveNodes.forEach((node) => {
      const reactingTo = node.getAttribute("nn-txt");
      if (!nnInstance.dependentNodes[reactingTo])
        nnInstance.dependentNodes[reactingTo] = [node];
      else nnInstance.dependentNodes[reactingTo].push(node);
    });
  }
}
