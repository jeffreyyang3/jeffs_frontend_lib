import { constructArgs, nnHTMLElement } from "../typedefs";
import computedHelper from "./computed";
import domHelper from "./dom";
import watchHelper from "./watch";
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
  public watchHelper;

  computedFns: {
    [key: string]: () => any;
  };
  dependencies: {
    [key: string]: Set<string>;
  };
  modelBindings: {
    [key: string]: Array<HTMLInputElement>;
  };
  constructor({ el, data, computed, watch }: constructArgs) {
    this.data = {};
    this.state = {};
    this.dependencies = {};
    this.computedFns = {};
    this.dependentNodes = {};
    this.modelBindings = {};
    if (el) {
      this.domHelper = new domHelper({
        nnInstance: this,
        el,
      });
      this.domHelper.attach();
      this.domHelper.initReactiveNodes();
    }
    if (data) this.initData(data);
    if (computed) {
      this.computedHelper = new computedHelper({
        computedArgs: computed,
        nnInstance: this,
        nnDependencies: this.dependencies,
        computedFns: this.computedFns,
      });
    }
    if (watch) {
      this.watchHelper = new watchHelper({  watchArgs: watch, nnInstance: this });
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
      if (this.computedHelper)
        this.computedHelper.getUpdateComputedCallback(key)();
      if (this.domHelper) this.domHelper.getDomUpdateCallback(key)();
      if (this.watchHelper) this.watchHelper.getRunWatchCallback(key)();
    };
  }

  setState(propChain: Array<string | number>, value: any) {
    let curr: any = this.state;
    const stateKey = propChain[0];
    for (let i = 0; i < propChain.length - 1; i++) {
      curr = curr[propChain[i]];
    }
    curr[propChain[propChain.length - 1]] = value;
    this.state[stateKey] = this.state[stateKey];
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
