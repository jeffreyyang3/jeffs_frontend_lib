import { currLevelNodeInfoObj, nnForDS } from "../typedefs";
import { resolveFor } from "./template_for";
export function getCurrLevelNodes({
  nodeArrayValMap,
  referencedArray,
  scopeVars,
  iterName,
  referenceNode,
}: {
  nodeArrayValMap: nnForDS["valNodeInfoMap"];
  referencedArray: Array<any>;
  scopeVars: { [key: string]: any };
  iterName: string;
  referenceNode: Element;
}) {
  const used = new Set();
  return referencedArray.map((el) => {
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
}

export function resolveChildFor({
  node,
  scope,
  nodeToForChildren,
  valRenderCallbackMap,
  state,
}: {
  node: Element;
  scope: currLevelNodeInfoObj["scope"];
  nodeToForChildren: nnForDS["nodeToNNForChildrenMap"];
  valRenderCallbackMap: nnForDS["valRenderCallbackMap"];
  state: { [key: string]: any };
}) {
  let currNodeForChildren: Array<Element>;
  if (nodeToForChildren.get(node))
    currNodeForChildren = nodeToForChildren.get(node);
  else {
    currNodeForChildren = getNNForsOneLvl(node);
    nodeToForChildren.set(node, currNodeForChildren);
  }
  currNodeForChildren.forEach((childForNode) => {
    if (valRenderCallbackMap.has(childForNode)) {
      valRenderCallbackMap.get(childForNode)();
    } else
      valRenderCallbackMap.set(
        childForNode,
        resolveFor(
          state,
          childForNode.getAttribute("nn-for"),
          childForNode,
          scope
        )
      );
  });
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
