export function isObject(obj: any) {
  return obj != null && obj.constructor.name === "Object";
}
export class reactiveData {
  private data;
  private dataChangedCallback;
  constructor({
    initialData,
    dataChangedCallback,
  }: {
    initialData: any;
    dataChangedCallback: () => void;
  }) {
    this.dataChangedCallback = dataChangedCallback;
    this.data = initialData;
    if (Array.isArray(initialData)) {
      this.wrapArrayMethods();
    }
  }
  wrapArrayMethods() {
    const dcCallbackClosure = this.dataChangedCallback;
    Object.defineProperty(this.data, "__nn__wrapped", {
      enumerable: false,
      value: true,
    });
    ["sort", "pop", "push", "shift", "unshift"].forEach((pMethodName) => {
      //@ts-ignore
      const originalMethod = Array.prototype[pMethodName];
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
  wrapObjectProps() {
    Object.defineProperty(this.data, "__nn__wrapped", {
      enumerable: false,
      value: true,
    });
    Object.keys(this.data).forEach((key) => {
      let valClosure = this.data[key];
      Object.defineProperty(this.data, key, {
        get: () => valClosure,
        set: (val) => {
          valClosure = val;
          this.dataChangedCallback();
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
    if (Array.isArray(value) && value !== prev) {
      //@ts-ignore
      if (value.__nn__wrapped) {
        this.data = [...this.data];
      }
      this.wrapArrayMethods();
    } else if (isObject(value)) this.wrapObjectProps();
    if (this.dataChangedCallback) this.dataChangedCallback();
  }
}
