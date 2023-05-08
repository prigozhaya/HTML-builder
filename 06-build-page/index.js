const path = require("path");
const fs = require("fs");
const srcHTMLPath = path.join(__dirname, "template.html");
const componentsPath = path.join(__dirname, "components");
const srcCssPath = path.join(__dirname, "styles");
const srcAssPath = path.join(__dirname, "assets");
const distDirPath = path.join(__dirname, "project-dist");
const distHTMLPath = path.join(distDirPath, "index.html");
const distCSSPath = path.join(distDirPath, "style.css");
const distAssPath = path.join(distDirPath, "assets");

function copyFolderRecursive(from, to) {
  fs.mkdir(to, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(from, { withFileTypes: true }, function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }

      files.forEach((file) => {
        if (file.isFile()) {
          fs.copyFile(
            path.join(from, file.name),
            path.join(to, file.name),
            (err) => {
              if (err) {
                return console.log("Unable to copy: " + err);
              }
            }
          );
        } else {
          copyFolderRecursive(
            path.join(from, file.name),
            path.join(to, file.name)
          );
        }
      });
    });
  });
}

// main script
fs.mkdir(distDirPath, { recursive: true }, (err) => {
  if (err) throw err;

  // prepare index.html
  const components = new Map();
  fs.readdir(componentsPath, { withFileTypes: true }, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    let writerHTML = fs.createWriteStream(distHTMLPath);
    let readerHTML = fs.createReadStream(srcHTMLPath);

    files.forEach(function (file, index, arr) {
      if (file.isFile() && path.extname(file.name) === ".html") {

        let readerHTMLComponent = fs.createReadStream(
          path.join(componentsPath, file.name)
        );

        readerHTMLComponent.on("data", function (chunk) {
          components.set(file.name.split(".")[0], chunk);

          if (index === arr.length - 1) {
            readerHTML.on("data", function (chunk) {
              writerHTML.write(
                chunk.toString().replace(/\{\{(\w+)\}\}/g, (str, tag) => {
                  for (const component of components.keys()) {
                    if (component === tag) {
                      return components.get(tag);
                    }
                  }
                  return str;
                })
              );
              writerHTML.end();
            });
          }
        });
      }
    });
  });

  // bundle css
  fs.readdir(srcCssPath, { withFileTypes: true }, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    let stylesStream = fs.createWriteStream(distCSSPath);

    files.forEach(function (file, index, arr) {
      if (file.isFile() && path.extname(file.name) === ".css") {
        let readerCSS = fs.createReadStream(path.join(srcCssPath, file.name));

        readerCSS.on("data", function (chunk) {
          stylesStream.write(chunk);
          if (index === arr.length - 1) stylesStream.end();
        });
      }
    });
  });

  // copy assets
  fs.mkdir(distAssPath, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(srcAssPath, { withFileTypes: true }, function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }

      files.forEach((file) => {
        copyFolderRecursive(
          path.join(srcAssPath, file.name),
          path.join(distAssPath, file.name)
        );
      });
    });
  });
});
