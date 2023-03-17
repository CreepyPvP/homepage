import { Terminal } from "xterm";
import { FileItem } from "./FileItem";


export type TerminalContext = {
    folder: FileItem
    setFolder: (folder: FileItem) => void
}

export type CmdHandler = (args: string[], term: Terminal, context: TerminalContext) => number;

export class TerminalInstance {

    private readonly term: Terminal;
    private command: string = "";

    private cmdMap: Map<string, CmdHandler> = new Map();
    private notFound: CmdHandler = () => -1;

    private currentFile: FileItem;

    constructor(root: FileItem) {
        this.currentFile = root;

        this.term = new Terminal({
            cursorBlink: true
        });
        this.term.open(document.getElementById("terminal"));
    }

    init() {
        this.rescale();
        
        this.term.onData(e => {
            switch(e) {
                case '\u0003':                              // Ctr + C
                    this.term.write("^C");
                    this.prompt();
                    break;
                case '\r':                                  // Enter
                    this.execute(this.command);
                    break;
                case '\u007F':                              // Backspace
                    if(this.command.length < 1) break;
                    this.term.write('\b \b');
                    this.command = this.command.substring(1);
                    break;
                default:
                    if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                        this.term.write(e);
                        this.command += e;
                    }
            }
        });

        this.term.writeln("Hi, Im Luis");
        this.term.writeln("Iam a 18 year old hobby developer with a passion for computers, physics and maths");
        this.term.writeln("Typescript and Neovim rule");
        this.term.writeln("Unity is despicable");
        this.term.writeln("I'll document nteresting stuff I learn during my projects here");
        this.term.writeln("Take a look :)");

        this.term.writeln("");
        this.term.writeln("Type '?' for a list of commands")

        this.prompt();
    }

    register(cmd: string, handler: CmdHandler) {
        this.cmdMap.set(cmd, handler);
    }

    setNotFound(handler: CmdHandler) {
        this.notFound = handler;
    }

    rescale() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const widthPerChar = 9.02;
        const heightPerChar = 17;
        this.term.resize(Math.floor(width / widthPerChar), Math.floor(height / heightPerChar) - 1);
    }

    prompt() {
        this.term.write("\r\n" + this.currentFile.getAbsolutePath() + "$ ")
        this.command = "";
    }

    execute(command: string) {
        const args = command.split(" ");

        if(args.length < 1 || args[0].length === 0) 
            return;

        this.term.write("\r\n");

        const handler = this.cmdMap.get(args[0]) || this.notFound;
        const result = handler(args, this.term, {
            folder: this.currentFile,
            setFolder: (folder) => {
                this.currentFile = folder;
            }
        });

        console.log(result);

        this.prompt();
    }

}
