import { RestClient, RootUrlService } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

/**
 * DTO for version information from Sitefinity Assistant API
 */
export interface VersionInfoDto {
    ProductVersion: string;
}

/**
 * API client for making calls to Sitefinity Assistant services
 * Uses the NextJS RestClient infrastructure to properly handle OData API calls
 * This provides the same functionality as .NET Core SitefinityAssistantClient
 */
export class PARAGAssistantApiClient {
    /**
     * Gets version information from Sitefinity Assistant API
     * Calls the Sitefinity OData unbound function to get version info
     * @returns Promise with version info or null if API call fails
     */
    static async getVersionInfoAsync(): Promise<VersionInfoDto | null> {
        try {
            const serviceUrl = RootUrlService.getServerCmsServiceUrl();
            const functionUrl = `${serviceUrl}/Default.GetPARAGAssistantVersionInfo()`;

            const response = await RestClient.sendRequest<VersionInfoDto>({
                url: functionUrl,
                method: 'GET'
            });

            return response;
        } catch (error) {
            return null;
        }
    }
}
