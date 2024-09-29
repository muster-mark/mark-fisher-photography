import fs from "node:fs";

import compression from "compression";
import express from "express";
import morgan from "morgan";

import defaultHeaders from "./server/default_headers.ts";

const port = 8888;

const app = express();

// Logging middleware
app.use(morgan("dev"));

// Gzip
app.use(compression());

// Mock response for form submissions
app.post("/message", (_req, res) => {
    // The response body is unimportant. Only the response code is relevant.
    res.send(JSON.stringify({ successMsg: "Your email has been successfully sent." }));
});

// Everything is static!
app.use(
    express.static("public", {
        index: "index",
        setHeaders(res, path) {
            // Just need to set Content-Type for requests without an extension
            if (path.split("/")?.pop()?.indexOf(".") === -1) {
                // Set default headers for documents only
                res.set("Content-Type", "text/html; charset=utf-8");
                defaultHeaders.document.forEach((header) => {
                    res.set(header.name, header.value);
                });
            }

            // Set default headers
            defaultHeaders.all.forEach((header) => {
                res.set(header.name, header.value);
            });
        },
    }),
);

// static middleware only calls next() if it couldn't find the file
app.use((_req, res) => {
    res.status(404);
    fs.createReadStream("public/404").pipe(res);
});

// Start server
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

console.log(`Website is available at http://localhost:${port}`);
