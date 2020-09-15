import { constructArgs, nnHTMLElement } from "../typedefs";
import computedHelper from "./computed";
import { reactiveData } from "./data";
export class nn {
  $el: nnHTMLElement;
  dependentNodes: {
    [key: string]: Array<Element>
  }
  error: string;
  data: constructArgs["data"];
  state: constructArgs["data"];
  document: constructArgs["jsDocument"]  | Document;
  private computedHelper;
  computedFns: {
    [key: string]: () => any;
  };
  dependencies: {
    [key: string]: Set<string>;
  };
  constructor({ el, data, computed }: constructArgs) {
    this.data = {};
    this.state = {};
    this.dependencies = {};
    this.computedFns = {};
    this.dependentNodes = {};
    if (el) this.attach(el);
    if (data) this.initData(data);
    if (computed) {
      this.computedHelper = new computedHelper({
        computedArgs: computed,
        nnState: this,
        nnDependencies: this.dependencies,
        computedFns: this.computedFns
      });
    }
  }

  attach(el: string) {
    this.$el = document.querySelector(el);
    if (!this.$el) {
      throw "cannot attach to nonexistent element";
    }
    this.$el.__nn__ = this;
    const nodes = this.$el.querySelectorAll('*[nn-txt]');
    nodes.forEach(node => {
      const reactingTo = node.getAttribute('nn-txt');
      if(!this.dependentNodes[reactingTo]) this.dependentNodes[reactingTo] = [node];
      else this.dependentNodes[reactingTo].push(node);
    });
  }

  initData(data: constructArgs["data"]) {
    Object.keys(data).forEach(key => {
      this.makeReactiveData(key, data[key]);
    });
  }

  getDataChangedCallback(key: string) {
    return () => {
      if (key in this.dependencies) {
        Array.from(this.dependencies[key]).forEach(computedDependent => {
          this.state[computedDependent] = this.computedFns[computedDependent]();
        });
      }
      if (key in this.dependentNodes) {
        this.dependentNodes[key].forEach(node => node.innerHTML = this.state[key]);
      }
    };
  }

  makeReactiveData(key: string, value: any) {
    const rData = new reactiveData({
      initialData: value,
      dataChangedCallback: this.getDataChangedCallback(key)
    });
    Object.defineProperty(this.state, key, {
      enumerable: true,
      get: () => rData.getData(),
      set: val => rData.setData(val)
    });
    rData.setData(value);
  }
}
