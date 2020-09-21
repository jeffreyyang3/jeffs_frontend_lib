import nn from "../construct";

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
  node: Element,
  scopeVars: { [key: string]: any } = {}
) {
  let initialRenderDone = false;
  interface currLevelNodeInfoObj {
    node: Element;
    scope: { [key: string]: any };
  }
  let currLevelNodes: Array<currLevelNodeInfoObj>;
  const nodeArrayValMap = new Map<any, currLevelNodeInfoObj>();
  const templateRoot = document.createElement("template");
  let childCallbacks = new Map<any, Function>();
  const currLevelNNForChildren = new Map<any, Array<Element>>();
  node.removeAttribute("nn-for");

  const render = () => {
    const lookup = {
      ...state,
      ...scopeVars,
    };
    if (!inRegex.test(expr)) {
      node.innerHTML = getStateData(lookup, expr);
      initialRenderDone = true;
    } else {
      const [_, iterName, inArrayName] = inRegex.exec(expr);
      const referencedArray = lookup[inArrayName] as Array<any>;
      const used = new Set();
      if (currLevelNodes)
        currLevelNodes.forEach((nodeInfo) => nodeInfo.node.remove());
      currLevelNodes = referencedArray.map((el) => {
        if (nodeArrayValMap.has(el) && !used.has(el)) {
          used.add(el);
          console.log("hitting cache");
          return nodeArrayValMap.get(el);
        }
        const currLevelNodeInfo = {
          node: node.cloneNode(true) as Element,
          scope: { ...scopeVars, [iterName]: el },
        };
        nodeArrayValMap.set(el, currLevelNodeInfo);
        used.add(el);
        return currLevelNodeInfo;
      });
      currLevelNodes.forEach((nodeInfo) => {
        const htmlNode = nodeInfo.node as HTMLElement;
        let lst;
        if (currLevelNNForChildren.get(htmlNode))
          lst = currLevelNNForChildren.get(htmlNode);
        else {
          lst = getNNForsOneLvl(htmlNode);
          currLevelNNForChildren.set(htmlNode, lst);
        }

        lst.forEach((forNode) => {
          if (childCallbacks.has(forNode)) {
            childCallbacks.get(forNode)();
          } else
            childCallbacks.set(
              forNode,
              resolveFor(
                state,
                forNode.getAttribute("nn-for"),
                forNode,
                nodeInfo.scope
              )
            );
        });
      });
      const resolvedNodes = currLevelNodes.map(
        (nodeData) => nodeData.node
      ) as Array<Element>;
      if (!initialRenderDone) {
        node.replaceWith(templateRoot);
      }
      replaceNodeWithNodeList(templateRoot, resolvedNodes);
      initialRenderDone = true;
      // return resolvedNodes;
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
      const cb = resolveFor(
        this.nnInstance.state,
        node.getAttribute("nn-for"),
        node
      );
      //@ts-ignore
      window.y = cb;
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
