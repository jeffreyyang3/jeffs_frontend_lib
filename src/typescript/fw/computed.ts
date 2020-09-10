// import { nn } from './construct';
import { nnTypeDef } from "../typedefs";
import { reactiveData } from "./data";
interface constructArgs {
  el?: string;
  data?: {
    [key: string]: any;
  };
  computed?: {
    [key: string]: { fn: () => any; dependencies: Array<string> };
  };
}

export default class computedHelper {
  private computedArgs;
  private computedFns;
  private nnDependencies;
  private nnState;
  constructor({
    computedArgs,
    nnState,
    nnDependencies,
    computedFns
  }: {
    computedArgs: constructArgs["computed"];
    nnState: nnTypeDef["state"];
    nnDependencies: nnTypeDef["dependencies"];
    computedFns: nnTypeDef["computedFns"];
  }) {
    this.computedArgs = computedArgs;
    this.nnState = nnState;
    this.computedFns = computedFns;
    this.nnDependencies = nnDependencies;
    this.initComputed();
  }
  initComputed() {
    Object.keys(this.computedArgs).forEach(computedPropName => {
      this.initDependency(
        computedPropName,
        this.computedArgs[computedPropName].dependencies
      );
    });
    Object.keys(this.computedArgs).forEach(computedPropName => {
      this.resolveDependency(computedPropName);
    });
  }
  initDependency(name: string, propDependencies: Array<string>) {
    this.computedFns[name] = this.computedArgs[name].fn.bind(this.nnState);
    propDependencies.forEach(propDependency => {
      if (propDependency in this.nnDependencies) {
        this.nnDependencies[propDependency].add(name);
      } else {
        this.nnDependencies[propDependency] = new Set([name]);
      }
    });
  }

  resolveDependency(name: string) {
    this.computedFns[name] = this.computedArgs[name].fn.bind(this.nnState);
    this.nnState.makeReactiveData(name, this.computedFns[name]());
  }
}

function initDependency(
  name: string,
  propDependencies: Array<string>,
  nnDependencies: nnTypeDef["dependencies"]
) {
  propDependencies.forEach(propDependency => {
    if (propDependency in nnDependencies) {
      nnDependencies[propDependency].add(name);
    } else {
      nnDependencies[propDependency] = new Set([name]);
    }
  });
}

export function initComputed({
  computedArgs,
  nnState,
  nnDependencies,
  computedFns
}: {
  computedArgs: constructArgs["computed"];
  nnState: nnTypeDef["state"];
  nnDependencies: nnTypeDef["dependencies"];
  computedFns: nnTypeDef["computedFns"];
}): void {
  Object.keys(computedArgs).forEach(computedPropName => {
    initDependency(
      computedPropName,
      computedArgs[computedPropName].dependencies,
      nnDependencies
    );
  });
}

function resolveDependencies(nnDependencies: nnTypeDef["dependencies"]) {}

// initComputed(this: noName, computed: constructArgs["computed"]) {
//   Object.keys(computed).forEach((computedPropName) => {
//     const { fn, dependencies } = computed[computedPropName];
//     this.computeFns[computedPropName] = fn.bind(this);
//     this.state[computedPropName] = this.computeFns[computedPropName]();
//     dependencies.forEach(computedDependency => {
//       if (this.dependencies[computedDependency]) this.dependencies[computedDependency].add(computedPropName);
//       else this.dependencies[computedDependency] = new Set([computedPropName]);
//     });
//   });

// }
