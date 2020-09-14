const fs = require("fs");
/*
  fileItems = [
    {
      fileSuffix: "Actions.js", templateFunc: reducerTemplates.action
    }
  ]
*/
function doesFilesExist(path, filePrefix, fileSuffixes) {
  let filesExist = false;
  for (let index = 0; index < fileSuffixes.length; index++) {
    const fileSuffix = fileSuffixes[index];

    // If any of the file exists, then don't add the file
    if (fs.existsSync(`${path}/${filePrefix}${fileSuffix}`)) {
      filesExist = true;
      break;
    }
  }

  return filesExist;
}

module.exports = doesFilesExist;
