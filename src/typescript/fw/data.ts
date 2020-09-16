export class reactiveData {
  private data;
  private dataChangedCallback;
  constructor({
    initialData,
    dataChangedCallback,
  }: {
    initialData: any;
    dataChangedCallback?: () => void;
  }) {
    this.dataChangedCallback = dataChangedCallback;
    this.data = initialData;
    if (Array.isArray(initialData)) {
      this.wrapArrayMethods();
    }
  }
  wrapArrayMethods() {
    const arrayProto = Array.prototype;
    const dcCallbackClosure = this.dataChangedCallback;
    ["sort", "pop", "push", "shift", "unshift"].forEach((pMethodName) => {
      //@ts-ignore
      const originalMethod = arrayProto[pMethodName];
      Object.defineProperty(this.data, pMethodName, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(...args: any) {
          const result = originalMethod.apply(this, args);
          dcCallbackClosure();
          return result;
        },
      });
    });
  }
  getData(): any {
    return this.data;
  }
  setData(value: any): void {
    const prev = this.data;
    this.data = value;
    if (Array.isArray(value) && value !== prev) this.wrapArrayMethods();
    if (this.dataChangedCallback) this.dataChangedCallback();
  }
}
