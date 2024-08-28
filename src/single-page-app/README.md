# Single Page Application
## Overview
The sample represents a simple car configuration Single Page Application (SPA) in which navigation between different components happens without refreshing the page.

## Quick start
Open a terminal and navigate to the folder where `package.json` file is and execute the following commands in that order: `npm i` -> `npm run dev`. The application should start and be available for browsing on `https://localhost:5001`.

## How it works
### Registration of routes
The entry point is the [page.tsx](./src/app/page.tsx) file where the route configuration is done by taking advantage of the [React BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router) which is the one that takes care of the navigation.

To register a new custom route with custom component:
- Create a custom component that will hold the html. Follow the examples in the [components](./src/app/components/) folder
- Open the `routes.tsx` file and add a new object into the array:
```tsx
{
    url: '/newcustomroute', // the route on which the component will be visible
    title: 'Custom title', // title that will be shown in the nav bar
    element: (<CustomComponent />), // the component function
    showInNavigation: true // whether the title should be shown in the nav bar
}
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
- Open `page.tsx` and update the initial value:
```tsx
const [car, dispatch] = useReducer(
    carReducer,
    {
      cartype: 'none',
      engine: 'none',
      color: 'none',
      rims: 'none' // the new trait for the car
    }
);
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
