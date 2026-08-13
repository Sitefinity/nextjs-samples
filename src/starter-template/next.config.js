// Get Sitefinity Assistant CDN hostname from environment
const assistantCdnHostname = process.env.SF_ASSISTANT_CDN_HOSTNAME;

// Build CSP header with conditional Sitefinity Assistant CDN support
let cspScriptSrc = 'script-src https://cdnjs.cloudflare.com/ajax/libs/jquery/ https://cdn.insight.sitefinity.com https://player.vimeo.com/api/player.js https://www.youtube.com/iframe_api *.googleapis.com';
let cspStyleSrc = 'style-src https://cdn.insight.sitefinity.com *.googleapis.com';
let cspImgSrc = 'img-src https://cdn.insight.sitefinity.com https://*.frontify.com https://*.cloudinary.com';
let cspConnectSrc = 'connect-src https://*.insight.sitefinity.com https://*.dec.sitefinity.com';
let cspFontSrc = 'font-src fonts.gstatic.com';

// Add Sitefinity Assistant CDN if configured
if (assistantCdnHostname) {
    cspScriptSrc += ` ${assistantCdnHostname}`;
    cspStyleSrc += ` ${assistantCdnHostname}`;
    cspImgSrc += ` ${assistantCdnHostname}`;
}

const cspHeader = `
    ${cspScriptSrc} 'unsafe-eval' 'unsafe-inline' 'self';
    ${cspStyleSrc} 'self' 'unsafe-inline';
    ${cspImgSrc} 'self' data: blob:;
    ${cspConnectSrc} 'self';
    ${cspFontSrc} 'self' data:;
    default-src 'self'`;

module.exports = {
    turbopack: {
        resolveAlias: {
            '@widgetregistry': './src/app/widget-registry.ts'
        }
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
