import { constructArgs, nnHTMLElement } from "../typedefs";
import computedHelper from "./computed";
import { reactiveData } from "./data";
export class nn {
  $el: nnHTMLElement;
  reactiveNodes: NodeList;
  error: string;
  data: constructArgs["data"];
  state: constructArgs["data"];
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
    this.$el.__nn__ = this;
    if (!this.$el) {
      this.error = "element not found";
      return;
    }
  }

  initData(data: constructArgs["data"]) {
    Object.keys(data).forEach(key => {
      this.makeReactiveData(key, data[key]);
    });
  }

  makeReactiveData(key: string, value: any) {
    const rData = new reactiveData({
      initialData: value,
      dataChangedCallback: () => {
        if (key in this.dependencies) {
          Array.from(this.dependencies[key]).forEach(computedDependent => {
            this.state[computedDependent] = this.computedFns[
              computedDependent
            ]();
          });
        }
      }
    });
    Object.defineProperty(this.state, key, {
      enumerable: true,
      get: () => rData.getData(),
      set: val => rData.setData(val)
    });
  }
}
