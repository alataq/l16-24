import { Flag, FlagName, RegisterName, type Register } from "./cpu";
import { type Machine } from "./machine";

export class ALU {
    private machine: Machine;
    
    constructor(machine: Machine) {
        this.machine = machine;
    }
    
    public step(){
        let cp = this.machine.cpu.registers[RegisterName.CP] as Register;
        let sp = this.machine.cpu.registers[RegisterName.SP] as Register;

        let zf = this.machine.cpu.flags[FlagName.ZERO] as Flag;
        let cf = this.machine.cpu.flags[FlagName.CARRY] as Flag;
        let nf = this.machine.cpu.flags[FlagName.NEGATIVE] as Flag;

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
                break;
            }
            // Memory Operations
            case 2: {
                const SUB_OPERATION_CODE = (OPERATION >> 9) & 0x7;
                switch(SUB_OPERATION_CODE) {
                    // STR
                    case 0: {
                        const SOURCE_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const HIGH_ADDRESS_REGISTER_CODE = (OPERATION >> 3) & 0x7;
                        const LOW_ADDRESS_REGISTER_CODE = OPERATION & 0x7;

                        const SOURCE_REGISTER = this.machine.cpu.registers[SOURCE_REGISTER_CODE] as Register;
                        const HIGH_ADDRESS_REGISTER = this.machine.cpu.registers[HIGH_ADDRESS_REGISTER_CODE] as Register;
                        const LOW_ADDRESS_REGISTER = this.machine.cpu.registers[LOW_ADDRESS_REGISTER_CODE] as Register;

                        const ADDRESS = ((HIGH_ADDRESS_REGISTER.read() << 8) | ((LOW_ADDRESS_REGISTER.read() >> 8) & 0xFF)) & 0xFFFFFF;

                        this.machine.memory.write16(ADDRESS, SOURCE_REGISTER.read());

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // LOD
                    case 1: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const HIGH_ADDRESS_REGISTER_CODE = (OPERATION >> 3) & 0x7;
                        const LOW_ADDRESS_REGISTER_CODE = OPERATION & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const HIGH_ADDRESS_REGISTER = this.machine.cpu.registers[HIGH_ADDRESS_REGISTER_CODE] as Register;
                        const LOW_ADDRESS_REGISTER = this.machine.cpu.registers[LOW_ADDRESS_REGISTER_CODE] as Register;

                        const ADDRESS = ((HIGH_ADDRESS_REGISTER.read() << 8) | ((LOW_ADDRESS_REGISTER.read() >> 8) & 0xFF)) & 0xFFFFFF;

                        TARGET_REGISTER.write(this.machine.memory.read16(ADDRESS));

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                }
                break;
            }
            // Mathematic operations
            case 3: {
                const SUB_OPERATION_CODE = (OPERATION >> 9) & 0x7;
                switch(SUB_OPERATION_CODE){
                    // ADD
                    case 0: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 3) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = OPERATION & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const TOTAL = SOURCE_REGISTER_ONE.read() + SOURCE_REGISTER_TWO.read();

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        if(TOTAL >= 2**16){
                            cf.write(1);
                        } else {
                            cf.write(0);
                        }

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // SUB
                    case 1: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 3) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = OPERATION & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const TOTAL = SOURCE_REGISTER_ONE.read() - SOURCE_REGISTER_TWO.read();

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        if(TOTAL < 0){
                            nf.write(1);
                        } else {
                            nf.write(0);
                        }

                        cf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // MUL
                    case 2: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 3) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = OPERATION & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const TOTAL = SOURCE_REGISTER_ONE.read() * SOURCE_REGISTER_TWO.read();

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        if(TOTAL >= 2**16){
                            cf.write(1);
                        } else {
                            cf.write(0);
                        }

                        nf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // DIV
                    case 3: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 3) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = OPERATION & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const DIVISOR = SOURCE_REGISTER_TWO.read();

                        if (DIVISOR === 0) {
                            zf.write(0);
                            cf.write(1);
                            nf.write(0);
                        } else {
                            const TOTAL = Math.floor(SOURCE_REGISTER_ONE.read() / DIVISOR);

                            if(TOTAL === 0){
                                zf.write(1);
                            } else {
                                zf.write(0);
                            }

                            if (SOURCE_REGISTER_ONE.read() % DIVISOR !== 0) {
                                cf.write(1);
                            } else {
                                cf.write(0);
                            }
                            
                            nf.write(0);

                            TARGET_REGISTER.write(TOTAL);
                        }

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // INC
                    case 4: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;

                        const TOTAL = TARGET_REGISTER.read() + 1;

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        if(TOTAL >= 2**16){
                            cf.write(1);
                        } else {
                            cf.write(0);
                        }

                        nf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // DEC
                    case 5: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;

                        const TOTAL = TARGET_REGISTER.read() - 1;

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        if(TOTAL < 0){
                            nf.write(1);
                        } else {
                            nf.write(0);
                        }

                        cf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                }
                break;
            }
            // Logical Operations
            case 4: {
                const SUB_OPERATION_CODE = (OPERATION >> 9) & 0x7;
                switch(SUB_OPERATION_CODE){
                    // AND
                    case 0: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 3) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = OPERATION & 0x07;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const TOTAL = SOURCE_REGISTER_ONE.read() & SOURCE_REGISTER_TWO.read();

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        cf.write(0);
                        nf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // OR
                    case 1: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 3) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = OPERATION & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const TOTAL = SOURCE_REGISTER_ONE.read() | SOURCE_REGISTER_TWO.read();

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        cf.write(0);
                        nf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // XOR
                    case 2: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 3) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = OPERATION & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const TOTAL = SOURCE_REGISTER_ONE.read() ^ SOURCE_REGISTER_TWO.read();

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        cf.write(0);
                        nf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // NOT
                    case 3: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE = (OPERATION >> 3) & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER = this.machine.cpu.registers[SOURCE_REGISTER_CODE] as Register;

                        const TOTAL = ~SOURCE_REGISTER.read();

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        cf.write(0);
                        nf.write(1);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // SHL
                    case 4: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE = (OPERATION >> 3) & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER = this.machine.cpu.registers[SOURCE_REGISTER_CODE] as Register;

                        const TOTAL = SOURCE_REGISTER.read() << 1;

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        if(TOTAL >= 2**16){
                            cf.write(1);
                        } else {
                            cf.write(0);
                        }

                        nf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // SHR
                    case 5: {
                        const TARGET_REGISTER_CODE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE = (OPERATION >> 3) & 0x7;

                        const TARGET_REGISTER = this.machine.cpu.registers[TARGET_REGISTER_CODE] as Register;
                        const SOURCE_REGISTER = this.machine.cpu.registers[SOURCE_REGISTER_CODE] as Register;

                        const TOTAL = SOURCE_REGISTER.read() >> 1;

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        if(TOTAL < 0){
                            nf.write(1);
                        } else {
                            nf.write(0);
                        }

                        cf.write(0);

                        TARGET_REGISTER.write(TOTAL);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                    // CMP
                    case 6: {
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = (OPERATION >> 3) & 0x7;

                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const TOTAL = SOURCE_REGISTER_ONE.read() - SOURCE_REGISTER_TWO.read();

                        if(TOTAL === 0){
                            zf.write(1);
                        } else {
                            zf.write(0);
                        }

                        if(TOTAL < 0){
                            nf.write(1);
                        } else {
                            nf.write(0);
                        }

                        cf.write(0);

                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                }
                break;
            }
            // Flow Operations
            case 5: {
                const SUB_OPERATION_CODE = (OPERATION >> 9) & 0x7;
                switch(SUB_OPERATION_CODE){
                    // JMP
                    case 0: {
                        const SECOND_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 2);
                        const THIRD_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 4);

                        // 16 bits of second word, 8 bits of third word
                        const ADDRESS = ((SECOND_WORD << 8) | ((THIRD_WORD >> 8) & 0xFF))

                        cp.write(ADDRESS);
                        break;
                    }
                    // JEQ
                    case 1: {
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = (OPERATION >> 3) & 0x7;

                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const IS_EQUAL = SOURCE_REGISTER_ONE.read() === SOURCE_REGISTER_TWO.read();

                        if(!IS_EQUAL){
                            cp.write(OPERATION_ADDRESS + 6);
                            break;
                        }

                        const SECOND_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 2);
                        const THIRD_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 4);

                        const ADDRESS = ((SECOND_WORD << 8) | ((THIRD_WORD >> 8) & 0xFF))

                        cp.write(ADDRESS);
                        break;
                    }
                    // JPF
                    case 2: {
                        const FLAGS = (OPERATION >> 6) & 0x7;

                        const ZERO_FLAG = FLAGS & 0b100;
                        const CARRY_FLAG = FLAGS & 0b010;
                        const NEGATIVE_FLAG = FLAGS & 0b001;

                        if(ZERO_FLAG && !zf.read()){
                            cp.write(OPERATION_ADDRESS + 6);
                            break;
                        }

                        if(CARRY_FLAG && !cf.read()){
                            cp.write(OPERATION_ADDRESS + 6);
                            break;
                        }

                        if(NEGATIVE_FLAG && !nf.read()){
                            cp.write(OPERATION_ADDRESS + 6);
                            break;
                        }

                        const SECOND_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 2);
                        const THIRD_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 4);

                        const ADDRESS = ((SECOND_WORD << 8) | ((THIRD_WORD >> 8) & 0xFF))

                        cp.write(ADDRESS);
                        break;
                    }
                    // CAL
                    case 3: {
                        const SECOND_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 2);
                        const THIRD_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 4);

                        const ADDRESS = ((SECOND_WORD << 8) | ((THIRD_WORD >> 8) & 0xFF))

                        sp.write(sp.read() + 1);
                        this.machine.stack.push(cp.read());

                        cp.write(ADDRESS);
                        break;
                    }
                    // CEQ
                    case 4: {
                        const SOURCE_REGISTER_CODE_ONE = (OPERATION >> 6) & 0x7;
                        const SOURCE_REGISTER_CODE_TWO = (OPERATION >> 3) & 0x7;

                        const SOURCE_REGISTER_ONE = this.machine.cpu.registers[SOURCE_REGISTER_CODE_ONE] as Register;
                        const SOURCE_REGISTER_TWO = this.machine.cpu.registers[SOURCE_REGISTER_CODE_TWO] as Register;

                        const IS_EQUAL = SOURCE_REGISTER_ONE.read() === SOURCE_REGISTER_TWO.read();

                        if(!IS_EQUAL){
                            cp.write(OPERATION_ADDRESS + 6);
                            break;
                        }

                        const SECOND_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 2);
                        const THIRD_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 4);

                        const ADDRESS = ((SECOND_WORD << 8) | ((THIRD_WORD >> 8) & 0xFF))

                        sp.write(sp.read() + 1);
                        this.machine.stack.push(cp.read());

                        cp.write(ADDRESS);
                        break;
                    }
                    // CLF
                    case 5: {
                        const FLAGS = (OPERATION >> 6) & 0x7;

                        const ZERO_FLAG = FLAGS & 0b100;
                        const CARRY_FLAG = FLAGS & 0b010;
                        const NEGATIVE_FLAG = FLAGS & 0b001;

                        if(ZERO_FLAG && !zf.read()){
                            cp.write(OPERATION_ADDRESS + 6);
                            break;
                        }

                        if(CARRY_FLAG && !cf.read()){
                            cp.write(OPERATION_ADDRESS + 6);
                            break;
                        }

                        if(NEGATIVE_FLAG && !nf.read()){
                            cp.write(OPERATION_ADDRESS + 6);
                            break;
                        }

                        const SECOND_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 2);
                        const THIRD_WORD = this.machine.memory.read16(OPERATION_ADDRESS + 4);

                        const ADDRESS = ((SECOND_WORD << 8) | ((THIRD_WORD >> 8) & 0xFF));

                        sp.write(sp.read() + 1);
                        this.machine.stack.push(cp.read());

                        cp.write(ADDRESS);
                        break;
                    }
                    // RET
                    case 6: {
                        cp.write(this.machine.stack.pop() + 2);
                        break;
                    }
                    // INT
                    case 7: {
                        // TO IMPLEMENT LATER
                        cp.write(OPERATION_ADDRESS + 2);
                        break;
                    }
                }
                break;
            }
        }
    }
}
