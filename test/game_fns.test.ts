import { getDiff } from '../src/game/helpers';

test("get diff, all right", () => {
    const testBase = "asdf";
    const {wrong, typed} = getDiff(testBase, "asd");
    expect(typed).toBe("asd");
    expect(wrong).toBe("");
});

test("get diff, all wrong", () => {
    const testBase = "asdf";
    const {wrong, typed} = getDiff(testBase, "fasd");
    expect(typed).toBe("");
    expect(wrong).toBe("fasd");
});

test("get diff, half wrong", () => {
    const testBase = "asdf";
    const {wrong, typed} = getDiff(testBase, "asfa");
    expect(typed).toBe("as");
    expect(wrong).toBe("fa");
});
test("get diff, last wrong", () => {
    const testBase = "asdf";
    const {wrong, typed} = getDiff(testBase, "asda");
    expect(typed).toBe("asd");
    expect(wrong).toBe("a");
});

test("get diff, incomplete", () => {
    const testBase = "asdf";
    const {wrong, typed} = getDiff(testBase, "as");
    expect(wrong).toBe("");

});