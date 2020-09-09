// import { nn } from './construct';
import { nnTypeDef } from '../typedefs';
import { reactiveData } from './data';
interface constructArgs {
  el?: string;
  data?: {
    [key: string]: any;
  };
  computed?: {
    [key: string]: { fn: () => any; dependencies: Array<string> };
  };

}

export class computedHelper {
  constructor(
    {
      computedArgs,
      nnState,
      nnDependencies,
      computedFns
    }: {
      computedArgs: constructArgs['computed'],
      nnState: nnTypeDef['state'],
      nnDependencies: nnTypeDef['dependencies'],
      computedFns: nnTypeDef['computedFns']
    }
  ) {

  }

export function initComputed({
    computedArgs,
    nnState,
    nnDependencies,
    computedFns
  }: {
    computedArgs: constructArgs['computed'],
    nnState: nnTypeDef['state'],
    nnDependencies: nnTypeDef['dependencies'],
    computedFns: nnTypeDef['computedFns']
  }): void {
  Object.keys(computedArgs).forEach(computedPropName => {
    initDependency(computedPropName, computedArgs[computedPropName].dependencies, nnDependencies);
  });
}

function initDependency(name: string, propDependencies: Array<string>,
  nnDependencies: nnTypeDef['dependencies']) {
  propDependencies.forEach(propDependency => {
    if (propDependency in nnDependencies) {
      nnDependencies[propDependency].add(name);
    } else {
      nnDependencies[propDependency] = new Set([name]);
    }
  });
}

function resolveDependencies(nnDependencies: nnTypeDef['dependencies']) {


}



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


