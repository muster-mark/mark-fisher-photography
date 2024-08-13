import { glob } from "node:fs/promises";
import path from "node:path";

import nunjucks from "../local_modules/nunjucks";
import renderAndWriteTemplate from "../local_modules/render_and_write_template";

const manualPagesDir = path.resolve(`${__dirname}/../templates/_manual/`);
const publicDir = path.resolve(`${__dirname}/../public/`);

async function main() {
    for await (const template of glob(`${manualPagesDir}/*.html.nunj`)) {
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
    }
}

main();
