import { nn } from "./fw/construct";
import { JSDOM } from "jsdom";

export interface constructArgs {
  el?: string;
  data?: {
    [key: string]: any;
  };
  computed?: {
    [key: string]: { fn: () => any; dependencies: Array<string> };
  };
  watch?: {
    [key: string]: () => any
  }
  jsDocument?: JSDOM["window"]["document"];

}

export interface nnHTMLElement extends HTMLElement {
  __nn__: nn;
}
