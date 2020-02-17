// HTTP response headers that should be set for all, or nearly all, requests

module.exports =  {
    'all': [
        // Response headers to be sent for all Content-Types
        {
            name: 'X-Content-Type-Options',
            value: 'nosniff'
        }
    ],
    'document': [
        // Response headers to be sent only if the Content-Type is text/html
        {
            name: 'Content-Security-Policy',
            value: "font-src 'self'; base-uri 'self'; connect-src 'self'; form-action 'self'; frame-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'self'; img-src 'self';"
        },
        {
            name: 'Feature-Policy',
            value: "camera 'none'; microphone 'none'; geolocation 'none'; autoplay 'none'; speaker 'none'; fullscreen 'none';  geolocation 'none'; sync-xhr 'none'; midi 'none'; usb 'none'"

        },
        {
            name: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
        },
    ]
};
