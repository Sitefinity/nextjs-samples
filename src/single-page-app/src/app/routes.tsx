import { CarType } from './components/cartype';
import { Engine } from './components/engine';
import { Color } from './components/color';
import { Summary } from './components/summary';
import { Home } from './components/home';

export const routes = [
    {
      url: '/',
      title: 'Home',
      element: (<Home/>),
      showInNavigation: true
    },
    {
      url: '/cartype',
      title: 'Car type',
      element: (<CarType />),
      showInNavigation: true
    },
    {
      url: '/engine',
      title: 'Engine',
      element: (<Engine />),
      showInNavigation: true
    },
    {
      url: '/color',
      title: 'Color',
      element: (<Color />),
      showInNavigation: true
    },
    {
      url: '/summary',
      title: 'Car summary',
      element: (<Summary />),
      showInNavigation: false
    }
  ];
