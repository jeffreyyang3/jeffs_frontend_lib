import nn from "../index";
export default class domHelper {
  private readonly nnInstance;
  private readonly el;
  constructor({ nnInstance, el }: { nnInstance: nn; el: string }) {
    this.nnInstance = nnInstance;
    this.el = el;
  }

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
          node => (node.innerHTML = nnInstance.state[key])
        );
      }

      if (key in nnInstance.modelBindings) {
        nnInstance.modelBindings[key].forEach(
          node => (node.value = nnInstance.state[key])
        );
      }
      if (key in nnInstance.dynamicHTMLDependencies) {
        Array.from(nnInstance.dynamicHTMLDependencies[key]).forEach(cb => cb());
      }
    };
  }
  initReactiveNodes() {
    const nnInstance = this.nnInstance;
    const reactiveNodes = nnInstance.$el.querySelectorAll("*[nn-txt]");
    reactiveNodes.forEach(node => {
      const reactingTo = node.getAttribute("nn-txt");
      if (!nnInstance.dependentNodes[reactingTo])
        nnInstance.dependentNodes[reactingTo] = [node];
      else nnInstance.dependentNodes[reactingTo].push(node);
    });
  }
  initModelNodes() {
    const modelNodes = this.nnInstance.$el.querySelectorAll(
      "*[nn-model]"
    ) as NodeListOf<HTMLInputElement>;
    modelNodes.forEach(node => {
      const bound2 = node.getAttribute("nn-model");
      if (!this.nnInstance.modelBindings[bound2])
        this.nnInstance.modelBindings[bound2] = [node];
      else this.nnInstance.modelBindings[bound2].push(node);
      node.value = this.nnInstance.state[bound2];
      node.oninput = () => {
        this.nnInstance.state[bound2] = node.value;
      };
    });
  }
}
