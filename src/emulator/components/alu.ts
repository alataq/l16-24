import type { Register } from "./cpu";
import { type Machine } from "./machine";

export class ALU {
    private machine: Machine;
    
    constructor(machine: Machine) {
        this.machine = machine;
    }
    
    public step(){
        let cp = this.machine.cpu.registers["cp"] as Register;

        const OPERATION_ADDRESS = cp.read();
        const OPERATION = this.machine.memory.read16(OPERATION_ADDRESS) as number;
        const OPERATION_CODE = OPERATION >> 12;

        switch(OPERATION_CODE) {
            case 0: {
                cp.write(OPERATION_ADDRESS + 2);
                break;
            }
            case 1: {
                const SUB_OPERATION_CODE = (OPERATION >> 9) & 0x7;
                
            }
        }


    }
}