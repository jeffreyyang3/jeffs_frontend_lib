import { constructArgs, nnHTMLElement } from "../typedefs";
import computedHelper from "./computed";
import domHelper from "./dom";
import { reactiveData } from "./data";
export class nn {
  $el: nnHTMLElement;
  dependentNodes: {
    [key: string]: Array<Element>;
  };
  error: string;
  data: constructArgs["data"];
  state: constructArgs["data"];
  document: constructArgs["jsDocument"] | Document;
  public computedHelper;
  public domHelper;

  computedFns: {
    [key: string]: () => any;
  };
  dependencies: {
    [key: string]: Set<string>;
  };
  modelBindings: {
    [key: string]: Array<HTMLInputElement>;
  };
  constructor({ el, data, computed }: constructArgs) {
    this.data = {};
    this.state = {};
    this.dependencies = {};
    this.computedFns = {};
    this.dependentNodes = {};
    this.modelBindings = {};
    if (el) {
      this.domHelper = new domHelper({
        nnState: this,
        el,
      });
      this.domHelper.attach();
      this.domHelper.initReactiveNodes();
    }
    if (data) this.initData(data);
    if (computed) {
      this.computedHelper = new computedHelper({
        computedArgs: computed,
        nnState: this,
        nnDependencies: this.dependencies,
        computedFns: this.computedFns,
      });
    }
    if (el) {
      this.domHelper.initModelNodes();
    }
  }

  initData(data: constructArgs["data"]) {
    Object.keys(data).forEach((key) => {
      this.makeReactiveData(key, data[key]);
    });
  }

  getDataChangedCallback(key: string) {
    return () => {
      if (key in this.dependencies) {
        Array.from(this.dependencies[key]).forEach((computedDependent) => {
          this.state[computedDependent] = this.computedFns[computedDependent]();
        });
      }
      if (this.domHelper) this.domHelper.getDomUpdateCallback(key)();
    };
  }

  makeReactiveData(key: string, value: any) {
    const rData = new reactiveData({
      initialData: value,
      dataChangedCallback: this.getDataChangedCallback(key),
    });
    Object.defineProperty(this.state, key, {
      enumerable: true,
      get: () => rData.getData(),
      set: (val) => rData.setData(val),
    });
    rData.setData(value);
  }
}
