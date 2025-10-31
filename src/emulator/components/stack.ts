export class Stack{
    private data: Int32Array;
    private head: number;

    public static readonly maxSize = 2**12 -1;

    constructor(){
        this.data = new Int32Array(Stack.maxSize);
        this.head = -1;
    }

    public get size(): number {
        return this.head + 1;
    }

    public push(value: number){
        if(this.size === Stack.maxSize){
            throw new Error("Stack overflow");
        }

        this.head++;
        this.data[this.head] = value;
    }

    public pop(): number {
        if(this.size === 0){
            throw new Error("Stack underflow");
        }

        return this.data[this.head--] as number;
    }

    public peek(): number {
        if(this.size === 0){
            throw new Error("Stack underflow");
        }

        return this.data[this.head] as number;
    }
}