const fs = require('fs');
const nunjucks = require('nunjucks');
const path = require('path');
const glob = require('glob-promise');
const galleries = require ('./../local_modules/galleries.js');

const manualPagesDir = path.resolve(__dirname + '/../manual_pages/');
const publicDir = path.resolve(__dirname + '/../public/');
const templatesPath = path.resolve(__dirname + '/../templates/');


async function main() {

    const environment = nunjucks.configure(templatesPath, {
        throwOnUndefined: false,
        trimBlocks: true,
    });

    environment.addGlobal('header_nav_links', galleries.getUrlToNameMapping());

    const manualPageTemplates = await glob(manualPagesDir + '/*.html.nunj');

    manualPageTemplates.forEach(template => {

        const templateName = template.replace(manualPagesDir, '');
        const outputFile = `${publicDir}${templateName}`.replace('.html.nunj', '');
        const templateString = fs.readFileSync(template, {encoding: 'utf-8'});

        let output;

        try {
            output = nunjucks.renderString(templateString, {
                copyrightYear: new Date().getFullYear(),
            });
        } catch (err) {
            console.error(err);
        }

        if (output === null) {
            console.error(`ERROR: ${template} rendered to null`);
            return;
        }


        try {
            fs.promises.writeFile(outputFile, output);
            console.log(`Wrote ${outputFile}`);
        } catch (error) {
            console.error(error);
        }

    });
}

main();
