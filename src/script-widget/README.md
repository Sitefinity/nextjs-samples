# Script Widget

The Script widget allows you to embed JavaScript code or external script files on your pages. You can also use it to paste embed codes from third-party tools, such as Google Analytics, social media widgets, or other tracking solutions. This widget provides functionality equivalent to both the JavaScript widget and Embed Code widget from Sitefinity's ASP.NET MVC renderer.

## Overview

The script widget enables dynamic script insertion through three modes: **Inline**, **BodyTop**, and **BodyBottom**.

### Inline Mode
The widget displays the script content directly where placed in the page editor. The script is rendered inline at that specific location in the page markup.

### BodyTop and BodyBottom Modes
These modes register scripts with the script injection system. The **ScriptInjector** components subsequently retrieve these scripts and position them at the start or end of the body element in the page template.

## Required Setup

Two critical configurations are needed:

1. **Include ScriptInjector components in the page template** - Add `ScriptInjectorBodyTop` and `ScriptInjectorBodyBottom` components to your page template
2. **Pass RequestContext to ScriptInjectors** - The ScriptInjector components require the `RequestContext` to access the layout data

**Important:** This custom template configuration is required for every page where the Script widget is placed with BodyTop or BodyBottom location.

## Implementation

### 1. Page Template Integration

Add the ScriptInjector components to your page template (e.g., `src/app/templates/sitefinity-template.tsx`):

```tsx
import { ScriptInjectorBodyTop, ScriptInjectorBodyBottom } from '../widgets/script/script-injector';

export function SitefinityTemplate({ widgets, requestContext }: {
    widgets: { [key: string]: ReactNode[] };
    requestContext: RequestContext;
}): JSX.Element {
    return (
      <>
        <ScriptInjectorBodyTop requestContext={requestContext} />
        <header data-sfcontainer="Header">
          {widgets['Header']}
        </header>
        <main data-sfcontainer="Content">
          {widgets['Content']}
        </main>
        <footer data-sfcontainer="Footer">
          {widgets['Footer']}
        </footer>
        <ScriptInjectorBodyBottom requestContext={requestContext} />
      </>
    );
}
```

### 2. How It Works

The implementation consists of three main components:

**Script Widget** (`script.tsx`)
- Main widget component that renders inline scripts or returns null for BodyTop/BodyBottom scripts
- In edit mode, displays a preview of the script with location information
- Server-side component that processes the widget configuration

**ScriptInjector** (`script-injector.tsx`)
- Scans the page layout to find all Script widgets with BodyTop or BodyBottom location
- Renders the scripts at the appropriate positions in the page template
- Disabled in edit mode to prevent script execution during page editing

**ScriptEntity** (`script.entity.ts`)
- Designer metadata defining the widget properties
- Configures the widget editor interface in Sitefinity

## Usage in Sitefinity

1. Add the **Script** widget to a page in the Sitefinity page editor
2. Configure the widget properties:
   - **Script location**: Select where the script should be placed (Inline, Body top, or Body bottom)
   - **Script**: Enter your script code with its wrapping tag (e.g., `<script>console.log('Hello');</script>`)

### Example Configurations

#### Inline Script
```
Location: Inline
Script: <script>console.log('Hello from inline script');</script>
```

#### External Script (Body Bottom)
```
Location: Body bottom
Script: <script src="https://cdn.example.com/analytics.js" async></script>
```

#### Google Analytics (Body Top)
```
Location: Body top
Script:
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-XXXXX-Y', 'auto');
  ga('send', 'pageview');
</script>
```

## Key Implementation Details

- **Server-Side Rendering**: The Script widget is a server component that processes during page rendering
- **Edit Mode Preview**: In edit mode, shows the first 3 lines of the script with a location hint
- **Layout Scanning**: ScriptInjector components scan the entire widget tree to find Script widgets
- **Unique IDs**: Each script gets a unique ID based on placeholder, location, and widget ID
- **HTML Injection**: Scripts are injected using `dangerouslySetInnerHTML` for direct HTML rendering
