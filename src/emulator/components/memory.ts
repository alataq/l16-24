export class Memory {
    public readonly size: number;
    private memory: Uint8Array;


    constructor(size: number){
        if (size < 2**22 || size > 2**24) {
            throw new Error("Memory size must be between 4MB and 16MB");
        }

        if ((size & (size - 1)) !== 0) {
            throw new Error("Memory size must be a power of two.");
        }

        this.size = size;
        this.memory = new Uint8Array(size);
    }

    public read(address: number){
        if(address < 0 || address >= this.size){
            throw new Error("Invalid memory address");
        }

        return this.memory[address]
    }

    public write(address: number, value: number){
        if(address < 0 || address >= this.size -1){
            throw new Error("Invalid memory address");
        }

        if(value < 0 || value > 2**8 -1){
            throw new Error("Invalid memory value");
        }

        this.memory[address] = value;
    }

    public read16(address: number){
        if(address < 0 || address >= this.size - 1){
            throw new Error("Invalid memory address");
        }

        return this.memory[address]! << 8 | this.memory[address + 1]!;
    }

    public write16(address: number, value: number){
        if(address < 0 || address >= this.size - 1){
            throw new Error("Invalid memory address");
        }

        if(value < 0 || value > 2**16 -1){
            throw new Error("Invalid memory value");
        }

        this.memory[address] = (value >> 8) & 0xFF;
        this.memory[address + 1] = value & 0xFF;
    }
}