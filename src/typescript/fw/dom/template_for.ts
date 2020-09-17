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
  scopeVars: { [key: string]: any } = {},
) {
  const lookup = {
    ...state,
    ...scopeVars,
  };

  if (!inRegex.test(expr)) {
    node.innerHTML = getStateData(lookup, expr);
  } else {
    const [_, iterName, inArrayName] = inRegex.exec(expr);
    console.log({iterName, inArrayName});
    const referencedArray = lookup[inArrayName] as Array<any>;
    const currLevelNodes = referencedArray.map((el) => {
      return {
        node: node.cloneNode(true),
        scope: { ...scopeVars, [iterName]: el },
      };
    });
    currLevelNodes.forEach((currLevelNode) => {
    });
    return currLevelNodes.map(nodeData => nodeData.node);
  }
}

export default class templateHelper {
  private readonly nnInstance;
  constructor({ nnInstance }: { nnInstance: nn }) {
    this.nnInstance = nnInstance;
  }
}
