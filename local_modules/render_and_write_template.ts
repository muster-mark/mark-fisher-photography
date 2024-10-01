import { writeFile } from "node:fs/promises";

import prettier from "prettier";

export default async function renderAndWriteTemplate(
    templatePath: string,
    outputPath: string,
    data = {},
    nunjucks: typeof import("nunjucks"),
) {
    let output;
    try {
        output = nunjucks.render(templatePath, data);
    } catch (error) {
        console.error(error);
        process.exit();
    }

    if (output === null) {
        return Promise.reject(
            new Error(`Template ${templatePath} rendered to null using data: ${JSON.stringify(data)}`),
        );
    }

    output = await prettier.format(output, { parser: "html", printWidth: 200 });

    try {
        await writeFile(outputPath, output, { encoding: "utf-8" });
        console.log(`Wrote HTML to ${outputPath}`);
    } catch (error) {
        return Promise.reject(new Error(`Could not write to ${outputPath}`));
    }

    return Promise.resolve(outputPath);
}
