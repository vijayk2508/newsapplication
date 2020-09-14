
const fs = require("fs");
const log = require("npmlog");
const packageData = require("../package.json")
exports.printlogo = () => {
    // eslint-disable-next-line no-sync
    let logo = fs.
        // eslint-disable-next-line no-undef
        readFileSync(`${__dirname}/logo.txt`, 'utf-8').
        // eslint-disable-next-line require-unicode-regexp
        replace(/^\n+|\n+$/g, '').
        split('\n');
    let columnLength = logo.map(l => l.length).reduce((max, val) => {
        // eslint-disable-next-line no-extra-parens
        return (val > max ? val : max);
    }, 0);
    let versionString = ` ${packageData.name}@${packageData.version} `;
    // eslint-disable-next-line no-mixed-operators
    let versionPrefix = '-'.repeat(Math.round(columnLength / 2 - versionString.length / 2));
    let versionSuffix = '-'.repeat(columnLength - versionPrefix.length - versionString.length);
    log.info('App', ` ${'-'.repeat(columnLength)}`);
    log.info('App', '');

    logo.forEach(line => {
        log.info('App', ` ${line}`);
    });
    log.info('App', '');
    log.info('App', ` ${versionPrefix}${versionString}${versionSuffix}`);
    log.info('App', '');
}