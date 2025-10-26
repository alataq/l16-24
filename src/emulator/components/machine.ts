import { Memory } from "./memory";
import { CPU } from "./cpu";
import { ALU } from "./alu";

export class Machine {
    public memory: Memory;
    public cpu: CPU;
    public alu: ALU

    constructor(memorySize: number){
        this.memory = new Memory(memorySize);
        this.cpu = new CPU();
        this.alu = new ALU(this);
    }
}