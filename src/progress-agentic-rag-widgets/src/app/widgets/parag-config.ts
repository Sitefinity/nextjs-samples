export class PARAGConfig {
    /**
     * Gets the CDN hostname for Sitefinity Assistant resources
     * @throws Error if SF_ASSISTANT_CDN_HOSTNAME environment variable is not configured
     */
    static getCdnHostname(): string {
        const hostname = process.env.SF_ASSISTANT_CDN_HOSTNAME;
        if (!hostname) {
            throw new Error(
                'SF_ASSISTANT_CDN_HOSTNAME environment variable is not configured. ' +
                'Please set this to your CDN hostname for Sitefinity Assistant resources.'
            );
        }
        return hostname;
    }

    /**
     * Generates a full CDN URL for a given filename
     * @param filename The filename to generate URL for
     * @param version Optional version parameter
     * @throws Error if SF_ASSISTANT_CDN_HOSTNAME is not configured
     */
    static getCdnUrl(filename: string, version?: string): string {
        const hostname = this.getCdnHostname();
        const baseUrl = hostname.startsWith('http')
            ? hostname
            : `https://${hostname}`;

        const versionSuffix = version ? `?ver=${version}` : '';

        return `${baseUrl}/${filename}${versionSuffix}`;
    }
}
