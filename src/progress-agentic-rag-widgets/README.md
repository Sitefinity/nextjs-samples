---

---


# Custom Progress Agentic RAG widgets

## Overview

This guide demonstrates how to create and configure a set of custom widgets powered by Progress Agentic RAG.

## Available Widgets
- AI Assistant Chat

## Installing the widgets

To install the custom Agentic RAG widgets in your Sitefinity application, perform the following:

### Sitefinity CMS setup
1. Clone the [mvc-samples](https://github.com/Sitefinity/mvc-samples) repository.
2. If the Sitefinity NuGet package versions used in the sample differ from these used in your project, update the NuGet references in the widget project to match your Sitefinity CMS version.
3. Build the `ProgressAgenticRAGWidgets` project.
4. In your Sitefinity CMS web application, add references to the `PARAGCore.dll` produced by the build from _Step 3_.
5. If your Sitefinity CMS web application doesn’t already include a `Global.asax.cs` file, create it.
6. Modify the `Global.asax.cs` file contents to match the [sample Global.asax.cs](https://github.com/Sitefinity/mvc-samples/blob/master/ProgressAgenticRAGWidgets/SitefinityWebApp/Global.asax.cs).
7. Rebuild your Sitefinity web application.

### Renderer setup
To setup the project follow the instructions [here](./../../README.md#project-setup).

1. Open `.env.*` file corresponding to your environment.
2. Set the following:

```
SF_ASSISTANT_CDN_HOSTNAME=cdn.assistant.api.sitefinity.cloud
SF_ASSISTANT_CDN_ROOT_FOLDER_RELATIVE_PATH=prod
SF_WHITELISTED_WEBSERVICES='/parag'
```

3. Open `next.config.js`.
4. Add the following code:

```JavaScript
const PARAGassistantCdnHostname = process.env.SF_ASSISTANT_CDN_HOSTNAME;
if (PARAGassistantCdnHostname) {
    cspScriptSrc += ` ${PARAGassistantCdnHostname}`;
    cspStyleSrc += ` ${PARAGassistantCdnHostname}`;
    cspImgSrc += ` ${PARAGassistantCdnHostname}`;
}
```

5. Start the project.

## Configuring the Widgets

### Configure Progress Agentic RAG Settings

**Base URL**
  1. Log in to the Progress Agentic RAG Dashboard.
  1. Copy the _NucliaDB API endpoint_.
  1. In Sitefinity CMS, navigate to: _Administration » Settings » Advanced » AgenticRAG » Base URL_.
  1. Paste the copied endpoint without the path.

### Configure Knowledge Box

**Knowledge box ID**
  1. Log in to the Agentic RAG Dashboard.
  1. Open your Knowledge box or create and configure a new one.
  1. Copy the _Knowledge Box UID_.
  1. In Sitefinity, navigate to: _Administration » Settings » Advanced » AgenticRAG » Knowledge Boxes » KnowledgeBoxId_.
  1. Paste the Knowledge Box UID you copied in _Step 3_.

**Knowledge box API key**
  1. In the Agentic RAG Dashboard, go to _Advanced » API Keys_.
  1. Create a new API key and copy it.
  1. In Sitefinity, navigate to _Administration » Settings » Advanced » AgenticRAG » Knowledge Boxes » KnowledgeBoxKey_.
  1. Paste the API key you copied in _Step 2_.

### Configure Assistant Settings
In Sitefinity CMS, configure the following values under: _Administration » Settings » Advanced » AgenticRAG » Assistant_

| Setting                       | Value                                  |
| ----------------------------- | -------------------------------------- |
| **AdminApiBaseUrl**           | `https://api.sitefinity.cloud/Version` |
| **CdnHostName**               | `cdn.assistant.api.sitefinity.cloud`   |
