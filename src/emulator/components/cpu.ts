type registerValue = number;
type flagValue = 0 | 1;

export enum RegisterName {
    R0,
    R1,
    R2,
    R3,
    R4,
    R5,
    R6,
    R7,
    CP,
    SP,
}

export enum FlagName {
    ZERO,
    CARRY,
    NEGATIVE,
}

export const REGISTERS: string[] = Object.keys(RegisterName).filter(k => typeof RegisterName[k as any] === 'number');
export const FLAGS: string[] = Object.keys(FlagName).filter(k => typeof FlagName[k as any] === 'number');

export class Register {
    private value: registerValue = 0;

    public readonly MIN_VALUE: number;
    public readonly MAX_VALUE: number;

    constructor(minimum: number = 0, maximum: number = 2**16 -1) {
        this.MIN_VALUE = minimum;
        this.MAX_VALUE = maximum;
    }

    public read(){
        return this.value;
    }

    public write(value: registerValue){
        if(value < this.MIN_VALUE || value > this.MAX_VALUE){
            throw new Error("Invalid register value");
        }
        this.value = Math.floor(value);
    }
}

export class Flag {
    private value: flagValue = 0;

    public read(){
        return this.value;
    }

    public write(value: flagValue){
        if(value !== 0 && value !== 1){
            throw new Error("Invalid flag value");
        }

        this.value = value;
    }
}

export class CPU {
    public registers: { [key: number]: Register };
    public flags: { [key: number]: Flag };

    constructor() {
        this.registers = {};
        this.flags = {};

        // General-purpose registers
        this.registers[RegisterName.R0] = new Register();
        this.registers[RegisterName.R1] = new Register();
        this.registers[RegisterName.R2] = new Register();
        this.registers[RegisterName.R3] = new Register();
        this.registers[RegisterName.R4] = new Register();
        this.registers[RegisterName.R5] = new Register();
        this.registers[RegisterName.R6] = new Register();
        this.registers[RegisterName.R7] = new Register();

        // Special-purpose registers
        this.registers[RegisterName.CP] = new Register(0, 2**24 -1); // Program Counter
        this.registers[RegisterName.SP] = new Register(0, 2**12 -1); // Stack Pointer

        // Flags
        this.flags[FlagName.ZERO] = new Flag();     // Z
        this.flags[FlagName.CARRY] = new Flag();    // C
        this.flags[FlagName.NEGATIVE] = new Flag(); // N
    }
}
