import { RegisterName, type Register } from "./cpu";
import { type Machine } from "./machine";

export class ALU {
    private machine: Machine;
    
    constructor(machine: Machine) {
        this.machine = machine;
    }
    
    public step(){
        let cp = this.machine.cpu.registers[RegisterName.CP] as Register;

        const OPERATION_ADDRESS = cp.read();
        const OPERATION = this.machine.memory.read16(OPERATION_ADDRESS) as number;
        const OPERATION_CODE = OPERATION >> 12;

        switch(OPERATION_CODE) {
            // NOP
            case 0: {
                cp.write(OPERATION_ADDRESS + 2);
                break;
            }
            // Registers Operations
            case 1: {
                const SUB_OPERATION_CODE = (OPERATION >> 9) & 0x7;
                switch(SUB_OPERATION_CODE) {
                    // LDI
                    case 0: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SECOND_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 2);

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;

                        TARGET_REGISTER.write(SECOND_WORD);

                        cp.write(OPERATION_ADDRESS + 4);
                        break;
                    }
                    // MOV
                    case 1: {
                        const SOURCE_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const TARGET_REGISTER_CODE = (OPERATION >> 3) & 0x7;

                        const SOURCE_REGISTER = this.machine.cpu.registers[SOURCE_REGISTER_CODE] as Register;
                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;

                        TARGET_REGISTER.write(SOURCE_REGISTER.read());

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                }
            }
        }
    }
}