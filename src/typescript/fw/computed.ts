import { constructArgs } from "../typedefs";
import { nn } from "./construct";

export default class computedHelper {
  private computedArgs;
  private computedFns;
  private nnDependencies;
  private nnState;
  constructor({
    computedArgs,
    nnState,
    nnDependencies,
    computedFns,
  }: {
    computedArgs: constructArgs["computed"];
    nnState: nn["state"];
    nnDependencies: nn["dependencies"];
    computedFns: nn["computedFns"];
  }) {
    this.computedArgs = computedArgs;
    this.nnState = nnState;
    this.computedFns = computedFns;
    this.nnDependencies = nnDependencies;
    this.initComputed();
  }
  initComputed() {
    Object.keys(this.computedArgs).forEach((computedPropName) => {
      this.initDependency(
        computedPropName,
        this.computedArgs[computedPropName].dependencies
      );
      this.computedFns[computedPropName] = this.computedArgs[
        computedPropName
      ].fn.bind(this.nnState);
    });

    const toResolve = new Set(Object.keys(this.computedArgs));
    let tries = 0;
    const maxTries = toResolve.size;
    while (tries < maxTries) {
      const arr = Array.from(toResolve);
      for (let computedPropName of arr) {
        if (this.resolveDependency(computedPropName)) {
          toResolve.delete(computedPropName);
        }
      }
      if (!toResolve.size) return;
      tries++;
    }
    throw "unable to resolve computed dependencies";
  }
  initDependency(name: string, propDependencies: Array<string>) {
    this.computedFns[name] = this.computedArgs[name].fn.bind(this.nnState);
    propDependencies.forEach((propDependency) => {
      if (propDependency in this.nnDependencies) {
        this.nnDependencies[propDependency].add(name);
      } else {
        this.nnDependencies[propDependency] = new Set([name]);
      }
    });
  }

  allDependenciesResolved(name: string) {
    const currDependencies = this.computedArgs[name].dependencies;
    return Array.from(currDependencies).every(
      (dependency) => this.nnState.state[dependency] !== undefined
    );
  }

  resolveDependency(name: string): boolean {
    if (this.allDependenciesResolved(name)) {
      this.nnState.makeReactiveData(name, this.computedFns[name]());
      return true;
    } else return false;
  }
}
