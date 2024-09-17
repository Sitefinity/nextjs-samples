# Localized Hello World

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).

## Localizing via local dictionaries

This sample demonstrates a Hello World widget with a localized label.
By using this approach, you can localize any resource in your widget.

Let’s assume your application supports three cultures: English, German and Bulgarian.
We maintain different dictionaries, which are objects that map resource keys to localized strings. There should be a separate dictionary for each culture your app supports.
In our case, we have three dictionaries: [en](./src/app/widgets/localization/dictionaries/en.json), [de](./src/app/widgets/localization/dictionaries/de.json) and [bg](./src/app/widgets/localization/dictionaries/bg.json).

There are two different samples for working with these dictionaries: SSR with a custom implementation and CSR with i18n.

### 1. SSR sample with custom implementation

In this approach, we need a getDictionary function to load the translations for the requested locale. You can see the implementation [here](./src/app/widgets/localization/dictionaries.ts).

After that, you can use these dictionaries to fetch the necessary strings in your widget by requesting them with the currently selected culture, as shown [here](./src/app/widgets/localization/localized-hello-world.tsx).
The required labels will be localized from the dictionary according to the requested culture of the page.

### 2. CSR sample with i18n

In this approach, we first need to configure i18n. You can see the sample configuration [here](./src/app/widgets/localization/i18n.ts).
Pass the i18n instance to react-i18next. Import the dictionaries and pass them as resources on the i18n initialization.
For all the i18n initialization options, you can read [here](https://www.i18next.com/overview/configuration-options).

After that, you can use the localization with these dictionaries in your widget by using the `Trans` tag with the needed key from the dictionary like this:
```js
<Trans i18nKey="message" />
```

Set the currently selected culture:
```js
i18n.changeLanguage(props.requestContext.culture);
```

The implementation is shown [here](./src/app/widgets/localization/localized-hello-world-CSR.tsx).
The required labels will be localized from the dictionary according to the requested culture of the page.


## Localizing in widget designers

Another way to translate properties is manually through the widget designers.
This can be done by exposing the localized resources as properties in the widget designer. In this example, it is demonstrated via the Content property.
After the translation, the widget resolves the version of the properties for the current language of the page. Except for the Section widget, all the other widgets support property localization and each property can be localized independently. Additionally, when working on a synced page, you can override all translated versions with the current one by saving the widget with the option "Save all translations".

For additional setup and development instructions, see [Setup](https://github.com/sitefinity/nextjs-samples).
