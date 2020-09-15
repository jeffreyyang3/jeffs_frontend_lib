import { constructArgs } from "../typedefs";
import { nn } from "./construct";

export default class computedHelper {
  private computedArgs;
  private computedFns;
  private nnDependencies;
  private nnInstance;

  constructor({
    computedArgs,
    nnDependencies,
    computedFns,
    nnInstance,
  }: {
    computedArgs: constructArgs["computed"];
    nnDependencies: nn["dependencies"];
    computedFns: nn["computedFns"];
    nnInstance: nn;
  }) {
    this.computedArgs = computedArgs;
    this.nnInstance = nnInstance;
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
      ].fn.bind(this.nnInstance);
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
    this.computedFns[name] = this.computedArgs[name].fn.bind(this.nnInstance);
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
      (dependency) => this.nnInstance.state[dependency] !== undefined
    );
  }

  resolveDependency(name: string): boolean {
    if (this.allDependenciesResolved(name)) {
      this.nnInstance.makeReactiveData(name, this.computedFns[name]());
      return true;
    } else return false;
  }

  getUpdateComputedCallback(key: string) {
    return () => {
      if (key in this.nnInstance.dependencies) {
        Array.from(this.nnInstance.dependencies[key]).forEach(
          (computedDependent) => {
            this.nnInstance.state[computedDependent] = this.computedFns[
              computedDependent
            ]();
          }
        );
      }
    };
  }
}
