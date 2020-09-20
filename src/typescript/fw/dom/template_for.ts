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
  let initialRenderDone = false;
  let currLevelNodes;
  const nodeArrayValMap = new Map();

  const render = () => {
    if (!inRegex.test(expr)) {
      node.innerHTML = getStateData(lookup, expr);
      initialRenderDone = true;
      return [node];
    } else {
      const [_, iterName, inArrayName] = inRegex.exec(expr);
      const referencedArray = lookup[inArrayName] as Array<any>;
      const used = new Set();
      currLevelNodes = referencedArray.map((el) => {
        if (nodeArrayValMap.has(el) && !used.has(el)) {
          used.add(el);
          return nodeArrayValMap.get(el);
        }
        const currLevelNodeInfo = {
          node: node.cloneNode(true),
          scope: { ...scopeVars, [iterName]: el },
          el,
        };
        nodeArrayValMap.set(el, currLevelNodeInfo);
        used.add(el);
        return currLevelNodeInfo;
      });
      currLevelNodes.forEach((nodeInfo) => {
        const htmlNode = nodeInfo.node as HTMLElement;
        getNNForsOneLvl(htmlNode).forEach((forNode) => {
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
      initialRenderDone = true;
      return resolvedNodes;
    }
  };
  render();
  return render;
}

export function getNNForsOneLvl(parentNode: Element) {
  const allNNFors = parentNode.querySelectorAll("*[nn-for]");
  const invalidParents: Array<Element> = [];
  // qs should be depth first preorder
  return Array.from(allNNFors).filter((el) => {
    const returnVal = !invalidParents.some((parent) => {
      return parent.contains(el);
    });
    invalidParents.push(el);
    return returnVal;
  });
}
export default class templateHelper {
  private readonly nnInstance;
  constructor({ nnInstance }: { nnInstance: nn }) {
    this.nnInstance = nnInstance;
  }
  resolveNNFors(currNode: Element = this.nnInstance.$el) {
    const forNodes = getNNForsOneLvl(currNode);
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
  });
  nodeToReplace.remove();
}
