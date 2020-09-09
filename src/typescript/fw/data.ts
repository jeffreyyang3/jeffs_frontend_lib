export class reactiveData {
    data: any;
    dataChangedCallback: (value: any) => void;
    constructor({ initialData, dataChangedCallback }:
        { initialData: any, dataChangedCallback?: (value: any) => void }) {
        this.dataChangedCallback = dataChangedCallback;
        this.data = initialData;
    }
    getData(): any {
        return this.data;
    }
    setData(value: any): void {
        this.data = value;
        if (this.dataChangedCallback)
            this.dataChangedCallback(value);
    }

}
