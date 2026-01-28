export class PARAGAssistantConfig {
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
     * Gets the CDN root folder relative path
     * Defaults to "staticfiles/" if not configured
     */
    static getCdnRootFolderRelativePath(): string {
        const rootPath = process.env.SF_ASSISTANT_CDN_ROOT_FOLDER_RELATIVE_PATH;

        // Default to "staticfiles/" if not configured (matching .NET Core behavior)
        if (rootPath === null || rootPath === undefined) {
            return 'staticfiles/';
        }

        // If explicitly set to empty string, return empty
        if (rootPath === '') {
            return '';
        }

        // Ensure path ends with '/' and doesn't start with '/'
        const trimmedPath = rootPath.trim().replace(/^\/+|\/+$/g, '');
        return trimmedPath ? `${trimmedPath}/` : '';
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

        const rootPath = this.getCdnRootFolderRelativePath();
        const versionSuffix = version ? `?ver=${version}` : '';

        return `${baseUrl}/${rootPath}${filename}${versionSuffix}`;
    }
}
