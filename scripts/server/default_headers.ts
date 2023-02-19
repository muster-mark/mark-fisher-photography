// HTTP response headers that should be set for all, or nearly all, requests

const cspHeaderDirectives = [
    "font-src 'self';",
    "base-uri 'self';",
    "connect-src 'self' cloudflareinsights.com;",
    "form-action 'self';",
    "frame-src 'self';",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' static.cloudflareinsights.com;",
    "style-src 'self' 'unsafe-inline';",
    "object-src 'none';",
    "frame-ancestors 'self';",
    "img-src 'self';",
];

const featurePolicyHeaderDirectives = [
    "camera 'none';",
    "microphone 'none';",
    "geolocation 'none';",
    "autoplay 'none';",
    "fullscreen 'none';",
    "geolocation 'none';",
    "sync-xhr 'none';",
    "midi 'none';",
    "usb 'none'",
];

export default {
    all: [
        // Response headers to be sent for all Content-Types
        {
            name: "X-Content-Type-Options",
            value: "nosniff",
        },
    ],
    document: [
        // Response headers to be sent only if the Content-Type is text/html
        {
            name: "Content-Security-Policy",
            value: cspHeaderDirectives.join(" "),
        },
        {
            name: "Feature-Policy",
            value: featurePolicyHeaderDirectives.join(" "),

        },
        {
            name: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
        },
    ],
};
