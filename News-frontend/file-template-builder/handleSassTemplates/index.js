const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const sassTemplates = require("../templates/sass/sassTemplates");
const log = console.log;

const handleSassTemplates = (fileExtension, filePath, directoryPath) => {
  const fileName = path.basename(filePath);
  const relativePathToSrc = path.relative(directoryPath, "src/"); // Take the path relative to the file's directory
  fs.readFile(filePath, "UTF-8", (err, data) => {
    if (err) {
      throw err;
    }
    if (!data.trim().length) {
      log(chalk.bold.yellow(`Empty .${fileExtension} file found: ${filePath}`));
      log(
        chalk.bold.yellow(`Adding default ${fileExtension} template to ${fileName} in ${filePath}`)
      );
      log(chalk.bold.green("-------------------"));
      fs.writeFile(
        filePath,
        sassTemplates(fileExtension, relativePathToSrc, fileExtension === ".scss"),
        err => {
          if (err) throw err;
          log(chalk.bold.green(`${fileName} updated with default ${fileExtension} templates.`));
          log(chalk.bold.green("-------------------"));
          return true;
        }
      );
    }
  });
};

module.exports = handleSassTemplates;
