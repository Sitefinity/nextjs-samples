# Widget personalization

Creating a personalized version of a widget follows the [standard procedure in the new WYSIWYG editor](https://www.progress.com/documentation/sitefinity-cms/personalize-widgets). The personalized widgets are rendered **after** the page has been loaded on the front end, which means that:
- they are not part of the initial page render
- they should not be cached
- they are not indexed by search engines
- have their own request that is fired after the page has been served to the client

There are some specifics to this approach. We do not want a CDN to cache these versions and serve by mistake personalized content to an anonymous user and vice versa, and not all types of widgets can be properly personalized at this point. Due to current limitations in the NextJS framework hydration extensibility **only strictly SSR and strictly CSR widgets will be properly personalized**.

This means that if an SSR component hosts a CSR part, the CSR part will only appear as markup on the front end, but its interactions will not be properly attached. If the component is fully CSR, we will render it via the react APIs on the FE and all of its interactability will be loaded.

### Notable things

Our default implementation of the **Form widget** and its children widget is with mixed SSR components. To take advantage of our OOB form widgets in a personalized widget scenario, please [switch to using their OOB CSR variation](https://github.com/Sitefinity/nextjs-samples/blob/main/docs/Widgets.md#form-widgets).

### Examples

#### Properly working widget personalization

```tsx
'use server'

export async function FullServerComponent(props: WidgetContext) {
    // ...

    return (<>
        <div>This widget will be properly working when personalized</div>
        <ChildServerComponent />
    </>);
}
async function ChildServerComponent() {
    return (
        <div>This child widget will also be properly working when personalized</div>
    );
}

```

```tsx
'use client'

export function FullClientComponent(props: WidgetContext) {
    // ...

    return (<>
        <div>This widget will be properly working when personalized</div>
        <ChildClientComponent />
    </>);
}
async function ChildServerComponent() {
    return (
        <div>This child widget will also be properly working when personalized</div>
    );
}

```

#### Widgets that will not be interactable when personalized

```tsx
// parent-component.tsx
'use server'
export async function ServerComponentWithCSRChild(props: WidgetContext) {
    // ...

    return (<>
        <div>This part of the parent widget will be properly working when personalized</div>
        <ChildServerComponent />
    </>);
}

// child-component.tsx
'use client'
export function ChildServerComponent() {
    return (
        <div>This child widget will NOT be properly interactable when personalized</div>
    );
}
```
