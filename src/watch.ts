import nn from "./index";
import { constructArgs } from "./typedefs";

export default class watchHelper {
  private readonly nnInstance;
  private readonly watchArgs;
  constructor({
    nnInstance,
    watchArgs
  }: {
    nnInstance: nn;
    watchArgs: constructArgs["watch"];
  }) {
    this.nnInstance = nnInstance;
    this.watchArgs = watchArgs;
  }
  getRunWatchCallback(key: string) {
    return (prevVal: any) => {
      if (key in this.watchArgs)
        this.watchArgs[key].bind(this.nnInstance)(prevVal);
    };
  }
}
