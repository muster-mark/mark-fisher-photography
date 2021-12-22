const fs = require("node:fs");
const util = require("node:util");

module.exports = async function renderAndWriteTemplate(templatePath, outputPath, data = {}, nunjucks) {
    let output;
    try {
        output = nunjucks.render(templatePath, data);
    } catch (error) {
        console.error(error);
        process.exit();
    }

    if (output === null) {
        return Promise.reject(new Error(`Template ${templatePath} rendered to null using data: ${JSON.stringify(data)}`));
    }

    try {
        await util.promisify(fs.writeFile)(outputPath, output, { encoding: "utf-8" });
        console.log(`Wrote HTML to ${outputPath}`);
    } catch (error) {
        return Promise.reject(new Error(`Could not write to ${outputPath}`));
    }

    return Promise.resolve(outputPath);
};
