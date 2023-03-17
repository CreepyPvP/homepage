export interface FileContentProvider {

    getContent(): string;

}


export class StringContent implements FileContentProvider {

    private readonly content: string;

    
    constructor(content: string) {
        this.content = content;
    }


    getContent(): string {
        return this.content;
    }

}
