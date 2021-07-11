import {Register} from './register';

export class StatusRegister extends Register {
    readonly flagMap = {
        Z: 0x80,
        N: 0x40,
        H: 0x20,
        C: 0x10
    }
    
    constructor() {
        super();
    }

    getFlag(flag: string) {
        return this.get() & this.flagMap[flag];
    }

    setFlag(flag: string, value: boolean) {
        const andVal = value ? 0xFF : ~this.flagMap[flag];
        this.operation((x:number) => {return (x & andVal)});
    }
}