const path = require("path");
const glob = require("glob-promise");

const nunjucks = require("../local_modules/nunjucks");
const renderAndWriteTemplate = require("../local_modules/render_and_write_template");

const manualPagesDir = path.resolve(`${__dirname}/../templates/_manual/`);
const publicDir = path.resolve(`${__dirname}/../public/`);

async function main() {

    const manualPageTemplates = await glob(`${manualPagesDir}/*.html.nunj`);

    manualPageTemplates.forEach((template) => {
        const templateName = template.replace(manualPagesDir, "");
        const outputFile = `${publicDir}${templateName}`.replace(".html.nunj", "");

        renderAndWriteTemplate(
            template,
            outputFile,
            {
                copyrightYear: new Date().getFullYear(),
            },
            nunjucks,
        )
            .catch((error) => {
                console.error(error);
            });
    });
}

main();
