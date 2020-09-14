const chokidar = require("chokidar");
const pathModule = require("path");
const chalk = require("chalk");
const handleReducerTemplates = require("./handleReducerTemplates");
const updateAppReducer = require("./handleReducerTemplates/updateAppReducer");
const handleComponentTemplates = require("./handleComponentTemplates");
const handleSassTemplates = require("./handleSassTemplates");

const log = console.log;

chokidar
  .watch([
    "src/action-reducer/*",
    "src/containers/*",
    "src/components/*",
    "src/common/*",
    "src/UIComponents/*"
  ])
  .on("ready", () => {
    log(chalk.green("Auto templating watchers active."));
    log();
    log();
  })
  .on("addDir", path => {
    const directories = path.split(pathModule.sep);
    if (directories[1] === "action-reducer") {
      handleReducerTemplates(path);
    } else if (directories[1] === "containers") {
      handleComponentTemplates(path, "containers");
    } else if (directories[1] === "components") {
      handleComponentTemplates(path, "components");
    } else if (directories[1] === "common") {
      handleComponentTemplates(path, "common");
    } else if (directories[1] === "UIComponents") {
      handleComponentTemplates(path, "UIComponents");
    }
  });

chokidar.watch("src/action-reducer", { depth: 0 }).on("unlinkDir", path => {
  const directories = path.split(pathModule.sep);
  const reducerName = directories[directories.length - 1];
  updateAppReducer(reducerName, true);
});

chokidar
  .watch(["src/**/*.scss", "src/**/*.sass"], {
    ignored: "src/assets"
  })
  .on("add", path => {
    const parsedPath = pathModule.parse(path);
    const directoryPath = parsedPath.dir;
    const fileExtension = parsedPath.ext;
    if (fileExtension === ".scss" || fileExtension === ".sass") {
      handleSassTemplates(fileExtension, path, directoryPath);
    }
  });
