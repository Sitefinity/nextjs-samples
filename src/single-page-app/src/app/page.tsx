'use client';

import './styles/styles.css';

import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Summary } from './components/summary';
import { CarContext, carReducer } from './carcontext';
import { routes } from './routes';

export default function Render() {
  const [render, setRender] = useState(false);
  useEffect(() => setRender(true), []);
  return render ? <DefaultCarConfigRender /> : null;
}

function DefaultCarConfigRender() {
  const [car, dispatch] = useReducer(
    carReducer,
    {
      cartype: 'none',
      engine: 'none',
      color: 'none'
    }
  );

  return (
    <CarContext.Provider value={{
      car,
      dispatch
    }}>
      <Router>
        <ul className="nav nav-pills justify-content-center mb-4">
          {
            routes.map((route, idx) => {
              if (route.showInNavigation) {
                return (<li key={idx} className="nav-item">
                  <NavLink end={true}
                    to={route.url}
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    {route.title}
                  </NavLink>
                </li>);
              }
              return null;
            })
          }
        </ul>
        <div className="container">
          <div className="row">
            <div className="col">
              <Routes>
                {routes.map((route, idx) => {
                  return (<Route key={idx} path={route.url} element={route.element} />);
                })
                }
              </Routes>
            </div>
            <Summary />
          </div>
        </div>
      </Router>
    </CarContext.Provider>
  );
}
