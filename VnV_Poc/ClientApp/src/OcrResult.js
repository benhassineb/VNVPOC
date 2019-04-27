import uuidv4 from "uuid/v4";


export class OcrResult {
    constructor(text) {
        this.text = text;
        this.blocks = [];
        this.lines = [];
        this.words = [];
    }

    static fromObject(...sources) {
        let result = Object.assign(new OcrResult(), ...sources);
        result.blocks = result.text.split('\n\n');
        result.blocks.forEach(block => {
            result.lines = result.lines.concat(block.split('\n'));
        });
        result.lines.forEach(line => {
            result.words = result.words.concat(line.split(' '))
        });
        return result;
    }
}




export class File {
    constructor(id, blob, url) {
        this.id = id;
        this.blob = blob;
        this.url = url;
    }

    static fromObject(...sources) {
        let result = Object.assign(new OcrResult(), ...sources);
        result.url = URL.createObjectURL(result.blob);
        result.id = uuidv4();
        return result;
    }
}
