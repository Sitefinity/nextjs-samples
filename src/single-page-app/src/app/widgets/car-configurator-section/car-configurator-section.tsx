'use client';

import '../../styles/styles.css';

import React, { useEffect, useReducer, useState } from 'react';
import { Routes, Route, NavLink, HashRouter } from 'react-router-dom';
import { carReducer, CarContext, DEFAULT_CAR } from '../../carcontext';
import { Summary } from '../../components/summary';
import { routes } from '../../routes';
import { WidgetContext, htmlAttributes, RenderWidgetService, WidgetModel, getMinimumMetadata } from '@progress/sitefinity-nextjs-sdk';
import { CarConfiguratorSectionEntity } from './car-configurator-section.entity';

export default function CarConfiguratorSection(props: WidgetContext<CarConfiguratorSectionEntity>) {
  const [render, setRender] = useState(false);
  useEffect(() => setRender(true), []);
  return render ? <DefaultCarConfigRender {...props}/> : null;
}

function DefaultCarConfigRender(props: WidgetContext<CarConfiguratorSectionEntity>) {
    const column = populateColumn(props);
    const dataAttributes = htmlAttributes(props);

    const [car, dispatch] = useReducer(
        carReducer,
        DEFAULT_CAR
      );

    return (
      <CarContext.Provider value={{
      car,
      dispatch
    }}>
        <HashRouter>
          <section className="row" {...dataAttributes}>
            <div {...column.attributes}>
              <ul className="nav nav-pills justify-content-center mb-4">
                {column.children.map((y, idx) => {
                    const route = routes.find(x => x.name === y.model.Name)!;
                    const carTraitValue = (car as any)[y.model.Name.toLocaleLowerCase()];
                    return (<li key={idx} className="nav-item">
                      <input type="text" hidden={true} name={y.model.Properties.SfFieldName} value={carTraitValue} readOnly={true} />
                      <NavLink end={true}
                        to={route.url}
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'
                      }
                    >
                        {route.title}
                      </NavLink>
                    </li>);
                })}
              </ul>
              {
                props.requestContext.isEdit ? renderInEdit(column, props) : renderInLive(column, props)
            }
            </div>
          </section>
        </HashRouter>
      </CarContext.Provider>
    );
}

function populateColumn(context: WidgetContext<CarConfiguratorSectionEntity>): FormSectionColumnHolder {
    const columnName = 'Column1';
      let children: Array<FormSectionComponentContainer> = [];
      if (context.model.Children) {
        children = context.model.Children.filter(x => x.PlaceHolder === columnName).map((x => {
            const ret: WidgetContext<any> = {
                model: x,
                metadata: getMinimumMetadata(RenderWidgetService.widgetRegistry.widgets[x.Name], context.requestContext.isEdit),
                requestContext: context.requestContext
            };

            return ret;
        }));
      }

      const column: FormSectionColumnHolder = {
          attributes: {
              className: 'col-md'
          },
          children: children
      };

      if (context.requestContext.isEdit) {
          column.attributes['data-sfcontainer'] = columnName;
          column.attributes['data-sfplaceholderlabel'] = columnName!;
      }


    return column;
}

function renderInLive(formSectionColumnHandler: FormSectionColumnHolder, props: WidgetContext<CarConfiguratorSectionEntity>) {
  return (<div className="container">
    <div className="row">
      <div className="col">
        <Routes>
          {formSectionColumnHandler.children.map((y, idx) => {
          const route = routes.find(x => x.name === y.model.Name)!;
          const widget = RenderWidgetService.createComponent(y.model, props.requestContext, null);

          return (<>
            {idx === 0 && <Route key={idx + '0'} path="/" element={widget} />}
            <Route key={idx} path={route.url} element={widget} />
          </>);
      })}
        </Routes>
      </div>
      <Summary />
    </div>
  </div>);
}

function renderInEdit(formSectionColumnHandler: FormSectionColumnHolder, props: WidgetContext<CarConfiguratorSectionEntity>) {
    return (<>{formSectionColumnHandler.children.map(y => {
        const widget = RenderWidgetService.createComponent(y.model, props.requestContext, null);

        return widget;
    })}</>);
}

export interface FormSectionColumnHolder {
    children: Array<FormSectionComponentContainer>
    attributes: { [key: string]: string }
}

export interface FormSectionComponentContainer {
    model: WidgetModel<any>;
}
