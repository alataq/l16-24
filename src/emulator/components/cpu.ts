type registerValue = number;
type flagValue = 0 | 1;

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
    public registers: { [key: string]: Register };
    public flags: { [key: string]: Flag };

    constructor() {
        this.registers = {};
        this.flags = {};

        // General-purpose registers
        this.registers["r0"] = new Register();
        this.registers["r1"] = new Register();
        this.registers["r2"] = new Register();
        this.registers["r3"] = new Register();
        this.registers["r4"] = new Register();
        this.registers["r5"] = new Register();
        this.registers["r6"] = new Register();
        this.registers["r7"] = new Register();

        // Special-purpose registers - using standard, descriptive names
        this.registers["cp"] = new Register(0, 2**16 -1); // Program Counter
        this.registers["sp"] = new Register(0, 2**12 -1); // Stack Pointer

        // Flags
        this.flags["zero"] = new Flag();     // Z
        this.flags["carry"] = new Flag();    // C
        this.flags["negative"] = new Flag(); // N
    }
}
