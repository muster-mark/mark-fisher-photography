const fs = require('fs');
const util = require('util');

module.exports = async function renderAndWriteTemplate(templatePath, outputPath, data={}, nunjucks) {

    let output;

    try {
         output = nunjucks.render(templatePath, data);
    } catch (error) {
        return Promise.reject(`Could not render template ${templatePath} using data: ${JSON.stringify(data)}`);
    }

    if (output === null) {
        return Promise.reject(`Template ${templatePath} rendered to null using data: ${JSON.stringify(data)}`);
    }

    try {
        await util.promisify(fs.writeFile)(outputPath, output, {encoding: 'utf-8'});
        console.log(`Wrote HTML to ${outputPath}`);
    } catch (error) {
        return Promise.reject(`Could not write to ${outputPath}`);
    }
};
