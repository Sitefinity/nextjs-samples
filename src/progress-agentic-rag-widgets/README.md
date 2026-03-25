# Custom Progress Agentic RAG widgets

This guide demonstrates how to create and configure a set of custom widgets powered by Progress Agentic RAG.

## Available Widgets
- AI Assistant Chat
- AI Ask Box
- AI Answer
- AI Search Results

## Installing the widgets

To install the custom Agentic RAG widgets in your Sitefinity application, perform the following:

### Sitefinity CMS setup
1. Clone the [mvc-samples](https://github.com/Sitefinity/mvc-samples) repository.
2. If the Sitefinity NuGet package versions used in the sample differ from these used in your project, update the NuGet references in the widget project to match your Sitefinity CMS version.
3. Build the `ProgressAgenticRAGWidgets` project.
4. In your Sitefinity CMS web application, add references to the `PARAGCore.dll` produced by the build from _Step 3_.
5. If your Sitefinity CMS web application doesn’t already include a `Global.asax.cs` file, create it.
6. Modify the `Global.asax.cs` file contents to match the [sample Global.asax.cs](https://github.com/Sitefinity/mvc-samples/blob/master/ProgressAgenticRAGWidgets/SitefinityWebApp/Global.asax.cs).
7. If you are using a Sitefinity version >= 15.4.8623 you should do one of the following:
	- If you want to use the sample widgets instead of the built-in ones, disable the `Progress Agentic RAG connector` module.
	- If you want to use a mix of the sample and the built-in widgets:
		- remove the `PARAGOperationProvider` registration from the `Global.asax.cs` file.
		- populate the _PARAG_ and the _AgenticRAG_ configurations with the same values.
8. Rebuild your Sitefinity web application.

### Renderer setup
To setup the project follow the instructions [here](./../../README.md#project-setup).

1. Open `.env.*` file corresponding to your environment.
2. Set the following:

```
SF_ASSISTANT_CDN_HOSTNAME=cdn.assistant.cloud.sitefinity.com
SF_WHITELISTED_WEBSERVICES='/parag'
```

3. Open `next.config.js`.
   - For versions 15.3 and onwards add the following code:

```JavaScript
const PARAGassistantCdnHostname = process.env.SF_ASSISTANT_CDN_HOSTNAME;
if (PARAGassistantCdnHostname) {
    cspScriptSrc += ` ${PARAGassistantCdnHostname}`;
    cspStyleSrc += ` ${PARAGassistantCdnHostname}`;
    cspImgSrc += ` ${PARAGassistantCdnHostname}`;
}
```
   - For older versions add `cdn.assistant.cloud.sitefinity.com` to the `script-src`, `style-src` and `img-src` sections of the `cspHeader` variable.

4. Start the project.

## Configuring the Widgets

### Configure Sitefinity CMS

Before you can use Progress Agentic RAG, you must configure the respective setting in Sitefinity CMS:

  1. Log in to the [Progress Agentic RAG Dashboard](https://rag.progress.cloud/).
  1. From the _NucliaDB API endpoint_, copy **the host part** of the URL without the rest of the URL.
     Save the value somewhere, for example &ndash; in Notepad.<br>
     You will need this value later.
  1. Copy the _Knowledge Box_ and save it somewhere.
  1. In the Agentic RAG Dashboard, navigate to _Advanced » API Keys_
  1. Create a new API key, copy it, and save it somewhere, for example &ndash; in Notepad.
  1. In Sitefinity CMS backend, navigate to _Administration » Settings » Advanced_.
  1. In the tree on the left, expand the _PARAG » Knowledge Boxes_ node.
  1. Click _Create new_.
  1. In _Base URL_, paste the endpoint you copied from _Step 2_.<br>
     For example, <code>https://europe-1.rag.progress.cloud</code>.
  1. In _Knowledge box UID_, paste the UID from _Step 3_.
  1. In _Knowledge box API key_, paste the API key from _Step 5_.
  1. Save your changes.

### Configure Assistant Settings

To configure the Sitefinity AI Assistant settings, perform the following:

  1. In Sitefinity CMS backend, navigate to _Administration » Settings » Advanced_.
  1. In the tree on the left, expand the _PARAG » Assistant_ node.
  1. In _AdminApiBaseUrl_ enter `https://api.sitefinity.cloud/Version`.
  1. In _CdnHostName_ enter `cdn.assistant.cloud.sitefinity.com`.
