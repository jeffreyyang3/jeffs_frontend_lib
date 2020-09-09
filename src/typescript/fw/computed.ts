// import { nn } from './construct';
import { nnTypeDef } from '../typedefs';
interface constructArgs {
  el?: string;
  data?: {
    [key: string]: any;
  };
  computed?: {
    [key: string]: { fn: () => any; dependencies: Array<string> };
  };

}

export default class nnComputed {
  initComputed({
    computedArgs,
    nnState,
    dependencies
  }: {
    computedArgs: constructArgs['computed'],
    nnState: nnTypeDef['state'],
    dependencies: nnTypeDef['dependencies']
  }): void {

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


};
