import nn from './construct';
import { constructArgs } from "../typedefs";

export default class watchHelper { // might be kinda extra
    private readonly nnInstance;
    private readonly watchArgs;
    constructor({ nnInstance,  watchArgs }: { nnInstance : nn, watchArgs: constructArgs["watch"] }) {
        this.nnInstance = nnInstance;
        this.watchArgs = watchArgs;
    }
    getRunWatchCallback (key : string) {
        return () => {
            if (key in this.watchArgs) this.watchArgs[key].bind(this.nnInstance)();
        }
    }
}