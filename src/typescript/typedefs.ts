import { nn } from './fw/construct';
import { JSDOM } from 'jsdom';

export interface constructArgs {
  el?: string;
  data?: {
    [key: string]: any;
  };
  computed?: {
    [key: string]: { fn: () => any; dependencies: Array<string> };
  };
  jsDocument?: JSDOM["window"]["document"]

}

export interface nnHTMLElement extends HTMLElement {
  __nn__: nn;
}

export abstract class nnTypeDef {
  $el: nnHTMLElement;
  reactiveNodes: NodeList;
  error: string;
  data: constructArgs["data"];
  state: constructArgs["data"];
  computedFns: {
    [key: string]: () => any
  };
  dependencies: {
    [key: string]: Set<string>;
  };

}

/*
on adding a data property:
closure data
on set:
  set to closure
  find self in dependencies, trigger update on all
on get: return from closure

update functions held in computeFns

*/
