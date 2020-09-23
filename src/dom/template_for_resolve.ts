import { currLevelNodeInfoObj } from "../typedefs";
export function getCurrLevelNodes({
  nodeArrayValMap,
  referencedArray,
  scopeVars,
  iterName,
  node,
}: {
  nodeArrayValMap: Map<any, currLevelNodeInfoObj>;
  referencedArray: Array<any>;
  scopeVars: { [key: string]: any };
  iterName: string;
  node: Element;
}) {
  const used = new Set();
  return referencedArray.map((el) => {
    if (nodeArrayValMap.has(el) && !used.has(el)) {
      used.add(el);
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
}
