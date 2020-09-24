import nn from "../construct";
import { currLevelNodeInfoObj, nnForDS } from "../typedefs";
import {
  getNNForsOneLvl,
  getCurrLevelNodes,
  resolveChildFor,
} from "./template_for_resolve";

export const inRegex = /^(.*) in (.*)/;
export function getBaseStateReference(expr: string) {
  return /^.* in (\w*)/.exec(expr)[1];
}

export function getStateData(
  state: { [key: string]: any },
  capGroupTwo: string
): any {
  const propChain = capGroupTwo.split(".");
  let curr = state;
  propChain.forEach((prop) => {
    curr = curr[prop];
  });
  return curr;
}

export function resolveFor(
  state: {
    [key: string]: any;
  },
  expr: string,
  referenceNode: Element,
  scopeVars: { [key: string]: any } = {}
) {
  let initialRenderDone = false;
  const templateRoot = document.createElement("template");
  let currLevelNodes: nnForDS["nodeInfoList"];
  const nodeArrayValMap: nnForDS["valNodeInfoMap"] = new Map();
  let valRenderCallbackMap: nnForDS["valRenderCallbackMap"] = new Map();
  const nodeToForChildren: nnForDS["nodeToNNForChildrenMap"] = new Map();
  referenceNode.removeAttribute("nn-for");
  const render = () => {
    const lookup = {
      ...state,
      ...scopeVars,
    };
    if (!inRegex.test(expr)) {
      referenceNode.innerHTML = getStateData(lookup, expr);
      initialRenderDone = true;
    } else {
      const [_, iterName, inArrayName] = inRegex.exec(expr);
      const referencedArray = lookup[inArrayName] as Array<any>;
      if (currLevelNodes) {
        currLevelNodes.forEach((nodeInfo) => nodeInfo.node.remove());
      }
      currLevelNodes = getCurrLevelNodes({
        nodeArrayValMap,
        referencedArray,
        scopeVars,
        iterName,
        referenceNode,
      });
      currLevelNodes.forEach(({ node, scope }) => {
        resolveChildFor({
          node,
          scope,
          nodeToForChildren,
          valRenderCallbackMap,
          state,
        });
      });

      const resolvedNodes = currLevelNodes.map(
        (nodeData) => nodeData.node
      ) as Array<Element>;
      if (!initialRenderDone) {
        referenceNode.replaceWith(templateRoot);
      }
      replaceNodeWithNodeList(templateRoot, resolvedNodes);
      initialRenderDone = true;
    }
  };
  render();
  return render;
}

export default class templateHelper {
  private readonly nnInstance;
  constructor({ nnInstance }: { nnInstance: nn }) {
    this.nnInstance = nnInstance;
  }
  resolveNNFors(currNode: Element = this.nnInstance.$el) {
    const forNodes = getNNForsOneLvl(currNode);
    forNodes.forEach((node) => {
      const expr = node.getAttribute("nn-for");
      const cb = resolveFor(this.nnInstance.state, expr, node);
      const baseStateReferenced = getBaseStateReference(expr);
      const deps = this.nnInstance.dynamicHTMLDependencies;
      if (baseStateReferenced in deps) deps[baseStateReferenced].add(cb);
      else deps[baseStateReferenced] = new Set([cb]);
    });
  }
}

export function replaceNodeWithNodeList(
  nodeToReplace: Element,
  nodeList: Node[]
) {
  let prev: HTMLElement;
  nodeList.forEach((newNode) => {
    nodeToReplace.parentNode.insertBefore(
      newNode,
      prev ? prev.nextSibling : nodeToReplace.nextSibling
    );
    prev = newNode as HTMLElement;
  });
}
