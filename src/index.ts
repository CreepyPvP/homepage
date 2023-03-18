import "xterm/lib/xterm.js"
import "xterm/css/xterm.css"

import "./index.css"

import {TerminalInstance} from "./TerminalInstance"
import { FileItem } from "./FileItem"
import {StringContent} from "./FileContent"
import { COLOR_CYAN, COLOR_RED, COLOR_RESET } from "./Color"

const root = new FileItem("home", true);
const folder1 = new FileItem("aFolder", true);
root.add(folder1);
const file = new FileItem("afile.txt", false, new StringContent("This is a very interesting file"));
root.add(file);

const instance = new TerminalInstance(root);

instance.setNotFound((args, term) => {
    term.writeln(COLOR_RED + "Unkown command '" + args[0] + "'. Type '?' for help" + COLOR_RESET);
    return -1;
})

instance.register("?", (args, term) => {
    term.writeln("- '" + COLOR_CYAN + "ls" + COLOR_RESET + "' lists the content of the current directory");
    term.writeln("- '" + COLOR_CYAN + "cat xyz.txt" + COLOR_RESET + "' prints the content of file 'xyz.txt'");
    term.writeln("- '" + COLOR_CYAN + "cd xyz" + COLOR_RESET + "' nagviates to directoy 'xyz'");
    return 0;
})

instance.register("ls", (args, term, context) => {
    const hasParent = !!context.folder.getParent();
    if(hasParent)
        term.writeln("..");

    context.folder.getChildren().forEach(item => term.writeln(item.getName()));

    return 0;
})

instance.register("cat", (args, term, context) => {
    if(args.length !== 2) {
        term.writeln(COLOR_RED + "Invalid number of arguments provided" + COLOR_RESET);
        return -1;
    }

    const targetFile = context.folder.getChildren().find(item => item.getName() === args[1] && !item.isDirectory());

    if(!targetFile) {
        term.writeln(COLOR_RED + "Invalid file '" + args[1] + "'" + COLOR_RESET);
        return -1;
    }

    term.writeln(targetFile.getContent()) 

    return 0;
})

instance.register("cd", (args, term, context) => {
    if(args.length !== 2) {
        term.writeln(COLOR_RED + "Invalid number of argnuments provided" + COLOR_RESET);
        return -1;
    }

    if(args[1] === "..") {
        const parent = context.folder.getParent();
        if(!parent)
            return 0;

        context.setFolder(parent);
        return 0;
    }

    const targetDir = context.folder.getChildren().find(child => child.getName() === args[1] && child.isDirectory());
    if(!targetDir) {
        term.writeln(COLOR_RED + "Invalid directory '" + args[1] + "'" + COLOR_RESET);
        return -1;
    }

    context.setFolder(targetDir);

    return 0;
})

instance.init();
window.onresize = () => instance.rescale();
