# Single Page Application

## Overview
The sample represents a simple car configuration form done as a Single Page Application (SPA) in which navigation between the different form widgets happens without refreshing the page. The form can be submitted when all of the car traits are populated. The form response can be then previewed by navigating to Content -> Forms and then selecting the form responses of the submitted form.

## Project setup
 - Follow the instructions [here](./../../README.md#project-setup).
 - Open a terminal and navigate to the folder where `package.json` file is and execute the following commands in that order: `npm i react-router-dom` -> `npm run dev`. The application should start and be available for browsing on `https://localhost:5001`. The package `react-router-dom` is needed for the SPA functionality to work.

## How it works
### Registration of routes
There is a standard Sitefinity section widget which holds the logic for registering the routes on which the separate form widgets (car, engine, color) will be visualized and also visualizes the links from which navigation can be done. It uses the [React BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router) which takes care of the navigation. For simplicity, the widgets do not have widget designers and because of that they are marked with `IsEmptyEntity` in the widget registry. Moreover, all of the other app widgets are filtered out in the widget registry leaving only the ones necessary for this example.

To create a new form widget:
- Create a component that will hold the html. Follow the examples in the [widgets](./src/app/widgets/) folder
- Open the `routes.tsx` file and add a new object into the array:
```tsx
{
    name: 'customwidget', // the unique name of the widget with which it is registered in the widget registry
    url: '/newcustomroute', // the route on which the widget will be visible
    title: 'Custom title', // title that will be shown in the nav bar
}
```
- Register it in the widget registry next to the other ones:
```tsx
'CustomWidgetName': {
    entity: CustomWidgetEntity,
    componentType: CustomWidgetFunction,
    editorMetadata: {
        Title: 'Custom widget',
        Toolbox: 'Forms',
        Category: 'Content',
        IsEmptyEntity: true,
        InitialProperties: {
            SfFieldType: 'ShortText'
        }
    },
    ssr: false
}
```
Since widgets are hidden/shown in the HTML based on the route, the submit of the form will not include inputs in the payload that are not visible. This is why `car-configurator-section.tsx` has the following line placing the car traits as hidden inputs so that when submit is clicked, the data will be sent with the form response request:
```tsx
<input type="text" hidden={true} name={y.model.Properties.SfFieldName} value={carTraitValue} readOnly={true} />
```

### Updating the context state
The sample uses [React's useContext hook](https://react.dev/reference/react/useContext) to store the information about the properties selected for the car.

It can be used in the following way:
```tsx
import { useContext } from "react";
import { CarContext } from "../carcontext";

export function CustomComponent() {
    const {
        car, // this object holds the current state of the car
        dispatch // this is a function used to dispatch an action to set a new state for the car
    } = useContext(CarContext);

    // set a new value for the engine
    dispatch({
        type: 'engine',
        value: 'Diesel'
    });
}
```

### Extending the context state
The car state can be extended to have additional properties:
- Open `carcontext.tsx` and update the default car value:
```tsx
export const DEFAULT_CAR = {
    cartype: 'none',
    engine: 'none',
    color: 'none',
    rims: 'none' // the new trait for the car
};
```
- Open [carcontext.tsx](./src/app/carcontext.ts) file and add another switch case to handle the dispatch action for the new car trait:
```ts
case 'rims': {
        return {
            cartype: car.cartype,
            engine: car.engine,
            color: car.color,
            rims: action.value
    }
}
```
- Update can now be done in any component function:
```tsx
const {
    car,
    dispatch
} = useContext(CarContext);

// set a new value for the rims
dispatch({
    type: 'rims',
    value: '16'
});
```
