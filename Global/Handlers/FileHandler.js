const fs = require('fs');
const { join, extname, dirname  } = require('path');
const { readdirSync, lstatSync } = require('fs');
const chokidar = require('chokidar');

class FileManager {
    constructor(options, allowedExtensions = ['.js']) {
        this.baseDir = dirname(require.main.filename);
        this.dir = join(this.baseDir, options.Folder);
        this.type = options.Type;
        this.allowedExtensions = allowedExtensions;
        this.filePaths = [];
        this.structure = this.readStructureFromFile();
        if (options.Load) this.loadFiles();

        this.watcher = chokidar.watch(this.dir);
        this.watcher.on('add', (filePath) => {
            this.handleNewFile(filePath);
        });
    }

    readStructureFromFile() {
        const structureFilePath = join(process.cwd(), 'Global/Base/Examples', `${this.type}.js`);
        if (fs.existsSync(structureFilePath)) {
            return fs.readFileSync(structureFilePath, 'utf-8');
        }
        return`/**\n* Missing '@${this.type}' structure in 'Global/Base/Examples/${this.type}.js'. \n* Please create it to enable automatic generation.\n*\n* For assistance or bug reports, join our Discord server:\n* @see {@link https://discord.gg/luppux}\n*\n* @namespace\n* @name Kaan 'Vante' Karahanlı\n*/
       `;
    }

    handleNewFile(filePath) {
        const extension = extname(filePath);
        if (this.allowedExtensions.includes(extension)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.trim() === '') {
                fs.writeFileSync(filePath, this.structure);
            }
        }
    }

    loadFiles(directory = this.dir) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    
        const files = readdirSync(directory);
        files.forEach((file) => {
            const filePath = join(directory, file);
            const stat = lstatSync(filePath);
    
            if (stat.isDirectory()) {
                this.loadFiles(filePath);
            } else {
                const extension = extname(file);
                if (!this.allowedExtensions.includes(extension)) return;
                this.filePaths.push(filePath);
    
                if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf-8').trim() === '') {
                    fs.writeFileSync(filePath, this.structure);
                }
            }
        });
    }
}


module.exports = FileManager;