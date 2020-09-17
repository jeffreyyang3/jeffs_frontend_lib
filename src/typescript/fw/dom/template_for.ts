import { resolve } from "../../../../webpack.config";
import nn from "../construct";

export const inRegex = /^(.*) in (.*)/;

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
  node: Element,
  scopeVars: { [key: string]: any } = {}
) {
  const lookup = {
    ...state,
    ...scopeVars,
  };

  if (!inRegex.test(expr)) {
    node.innerHTML = getStateData(lookup, expr);
    return [node];
  } else {
    const [_, iterName, inArrayName] = inRegex.exec(expr);
    const referencedArray = lookup[inArrayName] as Array<any>;
    const currLevelNodes = referencedArray.map((el) => {
      return {
        node: node.cloneNode(true),
        scope: { ...scopeVars, [iterName]: el },
      };
    });
    currLevelNodes.forEach((nodeInfo) => {
      const htmlNode = nodeInfo.node as HTMLElement;
      htmlNode.querySelectorAll("*[nn-for]").forEach((forNode) => {
        resolveFor(
          state,
          forNode.getAttribute("nn-for"),
          forNode,
          nodeInfo.scope
        );
      });
    });
    const resolvedNodes = currLevelNodes.map(
      (nodeData) => nodeData.node
    ) as Array<Element>;
    replaceNodeWithNodeList(node, resolvedNodes);
    return resolvedNodes;
  }
}

export default class templateHelper {
  private readonly nnInstance;
  constructor({ nnInstance }: { nnInstance: nn }) {
    this.nnInstance = nnInstance;
  }
  resolveNNFors() {
    const nnBaseNode = this.nnInstance.$el;
    const forNodes = nnBaseNode.querySelectorAll("*[nn-for]");
    forNodes.forEach((node) => {
      resolveFor(this.nnInstance.state, node.getAttribute("nn-for"), node);
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
    // @ts-ignore
    console.log(nodeToReplace.parentNode.innerHTML);
  });
  nodeToReplace.remove();
}
