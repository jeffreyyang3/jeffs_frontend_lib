import nn from '../construct';
export const inRegex = /^(.*) in (.*)/;
export const getStateData = ({ state, capGroupTwo }: {
    state: {
        [key: string]: any
    },
    capGroupTwo: string
}) : any => {
    const propChain = capGroupTwo.split(".");
    let curr = state;
    propChain.forEach(prop => {
        curr = curr[prop];
    });
    return curr;
}
export default class templateHelper {
    private readonly nnInstance;
    constructor({ nnInstance }: { nnInstance : nn }) {
        this.nnInstance = nnInstance;
    }

}
