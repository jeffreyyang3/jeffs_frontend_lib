import nn from "../construct";
import { currLevelNodeInfoObj, nnForDS } from "../typedefs";

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
  let childCallbacks: nnForDS["valRenderCallbackMap"] = new Map();
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
      const used = new Set();
      if (currLevelNodes) {
        currLevelNodes.forEach((nodeInfo) => nodeInfo.node.remove());
      }
      currLevelNodes = referencedArray.map((el) => {
        if (nodeArrayValMap.has(el) && !used.has(el)) {
          used.add(el);
          return nodeArrayValMap.get(el);
        }
        const currLevelNodeInfo = {
          node: referenceNode.cloneNode(true) as Element,
          scope: { ...scopeVars, [iterName]: el },
        };
        nodeArrayValMap.set(el, currLevelNodeInfo);
        used.add(el);
        return currLevelNodeInfo;
      });
      currLevelNodes.forEach((nodeInfo) => {
        const htmlNode = nodeInfo.node as HTMLElement;
        let lst;
        if (nodeToForChildren.get(htmlNode))
          lst = nodeToForChildren.get(htmlNode);
        else {
          lst = getNNForsOneLvl(htmlNode);
          nodeToForChildren.set(htmlNode, lst);
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
        referenceNode.replaceWith(templateRoot);
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
