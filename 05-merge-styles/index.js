const path = require("path");
const fs = require("fs");
const srcDirPath = path.join(__dirname, "styles");
const distDirPath = path.join(__dirname, "project-dist");

let writeableStream = fs.createWriteStream(
  path.join(distDirPath, "bundle.css")
);

fs.readdir(srcDirPath, { withFileTypes: true }, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach(function (file, index, arr) {
    if (file.isFile() && path.extname(file.name) === ".css") {
      let reader = fs.createReadStream(path.join(srcDirPath, file.name));

      reader.on("data", function (chunk) {
        writeableStream.write(chunk);
        if (index === arr.length - 1)
          writeableStream.end();
      });
    }
  });
});
