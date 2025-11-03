import { Memory } from "./memory";
import { CPU } from "./cpu";
import { ALU } from "./alu";
import { Stack } from "./stack";

export class Machine {
    public memory: Memory;
    public cpu: CPU;
    public alu: ALU;
    public stack: Stack;
    public isRunning: boolean = true;

    constructor(memorySize: number){
        this.memory = new Memory(memorySize);
        this.cpu = new CPU;
        this.alu = new ALU(this);
        this.stack = new Stack;
    }
}