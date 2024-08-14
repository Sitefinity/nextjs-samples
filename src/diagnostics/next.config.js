const path = require('path');

const cspHeader = `
    script-src https://cdn.insight.sitefinity.com https://dec.azureedge.net https://player.vimeo.com/api/player.js https://www.youtube.com/iframe_api 'unsafe-eval' 'unsafe-inline' 'self';
    style-src https://cdn.insight.sitefinity.com https://dec.azureedge.net 'self' 'unsafe-inline';
    img-src https://cdn.insight.sitefinity.com https://dec.azureedge.net 'self' data:;
    connect-src https://*.insight.sitefinity.com https://*.dec.sitefinity.com 'self';
    font-src 'self' data:;
    default-src 'self'`;

module.exports = {
    webpack: (config, options) => {
        config.resolve['alias']['@widgetregistry'] = path.resolve(__dirname, 'src/app/widget-registry');
        return config;
    },
    skipTrailingSlashRedirect: true,
    output: process.env.SF_BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
    experimental: {
        proxyTimeout: 60000
    },
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, '')
                    }
                ]
            }
        ];
    }
};
