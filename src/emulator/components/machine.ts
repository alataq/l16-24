import { Memory } from "./memory";
import { CPU } from "./cpu";

export class Machine {
    public memory: Memory;
    public cpu: CPU;

    constructor(memorySize: number){
        this.memory = new Memory(memorySize);
        this.cpu = new CPU();
    }
}