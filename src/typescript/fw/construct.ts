interface constructArgs {
  el?: string;
  data?: {
    [key: string]: any;
  };
}

interface nnHTMLElement extends HTMLElement {
  __nn__: noName;
}

export class noName {
  public $el: nnHTMLElement;
  public reactiveNodes: NodeList;
  public error: string;
  public data: constructArgs["data"];
  public state: constructArgs["data"];

  constructor({ el, data }: constructArgs) {
    this.data = {};
    this.state = {};
    if (el) this.attach(el);
    if (data) this.initData(data);
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
        console.log("set called");
        this.data[key] = val;
      },
    });
  }
}
