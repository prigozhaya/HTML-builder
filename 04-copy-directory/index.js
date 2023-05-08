const path = require('path');
const fs = require('fs');
const srcDirPath = path.join(__dirname, 'files');
const distDirPath = path.join(__dirname, 'files-copy');

fs.mkdir(distDirPath, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(srcDirPath, {withFileTypes: true}, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach((file) => {
            fs.copyFile(path.join(srcDirPath,file.name),path.join(distDirPath,file.name),()=>{});
        });
    });
}); 
