export class FileItem {


    private children: FileItem[] = [];
    private parent: FileItem | null = null;

    private readonly name: string;
    private readonly isDir: boolean;

    private readonly contentProvider: FileContentProvider | null;

    constructor(name: string, isDirectory: boolean, contentProvider: FileContentProvider | null = null) {
        this.name = name;
        this.isDir = isDirectory;
        this.contentProvider  = contentProvider;
    }

    add(child: FileItem) {
        this.children.push(child);
        child.setParent(this);
    }

    setParent(parent: FileItem) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    getChildren() {
        return this.children;
    }

    getName() {
        return this.name;
    }

    isDirectory() {
        return this.isDir;
    }

    getAbsolutePath(): string {
        const prefix = this.parent? this.parent.getAbsolutePath() + "/" : "";
        return prefix + this.name;
    }

    getContent(): string {
        return this.contentProvider ? this.contentProvider.getContent() : "";
    }

}
