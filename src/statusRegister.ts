import {Register} from './register';



export class StatusRegister extends Register {
    readonly flagMap = {
        Z: 0x80,
        N: 0x40,
        H: 0x20,
        C: 0x10
    }

    private Z: boolean;
    private N: boolean;
    private H: boolean;
    private C: boolean;
    
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

    setFlags(Z: boolean, N: boolean, H: boolean, C: boolean) {
        this.Z = Z;
        this.N = N;
        this.H = H;
        this.C = C;
    }
}