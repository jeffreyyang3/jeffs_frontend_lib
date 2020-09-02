export class noName {
  el: string;
  constructor() {
    this.el = "#asdf";
  }
  bark(sound: string): string {
    this.el = sound;
    return sound;
  }
}
