const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'secret-folder');

fs.readdir(directoryPath, {withFileTypes: true}, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        fs.stat(path.join(directoryPath, file.name), (err, stats) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            if (stats.isFile()) {
                console.log(file.name.split('.')[0]+' - '+path.extname(file.name).split('.')[1]+' - '+stats.size/1024+'kb');
            }
        });
    });
});