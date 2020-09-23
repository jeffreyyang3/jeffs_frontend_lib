import nn from "./construct";

export interface constructArgs {
  el?: string;
  data?: {
    [key: string]: any;
  };
  computed?: {
    [key: string]: { fn: () => any; dependencies: Array<string> };
  };
  watch?: {
    [key: string]: () => any;
  };
}

export interface nnHTMLElement extends HTMLElement {
  __nn__: nn;
}
export interface currLevelNodeInfoObj {
  node: Element;
  scope: { [key: string]: any };
}

export interface nnForDS {
  nodeInfoObj: currLevelNodeInfoObj;
  valNodeInfoMap: Map<any, currLevelNodeInfoObj>;
  valRenderCallbackMap: Map<Element, Function>;
  nodeToNNForChildrenMap: Map<Element, Array<Element>>;
  nodeInfoList: Array<currLevelNodeInfoObj>;
}
