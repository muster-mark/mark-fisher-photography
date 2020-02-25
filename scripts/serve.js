const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const defaultHeaders = require('./server/default_headers');
const compression = require('compression');

const PORT = process.env.PORT || 8888;

const app = express();

// Logging middleware
app.use(morgan('dev'));

// Gzip
app.use(compression());

// Mock response for form submissions
app.post('/message', function(req, res) {
    //The response body is unimportant. Only the response code is relevant.
    res.send(JSON.stringify({"successMsg":"Your email has been successfully sent."}));
});

// Everything is static!
app.use(express.static('public', {
    index: 'index',
    setHeaders: function (res, path) {
        // Just need to set Content-Type for requests without an extension
        if(path.split('/').pop().indexOf('.') === -1 ) {

            // Set default headers for documents only
            res.set('Content-Type', 'text/html; charset=utf-8');
            defaultHeaders.document.forEach(header => {
                res.set(header.name, header.value);
            }) ;
        }

        // Set default headers
        defaultHeaders.all.forEach(header => {
            res.set(header.name, header.value);
        });
    }
}));

// static middleware only calls next() if it couldn't find the file
app.use((req, res) =>{
    res.status(404);
    fs.createReadStream("public/404").pipe(res)
});


// Start server
app.listen(PORT, () => {
   console.log(`Server is listening on ${PORT}`);
});

// Open in default browser
require('opn')(`http://localhost:${PORT}`);
