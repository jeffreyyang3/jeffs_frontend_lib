import { constructArgs, nnHTMLElement } from '../typedefs';
export class nn implements noName {
  $el: nnHTMLElement;
  reactiveNodes: NodeList;
  error: string;
  data: constructArgs["data"];
  state: constructArgs["data"];
  computeFns: {
    [key: string]: () => any
  };
  dependencies: {
    [key: string]: Set<string>;
  };
  constructor({ el, data, computed }: constructArgs) {

    this.data = {};
    this.state = {};
    this.dependencies = {};
    this.computeFns = {};
    if (el) this.attach(el);
    if (data) this.initData(data);
    if (computed) this.initComputed(computed);

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
    Object.keys(data).forEach((key) => {
      this.makeReactiveProp(key, data[key]);
    });
    console.log(this.data);
  }



  makeReactiveProp(key: string, value: any) {
    this.data[key] = value;
    Object.defineProperty(this.state, key, {
      get: () => {
        console.log("get called");
        return this.data[key];
      },
      set: (val) => {
        this.data[key] = val;
        if (key in this.dependencies) {
          this.dependencies[key].forEach(computedPropertyName => {
            this.state[computedPropertyName] = this.computeFns[computedPropertyName]();
          });
        }
      },
    });
  }
}
