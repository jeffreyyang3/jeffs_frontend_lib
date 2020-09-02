interface constructArgs {
  el: string;
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
  constructor({ el, data }: constructArgs) {
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
  initData({ data }: constructArgs["data"]) {
    Object.keys(data).forEach((key) => {});
  }
}
