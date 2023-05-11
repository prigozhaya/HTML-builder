const fsPromises = require('fs/promises');
const path = require('path');

async function copyFiles(distDirPath,srcDirPath) {
    try {
        await fsPromises.mkdir(distDirPath, {recursive: true});
        const sourceFiles = await fsPromises.readdir(srcDirPath);
        const destFiles = await fsPromises.readdir(distDirPath);
        destFiles.forEach(async file => {
          if (!sourceFiles.includes(file)) {
            await fsPromises.unlink(path.join(distDirPath, file));
          }
        });
        sourceFiles.forEach(async file => {
          await fsPromises.copyFile(path.join(srcDirPath, file), path.join(distDirPath, file));
        });
      } 
      catch (err) {
        console.error(err);
      }
    
}
copyFiles(path.join(__dirname, 'files-copy'),path.join(__dirname, 'files'))


// fs.mkdir(distDirPath, { recursive: true }, (err) => {
//     if (err) throw err;

//     fs.readdir(srcDirPath, {withFileTypes: true}, function (err, files) {
//         if (err) {
//             return console.log('Unable to scan directory: ' + err);
//         } 

//         files.forEach((file) => {
//             fs.copyFile(path.join(srcDirPath,file.name),path.join(distDirPath,file.name),()=>{});
//         });
//     });
// }); 
