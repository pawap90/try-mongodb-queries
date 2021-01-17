const diff = require('jest-diff').default;
const chalk = require('chalk');

module.exports.printDifference = (testName, initial, modified) => {
    const diffOptions = {
        aAnnotation: 'Original',
        aColor: chalk.cyanBright,
        bAnnotation: 'Modified',
        bColor: chalk.greenBright,
        commonColor: chalk.cyanBright
    };

    const difference = diff(initial, modified, diffOptions);

    console.log(chalk.underline(`${testName}\n`), difference);
}