# Custom section sample
This sample demonstrates how to setup a custom section component that can have static placeholders defined in the html. In this example there are four different views that illustrate the different behavior of the placeholder tags when decorated with the specific classes - Container, ContainerFluid, Mixed placeholders and hardcoded three placeholders with the same width.

>**NOTE**: To define your own custom sections, you can decorate several html tags (div, header, footer, aside, section, main, body) with the data-sfcontainer="your_placeholder_name" attribute, which will enable users to drop into different placeholders from scratch.

## Passing data from parent to child component
This sample additionally demonstrates how you can pass data from a parent section widget to a child. This is done through working with the **WidgetModel** interface. Using the interface we are passing additional data to the child components through the use of the 'Properties' property on each of the child widgets. For reference see the [StaticSection widget](./src/app/widgets/custom-section/static-section.tsx) and the view of the [Child widget](./src/app/widgets/child/child.tsx)
