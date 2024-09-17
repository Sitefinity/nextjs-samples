'use client';

import { useContext } from 'react';
import { CarContext, DEFAULT_CAR } from '../../carcontext';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { ColorEntity } from './color.entity';

const colors = ['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow'];

export function ColorFormWidget(props: WidgetContext<ColorEntity>) {
  const {
    car,
    dispatch
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = props.requestContext.isEdit ? {car: DEFAULT_CAR, dispatch: () => {}} : useContext(CarContext);

  const attributes = htmlAttributes(props);

  return (<div {...attributes}>
    <div className="container">
      <h3>Choose car color:</h3>
      <div className="row">
        {
          colors.map((color, idx) => {
          return (<div key={idx} className="col">
            <label>
              <input type="radio" value={color} checked={car?.color === color} className="card-input-element" onChange={e => dispatch({
             type: 'color',
             value: color
             })} />
              <div className="card card-default card-input">
                <div className="card-header">{color}</div>
                <div className="card-body" style={{ backgroundColor: color }} />
              </div>
            </label>
          </div>);
             })
          }
      </div>
    </div>
  </div>);
}
