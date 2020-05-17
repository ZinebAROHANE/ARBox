export class FileUpload {
    key: string;
    name: string;
    url: string;
    file: File;
    email: string;
    size: number;
    userId: string;
    type: string;
    
    
    constructor(file: File) {
        this.file = file;
    }
}
