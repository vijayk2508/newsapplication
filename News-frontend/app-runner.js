const devUtils = require("react-dev-utils/WebpackDevServerUtils");
const concurrently = require("concurrently");
const chalk = require("chalk");
const log = console.log;
// const detect = require("detect-port-alt");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// detect(port, (err, _port) => {
//   if (err) {
//     console.log(err);
//   }

//   if (port == _port) {
//     console.log(`port: ${port} was not occupied`);
//   } else {
//     console.log(`port: ${port} was occupied, try port: ${_port}`);
//   }
// });

async function getPort() {
  log(chalk.blue("Checking for available ports..."));
  log();
  const port = await devUtils.choosePort(HOST, DEFAULT_PORT);
  log(chalk.cyan.bold(`Using port ${port} for the development server...`));
  log();
  log();
  const reactScriptsPrefix = port === 3000 ? "" : `cross-env PORT=${port} `;
  log(chalk.blue("Activating auto template watchers, please wait..."));
  log();
  concurrently(["node file-template-builder", `${reactScriptsPrefix}react-scripts start`], {
    prefix: "none"
  });
}

getPort();
