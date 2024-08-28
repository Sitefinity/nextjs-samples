# Sitefinity Data Widget
An example of how to create a widget that consumes data from Sitefinity.

In many cases, custom widgets need to retrieve and display items from Sitefinity. Using this example, you can work with various types of content stored in Sitefinity, such as news items, content blocks, blogs, blog posts, media, dynamic items, and more.
In this instance, we are working with news items.

This sample uses the **RestClient** to access data within Sitefinity. The widget can be configured through the widget designer to determine how many news items to retrieve and whether to additionally show their summaries. These options are available in the widget's entity, [SitefinityDataEntity](./src/app/widgets/sitefinity-data/sitefinity-data.entity.ts), under **ShowSummary** and **ItemsCount**.

In [SitefinityData](./src/app/widgets/sitefinity-data/sitefinity-data.tsx), we retrieve the items through the **RestClient** by specifying the item's *type* and the *take* count parameters. The type parameter should be the full name of the type. Predefined types are available in the RestSdkTypes collection. If you're working with a custom dynamic module, you should also use the full namespace of the module, such as *Telerik.Sitefinity.DynamicTypes.Model.Pressreleases.PressRelease*.
You can further refine the items you retrieve by providing additional arguments to the getItems request, such as skip, take, orderBy, filter, provider, or culture.

In [SitefinityDataDefaultView](./src/app/widgets/sitefinity-data/sitefinity-data.view.tsx), we render the list of items, taking into consideration whether to render only the title or both the title and summary based on the option selected in the designer.
